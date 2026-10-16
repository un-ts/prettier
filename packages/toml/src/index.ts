import { type Diagnostic, format as formatToml } from '@tombi-toml/lib'
import type { Plugin } from 'prettier'
import { stringify } from 'smol-toml'

import {
  getTombiConfig,
  getTombiOverrides,
  mergeTombiConfig,
} from './config.js'
import { discoverTombiConfig } from './discover.js'
import { languages } from './languages.js'
import { prettierOptionsDefinitions } from './options.js'
import type { PrettierOptions } from './types.js'

const PLUGIN_NAME = 'toml'

/** Error thrown when Tombi reports one or more error level diagnostics. */
class TombiFormatError extends SyntaxError {
  declare loc: { start: { line: number; column: number } }

  constructor(diagnostic: Diagnostic) {
    super(diagnostic.message)
    this.name = 'TombiFormatError'
    this.cause = diagnostic
    this.loc = {
      start: {
        line: diagnostic.range.start.line + 1,
        column: diagnostic.range.start.column + 1,
      },
    }
  }
}

/**
 * Build the Tombi configuration for a file, merging a discovered `tombi.toml`
 * (or `[tool.tombi]` in `pyproject.toml`) with the resolved Prettier options.
 */
async function resolveConfig(options: PrettierOptions) {
  const prettierConfig = getTombiConfig(options)
  const discovered = await discoverTombiConfig(options.filepath)

  return discovered
    ? {
        content: stringify(
          mergeTombiConfig(
            prettierConfig,
            discovered.config,
            getTombiOverrides(options),
          ),
        ),
        path: discovered.path,
      }
    : {
        content: stringify(prettierConfig),
        path: 'tombi.toml',
      }
}

/**
 * Format a TOML document with Tombi. Error diagnostics are thrown as a
 * {@link TombiFormatError} so Prettier can render them with a code frame.
 */
async function format(code: string, options: PrettierOptions) {
  const { formatted, diagnostics } = await formatToml(code, options.filepath, {
    config: await resolveConfig(options),
  })

  if (formatted == null) {
    const diagnostic =
      diagnostics.find(({ level }) => level === 'error') ?? diagnostics.at(0)

    if (!diagnostic) {
      throw new SyntaxError('Tombi failed to format the TOML document.')
    }

    throw new TombiFormatError(diagnostic)
  }

  return formatted
}

const TomlPlugin: Plugin<string> = {
  languages,
  parsers: {
    [PLUGIN_NAME]: {
      parse: (code: string, options: PrettierOptions) => format(code, options),
      astFormat: PLUGIN_NAME,
      locStart: () => -1,
      locEnd: () => -1,
    },
  },
  printers: {
    [PLUGIN_NAME]: {
      print: ({ node }) => node,
    },
  },
  options: prettierOptionsDefinitions,
}

export type * from './config.js'
export type * from './types.js'

export default TomlPlugin
