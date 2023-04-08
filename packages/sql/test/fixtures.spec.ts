import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { format } from 'prettier'

import SqlPlugin, { type SqlFormatOptions } from 'prettier-plugin-sql'

const PARSER_OPTIONS: Record<string, SqlFormatOptions> = {
  144: {
    language: 'postgresql',
  },
}

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

describe('parser and printer', () => {
  it('should format all fixtures', async () => {
    const fixtures = path.resolve(_dirname, 'fixtures')
    for (const filepath of fs.readdirSync(fixtures)) {
      const input = fs.readFileSync(path.resolve(fixtures, filepath)).toString()

      const caseName = filepath.slice(0, filepath.lastIndexOf('.'))

      const output = await format(input, {
        filepath,
        parser: 'sql',
        plugins: [SqlPlugin],
        pluginSearchDirs: false,
        ...PARSER_OPTIONS[caseName],
      })

      expect(output).toMatchSnapshot(filepath)
    }
  })
})
