import { Taplo } from '@taplo/lib'
import type { Plugin } from 'prettier'

import { options } from './options'
import type { PrettierOptions, TaploOptions } from './types'

const PLUGIN_NAME = 'toml'

let taplo: Taplo | null = null

async function format(code: string, options: TaploOptions) {
  if (!taplo) {
    taplo = await Taplo.initialize()
  }

  return taplo.format(code, { options })
}

function removeBeginningTrailingNewline(code: string) {
  code = code.replace(/^(?:\r?\n)+/, '')
  code = code.replace(/(?:\r?\n)+$/, '')

  return code
}

const TomlPlugin: Plugin<string> = {
  languages: [
    {
      name: PLUGIN_NAME,
      parsers: [PLUGIN_NAME],
    },
  ],
  parsers: {
    [PLUGIN_NAME]: {
      async parse(code: string, options: PrettierOptions) {
        const indentString = options.useTabs
          ? '\t'
          : ' '.repeat(options.tabWidth)

        const taploOptions: TaploOptions = {
          ...options,
          columnWidth: options.printWidth,
          indentString,
          trailingNewline: true,
          arrayTrailingComma: options.trailingComma !== 'none',
          allowedBlankLines: 1,
          crlf: options.endOfLine === 'crlf',
        }

        return await format(removeBeginningTrailingNewline(code), taploOptions)
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
  options,
}

export default TomlPlugin
