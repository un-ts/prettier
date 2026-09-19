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

/**
 * Project level candidates, checked for every directory from the formatted
 * file's directory up to the filesystem root.
 *
 * @see https://github.com/tombi-toml/tombi/blob/main/docs/src/routes/docs/configuration.mdx#project-level
 */
const getProjectCandidates = (filepath: string): string[] => {
  const candidates: string[] = []
  let directory = filepath
    ? path.dirname(path.resolve(filepath))
    : process.cwd()

  for (;;) {
    for (const filename of CONFIG_FILENAMES) {
      candidates.push(path.join(directory, filename))
    }
    candidates.push(path.join(directory, PYPROJECT_FILENAME))

    const parent = path.dirname(directory)
    if (parent === directory) {
      break
    }
    directory = parent
  }

  return candidates
}

/**
 * User and system level candidates used as a fallback when no project level
 * configuration is found.
 *
 * @see https://github.com/tombi-toml/tombi/blob/main/docs/src/routes/docs/configuration.mdx#user-level
 */
const getGlobalCandidates = (): string[] => {
  const home = homedir()
  const candidates: string[] = []

  const xdgConfigHome = process.env.XDG_CONFIG_HOME
  if (xdgConfigHome) {
    candidates.push(path.join(xdgConfigHome, 'tombi', 'config.toml'))
  }
  candidates.push(path.join(home, '.config', 'tombi', 'config.toml'))

  if (process.platform === 'darwin') {
    candidates.push(
      path.join(home, 'Library', 'Application Support', 'tombi', 'config.toml'),
    )
  } else if (process.platform === 'win32') {
    const appData = process.env.APPDATA
    if (appData) {
      candidates.push(path.join(appData, 'tombi', 'config.toml'))
    }
  } else {
    candidates.push('/etc/tombi/config.toml')
  }

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

/**
 * Discover the Tombi configuration for a file, following Tombi's documented
 * search priority.
 */
export async function discoverTombiConfig(
  filepath: string,
): Promise<DiscoveredTombiConfig | undefined> {
  const candidates = new Set([
    ...getProjectCandidates(filepath),
    ...getGlobalCandidates(),
  ])

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
