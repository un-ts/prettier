import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
    for (const relativeFilepath of fs.readdirSync(fixtures)) {
      const filepath = path.resolve(fixtures, relativeFilepath)
      const input = fs.readFileSync(filepath, 'utf8')

      const diffOs = filepath.endsWith('-diff-os')

      let formatError: Error | undefined

      try {
        const output = prettier.format(input, {
          filepath,
          parser: 'sh',
          plugins: [ShPlugin],
          pluginSearchDirs: false,
        })

        expect(output).toMatchSnapshot(relativeFilepath)
      } catch (err: unknown) {
        const error = (err as Error).cause
        const message =
          (error as ParseError | undefined)?.Text || error?.message
        if (diffOs) {
          formatError = error
          console.error('diff-os:', message)
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(message).toMatchSnapshot(relativeFilepath)
        }
      }

      expect(!!formatError).toBe(diffOs)
    }
  })
})
