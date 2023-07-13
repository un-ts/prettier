import fs from 'node:fs'
import path from 'node:path'

import { formatFor, loadConfig } from 'autocorrect-node'
import { Plugin } from 'prettier'

import { languages } from './languages.js'

const cache = new Map<string, string | void>()

const findConfig = (filepath: string, isFile?: boolean): string | void => {
  if (isFile) {
    cache.set(filepath)
    filepath = path.dirname(filepath)
  }

  if (cache.has(filepath)) {
    return cache.get(filepath)
  }

  const configPath = path.join(filepath, '.autocorrectrc')

  if (fs.existsSync(configPath)) {
    cache.set(filepath, configPath)
    return configPath
  }

  cache.set(filepath)

  const dirPath = path.dirname(filepath)

  if (dirPath === filepath) {
    return
  }

  return findConfig(dirPath)
}

let prevConfigPath: string | void

const AutocorrectPlugin: Plugin<string> = {
  languages,
  parsers: {
    autocorrect: {
      parse: text => text,
      astFormat: 'autocorrect',
      locStart: () => 0,
      locEnd: node => node.length,
    },
  },
  printers: {
    autocorrect: {
      print(path, { filepath }) {
        const configPath = findConfig(filepath, true)
        if (prevConfigPath !== configPath) {
          prevConfigPath = configPath
          loadConfig(configPath ? fs.readFileSync(configPath, 'utf8') : '')
        }
        return formatFor(path.node, filepath)
      },
    },
  },
}

export default AutocorrectPlugin
