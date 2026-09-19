import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { format } from 'prettier'

import TomlPlugin from 'prettier-plugin-toml'

const formatToml = (code: string, filepath: string) =>
  format(code, { filepath, parser: 'toml', plugins: [TomlPlugin] })

describe('tombi config discovery', () => {
  let dir: string

  beforeEach(async () => {
    // Isolate user level discovery so the tests only depend on the temp dirs.
    const home = await fs.mkdtemp(path.join(os.tmpdir(), 'tombi-home-'))
    process.env.HOME = home
    process.env.XDG_CONFIG_HOME = path.join(home, '.config')
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tombi-project-'))
  })

  it('should apply a `tombi.toml` next to the file', async () => {
    await fs.writeFile(
      path.join(dir, 'tombi.toml'),
      '[format.rules]\nindent-table-key-value-pairs = true\nindent-width = 4\n',
    )

    await expect(
      formatToml('[table]\nkey = 1\n', path.join(dir, 'a.toml')),
    ).resolves.toBe('[table]\n    key = 1\n')
  })

  it('should apply a `tombi.toml` from a parent directory', async () => {
    await fs.writeFile(
      path.join(dir, 'tombi.toml'),
      '[format.rules]\nindent-table-key-value-pairs = true\nindent-width = 6\n',
    )
    const nested = path.join(dir, 'nested', 'deeper')
    await fs.mkdir(nested, { recursive: true })

    await expect(
      formatToml('[table]\nkey = 1\n', path.join(nested, 'a.toml')),
    ).resolves.toBe('[table]\n      key = 1\n')
  })

  it('should apply `[tool.tombi]` from `pyproject.toml`', async () => {
    await fs.writeFile(
      path.join(dir, 'pyproject.toml'),
      [
        '[project]',
        'name = "example"',
        '',
        '[tool.tombi.format.rules]',
        'indent-table-key-value-pairs = true',
        'indent-width = 4',
        '',
      ].join('\n'),
    )

    await expect(
      formatToml('[table]\nkey = 1\n', path.join(dir, 'a.toml')),
    ).resolves.toBe('[table]\n    key = 1\n')
  })

  it('should ignore an invalid `tombi.toml`', async () => {
    await fs.writeFile(path.join(dir, 'tombi.toml'), 'invalid = =')

    await expect(
      formatToml('key = 1\n', path.join(dir, 'a.toml')),
    ).resolves.toBe('key = 1\n')
  })
})
