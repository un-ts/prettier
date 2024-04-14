import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { format } from 'prettier'

import SqlPlugin, { type SqlFormatOptions } from 'prettier-plugin-sql'

const PARSER_OPTIONS: Record<string, SqlFormatOptions> = {
  556: {
    language: 'mysql',
    endOfLine: 'crlf',
  },
  557: {
    language: 'mysql',
    endOfLine: 'cr',
  },
  558: {
    language: 'mysql',
    endOfLine: 'lf',
  },
  559: {
    language: 'mysql',
    endOfLine: 'auto',
  },
}

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

describe('parser and printer', () => {
  it('printer should handle eol correctly', async () => {
    const fixtures = path.resolve(_dirname, 'fixtures-eol')
    for (const filepath of fs.readdirSync(fixtures)) {
      const input = fs.readFileSync(path.resolve(fixtures, filepath)).toString()

      const caseName = filepath.slice(0, filepath.lastIndexOf('.'))

      try {
        const output = await format(input, {
          filepath,
          parser: 'sql',
          plugins: [SqlPlugin],
          ...PARSER_OPTIONS[caseName],
        })

        expect(JSON.stringify(output)).toMatchSnapshot(filepath)
      } catch (error) {
        expect(error).toMatchSnapshot(filepath)
      }
    }
  })
})
