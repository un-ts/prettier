import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Plugin } from 'prettier'
import { createSyncFn } from 'synckit'

import { FormatFor } from './types.js'

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

const formatFor = createSyncFn<FormatFor>(path.resolve(_dirname, 'worker.js'))

const AutocorrectPlugin: Plugin<string> = {
  languages: [],
  parsers: {
    autocorrect: {
      parse(text) {
        return text
      },
      astFormat: 'autocorrect',
      locStart: () => -1,
      locEnd: () => -1,
    },
  },
  printers: {
    autocorrect: {
      print(path, { filepath }) {
        const result = formatFor(path.getValue(), filepath)
        if (result.error) {
          throw new Error(result.error)
        }
        return result.out
      },
    },
  },
}

export default AutocorrectPlugin
