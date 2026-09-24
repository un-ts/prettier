import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { format } from 'prettier'

import TomlPlugin from 'prettier-plugin-toml'

const formatToml = (code: string, filepath: string) =>
  format(code, { filepath, parser: 'toml', plugins: [TomlPlugin] })

const WAIT_TIMEOUT = 10_000
const TEST_TIMEOUT = 15_000

const waitFor = async (
  predicate: () => Promise<boolean>,
  timeout = WAIT_TIMEOUT,
) => {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (await predicate()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error('Timed out waiting for the config change to be picked up')
}

describe('tombi config discovery', () => {
  let dir: string

  beforeEach(async () => {
    // Isolate user level discovery so the tests only depend on the temp dirs.
    const home = await fs.mkdtemp(path.join(os.tmpdir(), 'tombi-home-'))
    process.env.HOME = home
    process.env.USERPROFILE = home
    process.env.APPDATA = path.join(home, 'AppData')
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

  it('should skip a `pyproject.toml` without `[tool.tombi]`', async () => {
    await fs.writeFile(
      path.join(dir, 'tombi.toml'),
      '[format.rules]\nindent-table-key-value-pairs = true\nindent-width = 4\n',
    )
    const nested = path.join(dir, 'nested')
    await fs.mkdir(nested)
    await fs.writeFile(
      path.join(nested, 'pyproject.toml'),
      '[project]\nname = "example"\n',
    )

    await expect(
      formatToml('[table]\nkey = 1\n', path.join(nested, 'a.toml')),
    ).resolves.toBe('[table]\n    key = 1\n')
  })

  it('should ignore an invalid `tombi.toml`', async () => {
    await fs.writeFile(path.join(dir, 'tombi.toml'), 'invalid = =')

    await expect(
      formatToml('key = 1\n', path.join(dir, 'a.toml')),
    ).resolves.toBe('key = 1\n')
  })

  it('should let an explicitly set prettier option override the config', async () => {
    await fs.writeFile(
      path.join(dir, 'tombi.toml'),
      '[format.rules]\nindent-table-key-value-pairs = true\nindent-width = 8\n',
    )
    const filepath = path.join(dir, 'a.toml')

    // Prettier's default `tabWidth` does not override the config.
    await expect(formatToml('[table]\nkey = 1\n', filepath)).resolves.toBe(
      '[table]\n        key = 1\n',
    )

    // An explicitly set `tabWidth` does.
    await expect(
      format('[table]\nkey = 1\n', {
        filepath,
        parser: 'toml',
        plugins: [TomlPlugin],
        tabWidth: 4,
      }),
    ).resolves.toBe('[table]\n    key = 1\n')
  })

  it(
    'should pick up changes to a discovered config',
    async () => {
      const configPath = path.join(dir, 'tombi.toml')
      await fs.writeFile(
        configPath,
        '[format.rules]\nindent-table-key-value-pairs = true\nindent-width = 4\n',
      )
      const filepath = path.join(dir, 'a.toml')

      await expect(formatToml('[table]\nkey = 1\n', filepath)).resolves.toBe(
        '[table]\n    key = 1\n',
      )

      // Save atomically, like most editors do.
      await fs.writeFile(
        `${configPath}.tmp`,
        '[format.rules]\nindent-table-key-value-pairs = true\nindent-width = 8\n',
      )
      await fs.rename(`${configPath}.tmp`, configPath)

      await waitFor(
        async () =>
          (await formatToml('[table]\nkey = 1\n', filepath)) ===
          '[table]\n        key = 1\n',
      )
    },
    TEST_TIMEOUT,
  )
})
