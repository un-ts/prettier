import fs from 'fs'
import path from 'path'

import prettier from 'prettier'
import SqlPlugin, { SqlFormatOptions } from 'prettier-plugin-sql'

const PARSER_OPTIONS: Record<string, SqlFormatOptions> = {
  144: {
    language: 'postgresql',
  },
}

describe('parser and printer', () => {
  it('should format all fixtures', () => {
    const fixtures = path.resolve(__dirname, 'fixtures')
    for (const filepath of fs.readdirSync(fixtures)) {
      const input = fs.readFileSync(path.resolve(fixtures, filepath)).toString()

      const caseName = filepath.slice(0, filepath.lastIndexOf('.'))
      const output = prettier.format(input, {
        filepath,
        parser: 'sql',
        plugins: [SqlPlugin],
        ...PARSER_OPTIONS[caseName],
      })

      expect(output).toMatchSnapshot(filepath)
    }
  })
})
