import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { format } from 'prettier'
import { afterEach, describe, expect, it } from 'vitest'

import TomlPlugin from 'prettier-plugin-toml'

describe('overrides', () => {
  const dirs: string[] = []

  afterEach(() => {
    for (const dir of dirs) {
      fs.rmSync(dir, { force: true, recursive: true })
    }

    dirs.length = 0
  })

  it('should apply a matching `[[overrides]]`', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tombi-overrides-'))
    dirs.push(dir)
    fs.writeFileSync(
      path.join(dir, 'tombi.toml'),
      [
        '[format.rules]',
        'indent-table-key-value-pairs = true',
        'indent-width = 4',
        '',
        '[[overrides]]',
        'files.include = ["*.toml"]',
        '',
        '[overrides.format.rules]',
        'indent-width = 6',
        '',
      ].join('\n'),
    )
    const filepath = path.join(dir, 'a.toml')
    fs.writeFileSync(filepath, '[t]\nkey = 1\n')

    await expect(
      format('[t]\nkey = 1\n', {
        filepath,
        parser: 'toml',
        plugins: [TomlPlugin],
      }),
    ).resolves.toBe('[t]\n      key = 1\n')
  })
})
