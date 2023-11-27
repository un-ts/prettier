import { Taplo } from '@taplo/lib'
import type { Plugin } from 'prettier'

import { languages } from './languages.js'
import { prettierOptionsDefinitions } from './options.js'
import type { PrettierOptions, TaploOptions } from './types.js'

const PLUGIN_NAME = 'toml'

let taplo: Taplo | undefined

async function format(code: string, options: TaploOptions) {
  if (!taplo) {
    taplo = await Taplo.initialize()
  }

  return taplo.format(code, { options })
}

const TomlPlugin: Plugin<string> = {
  languages,
  parsers: {
    [PLUGIN_NAME]: {
      async parse(code: string, options: PrettierOptions) {
        const indentString = options.useTabs
          ? '\t'
          : ' '.repeat(options.tabWidth)

        return await format(code.trim(), {
          ...options,
          columnWidth: options.printWidth,
          indentString,
          trailingNewline: true,
          arrayTrailingComma: options.trailingComma !== 'none',
          allowedBlankLines: 1,
          crlf: options.endOfLine === 'crlf',
        })
      },
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

export default TomlPlugin
