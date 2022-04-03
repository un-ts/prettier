import fs from 'fs'
import path from 'path'

import prettier from 'prettier'
import ShPlugin from 'prettier-plugin-sh'
import { ParseError } from 'sh-syntax'

describe('parser and printer', () => {
  it('should format all fixtures', () => {
    const fixtures = path.resolve(__dirname, 'fixtures')
    for (const filepath of fs.readdirSync(fixtures)) {
      const input = fs.readFileSync(path.resolve(fixtures, filepath)).toString()

      try {
        const output = prettier.format(input, {
          filepath,
          parser: 'sh',
          plugins: [ShPlugin],
        })

        expect(output).toMatchSnapshot(filepath)
      } catch (err: unknown) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect((err as ParseError).Text).toMatchSnapshot(filepath)
      }
    }
  })
})
