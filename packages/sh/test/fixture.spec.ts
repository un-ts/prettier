import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import prettier from 'prettier'

import ShPlugin, { IShParseError } from '../src/index.js'

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

describe('parser and printer', () => {
  it('should format all fixtures', () => {
    const fixtures = path.resolve(_dirname, 'fixtures')
    for (const relativeFilepath of fs.readdirSync(fixtures)) {
      const filepath = path.resolve(fixtures, relativeFilepath)
      const input = fs.readFileSync(filepath, 'utf8')

      try {
        const output = prettier.format(input, {
          filepath,
          parser: 'sh',
          plugins: [ShPlugin],
          pluginSearchDirs: false,
        })

        expect(output).toMatchSnapshot(relativeFilepath)
      } catch (err: unknown) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(
          ((err as SyntaxError).cause as IShParseError).Text,
        ).toMatchSnapshot(relativeFilepath)
      }
    }
  })
})
