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

const _dirname = import.meta.dirname

describe('parser and printer', () => {
  const fixtures = path.resolve(_dirname, 'fixtures')

  for (const relativeFilepath of fs.readdirSync(fixtures)) {
    const filepath = path.resolve(fixtures, relativeFilepath)
    const input = fs.readFileSync(filepath, 'utf8')

    const caseName = relativeFilepath.slice(
      0,
      relativeFilepath.lastIndexOf('.'),
    )

    const overrideOptions = PARSER_OPTIONS[caseName]

    it(`should format ${relativeFilepath} fixtures${overrideOptions ? ' - ' + JSON.stringify(overrideOptions) : ''}`, async () => {
      try {
        const output = await format(input, {
          filepath,
          plugins: [sh],
          ...overrideOptions,
        })

        expect(output).toMatchSnapshot(relativeFilepath)
      } catch (err: unknown) {
        expect((err as Error).message.split('\n').at(0)).toMatchSnapshot(
          relativeFilepath,
        )
      }
    })
  }
})
