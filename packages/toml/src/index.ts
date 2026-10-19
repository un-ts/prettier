import type { Plugin } from 'prettier'
import { type Diagnostic, format as formatToml } from 'tombit'

import { getTombiConfig } from './config.js'
import { languages } from './languages.js'
import { prettierOptionsDefinitions } from './options.js'
import type { PrettierOptions } from './types.js'

const PLUGIN_NAME = 'toml'

/** Error thrown when Tombi reports one or more error level diagnostics. */
class TombiFormatError extends SyntaxError {
  declare cause: Diagnostic
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
 * Format a TOML document with Tombi. Tombi discovers the configuration itself
 * (`.tombi.toml`, `tombi.toml`, `.config/tombi.toml` and `[tool.tombi]` in
 * `pyproject.toml` from the file's directory upward, then the user and system
 * configurations). Prettier's resolved options, including its defaults, are
 * merged on top; `toml-version` is only overridden when the `tomlVersion`
 * option is set.
 *
 * The schema lookup is always disabled: this plugin is a formatter, so schema
 * driven ordering must not affect the output and the remote schema catalogs
 * must never be fetched.
 */
async function format(code: string, options: PrettierOptions) {
  // Prettier may omit the filepath; a synthetic name still allows discovery.
  const filepath = options.filepath || 'stdin.toml'
  const { formatted, diagnostics } = await formatToml(code, filepath, {
    // Prettier's options are authoritative; tombi.toml supplies the rest.
    overrideConfig: getTombiConfig(options),
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
