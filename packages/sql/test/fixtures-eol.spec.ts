import fs from 'node:fs'
import path from 'node:path'

import { format } from 'prettier'

import SqlPlugin, { type SqlFormatOptions } from 'prettier-plugin-sql'

const PARSER_OPTIONS: Partial<Record<string, SqlFormatOptions>> = {
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

describe('parser and printer', () => {
  const fixtures = path.resolve(import.meta.dirname, 'fixtures-eol')

  for (const relativeFilepath of fs.readdirSync(fixtures)) {
    const filepath = path.resolve(fixtures, relativeFilepath)
    const input = fs.readFileSync(filepath, 'utf8')

    const caseName = relativeFilepath.slice(
      0,
      relativeFilepath.lastIndexOf('.'),
    )

    const overrideOptions = PARSER_OPTIONS[caseName]

    it(`printer should handle ${relativeFilepath} eol correctly${
      overrideOptions ? ' with options: ' + JSON.stringify(overrideOptions) : ''
    }`, async () => {
      try {
        const output = await format(input, {
          filepath,
          parser: 'sql',
          plugins: [SqlPlugin],
          ...overrideOptions,
        })

        expect(output).toMatchSnapshot()
      } catch (error) {
        expect(error).toMatchSnapshot()
      }
    })
  }
})
