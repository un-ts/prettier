import fs from 'node:fs'
import path from 'node:path'

import { format } from 'prettier'

import * as sh from 'prettier-plugin-sh'

const PARSER_OPTIONS: Partial<
  Record<string, Omit<sh.ShPrintOptions, 'originalText'>>
> = {
  441: {
    indent: 4,
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

    it(`should format ${relativeFilepath} fixture correctly${
      overrideOptions ? ' with options: ' + JSON.stringify(overrideOptions) : ''
    }`, async () => {
      try {
        const output = await format(input, {
          filepath,
          plugins: [sh],
          ...overrideOptions,
        })

        expect(output).toMatchSnapshot()
      } catch (err: unknown) {
        expect((err as Error).message.split('\n').at(0)).toMatchSnapshot()
      }
    })
  }
})
