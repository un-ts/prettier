import fs from 'node:fs'
import path from 'node:path'

import { format } from 'prettier'
import { type ParamTypes, postgresql } from 'sql-formatter'

import sql, { type SqlFormatOptions } from 'prettier-plugin-sql'

const PARSER_OPTIONS: Partial<Record<string, SqlFormatOptions>> = {
  144: {
    language: 'postgresql',
  },
  233: {
    paramTypes: JSON.stringify({
      named: [':'],
    } satisfies ParamTypes),
  },
  277: {
    language: 'mysql',
    paramTypes: JSON.stringify({
      custom: [{ regex: String.raw`\{\w+\}` }],
    } satisfies ParamTypes),
  },
  279: {
    paramTypes: JSON.stringify({
      custom: [{ regex: String.raw`\\c` }],
    } satisfies ParamTypes),
  },
  291: {
    paramTypes: JSON.stringify({
      custom: [{ regex: String.raw`:\w+(\$\w+)?` }],
    } satisfies ParamTypes),
  },
  334: {
    dialect: JSON.stringify(postgresql),
  },
  405: {
    language: 'postgresql',
  },
}

describe('parser and printer', () => {
  const fixtures = path.resolve(import.meta.dirname, 'fixtures')

  for (const relativeFilepath of fs.readdirSync(fixtures)) {
    const filepath = path.resolve(fixtures, relativeFilepath)
    const input = fs.readFileSync(filepath, 'utf8')

    const caseName = relativeFilepath.slice(
      0,
      relativeFilepath.lastIndexOf('.'),
    )

    const overrideOptions = PARSER_OPTIONS[caseName]

    it(`should format ${relativeFilepath} fixture correctly${overrideOptions ? ' with options: ' + JSON.stringify(overrideOptions) : ''}`, async () => {
      try {
        const output = await format(input, {
          filepath,
          plugins: [sql],
          ...overrideOptions,
        })

        expect(output).toMatchSnapshot()
      } catch (error) {
        expect(error).toMatchSnapshot()
      }
    })
  }
})
