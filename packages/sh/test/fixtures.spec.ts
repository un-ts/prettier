import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import prettier from 'prettier'
import type { ParseError } from 'sh-syntax'

import ShPlugin, { type IShParseError } from 'prettier-plugin-sh'

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

      const filename = path.basename(filepath, path.extname(filepath))

      if (!filename.endsWith('-wasm')) {
        try {
          const output = prettier.format(input, {
            filepath,
            parser: 'sh',
            plugins: [ShPlugin],
            pluginSearchDirs: false,
          })

          expect(output).toMatchSnapshot(relativeFilepath)
        } catch (err: unknown) {
          expect(((err as Error).cause as IShParseError).Text).toMatchSnapshot(
            relativeFilepath,
          )
        }
      }

      if (!filename.endsWith('-wasm-no')) {
        try {
          const output = prettier.format(input, {
            filepath,
            parser: 'sh',
            plugins: [ShPlugin],
            pluginSearchDirs: false,
            // @ts-expect-error
            experimentalWasm: true,
          })

          expect(output).toMatchSnapshot(relativeFilepath)
        } catch (err: unknown) {
          const error = (err as Error).cause as ParseError | undefined

          expect(error?.Text || error?.message).toMatchSnapshot(
            relativeFilepath,
          )
        }
      }
    }
  })
})
