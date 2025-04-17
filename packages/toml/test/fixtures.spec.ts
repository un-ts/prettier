import fs from 'node:fs'
import path from 'node:path'

import { format } from 'prettier'

import TomlPlugin from 'prettier-plugin-toml'

describe('parser and printer', () => {
  const fixtures = path.resolve(import.meta.dirname, 'fixtures')
  for (const relativeFilepath of fs.readdirSync(fixtures)) {
    const filepath = path.resolve(fixtures, relativeFilepath)
    const input = fs.readFileSync(filepath, 'utf8')

    it(`should format ${relativeFilepath} fixture correctly`, async () => {
      try {
        const output = await format(input, {
          filepath,
          parser: 'toml',
          plugins: [TomlPlugin],
        })

        expect(output).toMatchSnapshot()
      } catch (err: unknown) {
        expect((err as Error).message).toMatchSnapshot()
      }
    })
  }
})
