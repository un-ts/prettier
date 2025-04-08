import fs from 'node:fs'
import path from 'node:path'

import { format } from 'prettier'

import sh from 'prettier-plugin-sh'

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
          plugins: [sh],
        })

        expect(output).toMatchSnapshot(relativeFilepath)
      } catch (err: unknown) {
        expect((err as Error).message.split('\n').at(0)).toMatchSnapshot(
          relativeFilepath,
        )
      }
    }
  })
})
