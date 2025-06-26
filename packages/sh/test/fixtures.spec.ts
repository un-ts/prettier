import fs from 'node:fs'
import path from 'node:path'

import { format } from 'prettier'

import * as sh from 'prettier-plugin-sh'

const PARSER_OPTIONS: Partial<
  Record<string, Omit<sh.ShPrintOptions, 'originalText'>>
> = {
  441: {
    indent: 4,
  },
}

describe('parser and printer', () => {
  const fixtures = path.resolve(import.meta.dirname, 'fixtures')

  for (const dirent of fs.readdirSync(fixtures, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (dirent.isDirectory()) {
      continue
    }

    const filepath = path.resolve(dirent.parentPath, dirent.name)

    const relativeFilepath = path
      .relative(fixtures, filepath)
      .replaceAll(path.win32.sep, path.posix.sep)

    const input = fs.readFileSync(filepath, 'utf8')

    const caseName = dirent.name.includes('.')
      ? relativeFilepath.slice(0, relativeFilepath.lastIndexOf('.'))
      : relativeFilepath

    const overrideOptions = PARSER_OPTIONS[caseName]

    it(`should format ${relativeFilepath} fixture correctly${
      overrideOptions ? ' with options: ' + JSON.stringify(overrideOptions) : ''
    }`, async () => {
      try {
        const output = await format(input, {
          filepath,
          plugins: [sh],
          ...overrideOptions,
        })

        expect(output).toMatchSnapshot()
      } catch (err: unknown) {
        expect((err as Error).message.split('\n').at(0)).toMatchSnapshot()
      }
    })
  }
})
