import { existsSync, watch, type FSWatcher } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

import { parse } from 'smol-toml'

import type { TombiConfig } from './config.js'

/** A discovered Tombi configuration file. */
export interface DiscoveredTombiConfig {
  config: TombiConfig
  path: string
}

const CONFIG_FILENAMES = [
  '.tombi.toml',
  'tombi.toml',
  path.join('.config', 'tombi.toml'),
]

const PYPROJECT_FILENAME = 'pyproject.toml'

/** Basenames that change which configuration applies when created or changed. */
const CONFIG_BASENAMES = new Set([
  '.tombi.toml',
  'tombi.toml',
  PYPROJECT_FILENAME,
])

/** Project level candidates, for a directory and each of its ancestors. */
const getProjectCandidates = (directory: string): string[] => {
  const candidates: string[] = []
  let current = directory

  for (;;) {
    for (const filename of CONFIG_FILENAMES) {
      candidates.push(path.join(current, filename))
    }
    candidates.push(path.join(current, PYPROJECT_FILENAME))

    const parent = path.dirname(current)
    if (parent === current) {
      break
    }
    current = parent
  }

  return candidates
}

let globalCandidates: string[] | undefined

/** Platform specific user and system level config locations. */
const getPlatformCandidates = (home: string): string[] => {
  if (process.platform === 'darwin') {
    return [
      path.join(home, 'Library', 'Application Support', 'tombi', 'config.toml'),
    ]
  }

  if (process.platform === 'win32') {
    const appData = process.env.APPDATA
    return appData ? [path.join(appData, 'tombi', 'config.toml')] : []
  }

  return ['/etc/tombi/config.toml']
}

/**
 * User and system level candidates, used as a fallback when no project level
 * configuration is found. Cached because it does not depend on the file.
 *
 * @see https://tombi-toml.github.io/tombi/docs/configuration#user-level
 */
const getGlobalCandidates = (): string[] => {
  if (globalCandidates) {
    return globalCandidates
  }

  const home = homedir()
  const xdgConfigHome = process.env.XDG_CONFIG_HOME
  const candidates = [
    ...(xdgConfigHome
      ? [path.join(xdgConfigHome, 'tombi', 'config.toml')]
      : []),
    path.join(home, '.config', 'tombi', 'config.toml'),
    ...getPlatformCandidates(home),
  ]

  globalCandidates = [...new Set(candidates)]
  return globalCandidates
}

/** Parse a config file, extracting `[tool.tombi]` from `pyproject.toml`. */
const parseConfig = (
  content: string,
  configPath: string,
): TombiConfig | undefined => {
  const parsed = parse(content) as Record<string, unknown>
  if (path.basename(configPath) === PYPROJECT_FILENAME) {
    const tool = parsed.tool as Record<string, unknown> | undefined
    return tool?.tombi as TombiConfig | undefined
  }
  return parsed
}

/** Search the given candidates and return the first usable configuration. */
async function findConfig(
  candidates: Iterable<string>,
): Promise<DiscoveredTombiConfig | undefined> {
  for (const candidate of candidates) {
    if (!existsSync(candidate)) {
      continue
    }
    try {
      const config = parseConfig(await readFile(candidate, 'utf8'), candidate)
      if (config) {
        return { config, path: candidate }
      }
    } catch {
      // Ignore unreadable or invalid config files and keep searching.
    }
  }

  return undefined
}

const projectCache = new Map<
  string,
  Promise<DiscoveredTombiConfig | undefined>
>()
let globalConfigCache: Promise<DiscoveredTombiConfig | undefined> | undefined

const configWatchers = new Map<string, FSWatcher>()

/**
 * Drop the cached project results whose search traverses `directory`: the
 * directory itself and every directory below it.
 */
const invalidateProjectCache = (directory: string) => {
  const prefix = directory + path.sep
  for (const cached of projectCache.keys()) {
    if (cached === directory || cached.startsWith(prefix)) {
      projectCache.delete(cached)
    }
  }
}

const invalidateGlobalConfig = () => {
  globalConfigCache = undefined
}

/**
 * Best effort watch of a config file so long-lived consumers (an editor or a
 * daemon) pick up changes without restarting. The directory is watched rather
 * than the file because editors usually save atomically by renaming a temporary
 * file over the target. Watchers stay alive for the process lifetime and are
 * unref'd so they never keep it running.
 */
const watchConfig = (configPath: string, onConfigChange: () => void) => {
  if (configWatchers.has(configPath)) {
    return
  }

  const directory = path.dirname(configPath)
  const basename = path.basename(configPath)

  try {
    const watcher = watch(directory, (_event, filename) => {
      const changed = filename == null ? undefined : path.basename(filename)
      if (
        changed == null ||
        changed === basename ||
        CONFIG_BASENAMES.has(changed)
      ) {
        onConfigChange()
      }
    })
    watcher.on('error', onConfigChange)
    watcher.unref()
    configWatchers.set(configPath, watcher)
  } catch {
    // Watching is best effort, ignore runtimes that do not support it.
  }
}

const getProjectConfig = (directory: string) => {
  let cached = projectCache.get(directory)
  if (!cached) {
    cached = findConfig(getProjectCandidates(directory)).then(config => {
      if (config) {
        const configDirectory = path.dirname(config.path)
        watchConfig(config.path, () => invalidateProjectCache(configDirectory))
      }
      return config
    })
    projectCache.set(directory, cached)
  }
  return cached
}

/**
 * The global configuration is a single value resolved from a short, fixed list
 * of candidates, so all of them are watched: creating a higher priority file
 * (for example `$XDG_CONFIG_HOME/tombi/config.toml`) has to invalidate it.
 */
const watchGlobalCandidates = () => {
  for (const candidate of getGlobalCandidates()) {
    watchConfig(candidate, invalidateGlobalConfig)
  }
}

const getGlobalConfig = () => {
  if (!globalConfigCache) {
    watchGlobalCandidates()
    globalConfigCache = findConfig(getGlobalCandidates())
  }
  return globalConfigCache
}

/**
 * Discover the Tombi configuration for a file, following Tombi's documented
 * search priority. Project results are cached per directory and invalidated
 * when a config file the directory depends on changes.
 */
export async function discoverTombiConfig(
  filepath: string,
): Promise<DiscoveredTombiConfig | undefined> {
  const directory = path.dirname(path.resolve(filepath))
  const project = await getProjectConfig(directory)
  return project ?? getGlobalConfig()
}
