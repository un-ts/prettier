import { Taplo } from '@taplo/lib'
import type { Plugin } from 'prettier'

import { defaultOptions, options } from './options'
import type { AST, PrettierOptions, TaploOptions } from './types'

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

const TomlPlugin: Plugin<AST> = {
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
          alignEntries: options.taploAlignEntries,
          alignComments: options.taploAlignComments,
          arrayTrailingComma: options.trailingComma !== 'none',
          arrayAutoExpand: options.taploArrayAutoExpand,
          arrayAutoCollapse: options.taploArrayAutoCollapse,
          compactArrays: options.taploCompactArrays,
          compactInlineTables: options.taploCompactInlineTables,
          compactEntries: options.taploCompactEntries,
          columnWidth: options.printWidth,
          indentTables: options.taploIndentTables,
          indentEntries: options.taploIndentEntries,
          indentString,
          trailingNewline: true,
          reorderKeys: options.taploReorderKeys,
          allowedBlankLines: 1,
          crlf: options.endOfLine === 'crlf',
        }

        return {
          formatted: await format(
            removeBeginningTrailingNewline(code),
            taploOptions,
          ),
        }
      },
      astFormat: PLUGIN_NAME,
      locStart: () => -1,
      locEnd: () => -1,
    },
  },
  printers: {
    [PLUGIN_NAME]: {
      print: ({ node: { formatted } }) => formatted,
    },
  },
  defaultOptions,
  options,
}

export default TomlPlugin
