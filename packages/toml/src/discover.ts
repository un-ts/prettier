import { existsSync } from 'node:fs'
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
 * @see https://github.com/tombi-toml/tombi/blob/main/docs/src/routes/docs/configuration.mdx#user-level
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

  globalCandidates = candidates
  return candidates
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
async function searchCandidates(
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

const configCache = new Map<
  string,
  Promise<DiscoveredTombiConfig | undefined>
>()
let globalConfigCache: Promise<DiscoveredTombiConfig | undefined> | undefined

const getGlobalConfig = () =>
  (globalConfigCache ??= searchCandidates(getGlobalCandidates()))

const discoverConfig = async (directory: string) =>
  (await searchCandidates(getProjectCandidates(directory))) ?? getGlobalConfig()

/**
 * Discover the Tombi configuration for a file, following Tombi's documented
 * search priority. Results are cached per directory.
 */
export function discoverTombiConfig(
  filepath: string,
): Promise<DiscoveredTombiConfig | undefined> {
  const directory = path.dirname(path.resolve(filepath))

  let cached = configCache.get(directory)
  if (!cached) {
    cached = discoverConfig(directory)
    configCache.set(directory, cached)
  }

  return cached
}
