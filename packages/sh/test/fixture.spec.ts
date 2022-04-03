import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import prettier from 'prettier'
import { ParseError } from 'sh-syntax'

import ShPlugin from '../src/index.js'

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

describe('parser and printer', () => {
  it('should format all fixtures', () => {
    const fixtures = path.resolve(_dirname, 'fixtures')
    for (const filepath of fs.readdirSync(fixtures)) {
      const input = fs.readFileSync(path.resolve(fixtures, filepath)).toString()

      try {
        const output = prettier.format(input, {
          filepath,
          parser: 'sh',
          plugins: [ShPlugin],
          pluginSearchDirs: false,
        })

        expect(output).toMatchSnapshot(filepath)
      } catch (err: unknown) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect((err as ParseError).Text).toMatchSnapshot(filepath)
      }
    }
  })
})
