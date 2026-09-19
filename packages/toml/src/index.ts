import type { Diagnostic } from '@tombi-toml/wasm-lib'
import type { Plugin } from 'prettier'

import { buildTombiConfig } from './config.js'
import { languages } from './languages.js'
import { prettierOptionsDefinitions } from './options.js'
import type { PrettierOptions } from './types.js'
import { loadWasm } from './wasm.js'

const PLUGIN_NAME = 'toml'

type Tombi = typeof import('@tombi-toml/wasm-lib')

/**
 * The published `@tombi-toml/wasm-lib` type declaration re-exports
 * `./tombi_wasm` without a file extension, which `moduleResolution: node16`
 * cannot follow, so `initSync` is missing from the inferred module type.
 */
interface TombiWasmInit {
  initSync(module: { module: BufferSource | WebAssembly.Module }): unknown
}

let tombiPromise: Promise<Tombi & TombiWasmInit> | undefined

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
 * Lazily import and initialize the Tombi WASM module, reusing the same instance
 * for every subsequent format call.
 */
async function loadTombi(): Promise<Tombi & TombiWasmInit> {
  tombiPromise ??= (async () => {
    const tombi = (await import('@tombi-toml/wasm-lib')) as Tombi &
      TombiWasmInit
    tombi.initSync({ module: await loadWasm() })
    return tombi
  })()
  return tombiPromise
}

/**
 * Format a TOML document with Tombi. Error diagnostics are thrown as a
 * {@link TombiFormatError} so Prettier can render them with a code frame.
 */
async function format(code: string, options: PrettierOptions) {
  const { format: formatToml } = await loadTombi()

  const { formatted, diagnostics } = await formatToml(code, options.filepath, {
    config: buildTombiConfig(options),
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

export type * from './types.js'

export default TomlPlugin
