import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { format } from 'prettier'

import AutocorrectPlugin from 'prettier-plugin-autocorrect'

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

describe('parser and printer', () => {
  it('should format all fixtures', async () => {
    const fixtures = path.resolve(_dirname, 'fixtures')
    for (const relativeFilepath of fs.readdirSync(fixtures)) {
      const filepath = path.resolve(fixtures, relativeFilepath)
      const input = fs.readFileSync(filepath, 'utf8')

      try {
        const output = await format(input, {
          filepath,
          parser: 'autocorrect',
          plugins: [AutocorrectPlugin],
          pluginSearchDirs: false,
        })

        expect(output).toMatchSnapshot(relativeFilepath)
      } catch (err: unknown) {
        expect((err as Error).message).toMatchSnapshot(relativeFilepath)
      }
    }
  })
})
