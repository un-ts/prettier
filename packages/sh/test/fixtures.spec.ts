import fs from 'node:fs'
import path from 'node:path'

import { format } from 'prettier'
import type { ParseError } from 'sh-syntax'

import ShPlugin from 'prettier-plugin-sh'

const _dirname = import.meta.dirname

describe('parser and printer', () => {
  it('should format all fixtures', async () => {
    const fixtures = path.resolve(_dirname, 'fixtures')
    for (const relativeFilepath of fs.readdirSync(fixtures)) {
      const filepath = path.resolve(fixtures, relativeFilepath)
      const input = fs.readFileSync(filepath, 'utf8')

      try {
        const output = await format(input, {
          filepath,
          parser: 'sh',
          plugins: [ShPlugin],
        })

        expect(output).toMatchSnapshot(relativeFilepath)
      } catch (err: unknown) {
        expect((err as Error).message).toMatchSnapshot(relativeFilepath)
      }

      try {
        const output = await format(input, {
          filepath,
          parser: 'sh',
          plugins: [ShPlugin],
          experimentalWasm: true,
        })

        expect(output).toMatchSnapshot(relativeFilepath)
      } catch (err: unknown) {
        const error = (err as Error).cause as ParseError | undefined

        expect(error?.Text || error?.message).toMatchSnapshot(relativeFilepath)
      }
    }
  })
})
