import fs from 'fs'
import path from 'path'

import prettier from 'prettier'
import SqlPlugin from 'prettier-plugin-sql'

describe('parser and printer', () => {
  it('should format all fixtures', () => {
    const fixtures = path.resolve(__dirname, 'fixtures')
    for (const filepath of fs.readdirSync(fixtures)) {
      const input = fs.readFileSync(path.resolve(fixtures, filepath)).toString()

      const output = prettier.format(input, {
        filepath,
        parser: 'sql',
        plugins: [SqlPlugin],
      })

      expect(output).toMatchSnapshot(filepath)
    }
  })
})
