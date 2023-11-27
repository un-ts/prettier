import taplo from '@taplo/lib'
import type { Plugin } from 'prettier'

import { languages } from './languages.js'
import { prettierOptionsDefinitions } from './options.js'
import type { PrettierOptions, TaploOptions } from './types.js'

const PLUGIN_NAME = 'toml'

let taploIns: taplo.Taplo | undefined

async function format(code: string, options: TaploOptions) {
  if (!taploIns) {
    taploIns = await taplo.Taplo.initialize()
  }

  return taploIns.format(code, { options })
}

const TomlPlugin: Plugin<string> = {
  languages,
  parsers: {
    [PLUGIN_NAME]: {
      async parse(code: string, options: PrettierOptions) {
        return await format(code.trim(), {
          ...options,
          columnWidth: options.printWidth,
          indentString: options.useTabs ? '\t' : ' '.repeat(options.tabWidth),
          trailingNewline: true,
          arrayTrailingComma: options.trailingComma !== 'none',
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

export type * from './options.js'
export type * from './types.js'

export default TomlPlugin
