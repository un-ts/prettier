import fs from 'fs'
import path from 'path'

import prettier from 'prettier'
import ShPlugin from 'prettier-plugin-sh'

describe('parser and printer', () => {
  it('should format all fixtures', () => {
    const fixtures = path.resolve(__dirname, 'fixtures')
    fs.readdirSync(fixtures).forEach(filepath => {
      const input = fs.readFileSync(path.resolve(fixtures, filepath)).toString()

      const output = prettier.format(input, {
        filepath,
        // @ts-ignore
        parser: 'sh',
        plugins: [ShPlugin],
      })

      expect(output).toMatchSnapshot(filepath)
    })
  })
})
