import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { format } from 'prettier'

import TomlPlugin from 'prettier-plugin-toml'

const WAIT_TIMEOUT = 10_000
const TEST_TIMEOUT = 15_000
const LOWER_INDENT_WIDTH = 4
const HIGHER_INDENT_WIDTH = 8

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

const createConfig = (indentWidth: number) =>
  `[format.rules]\nindent-table-key-value-pairs = true\nindent-width = ${indentWidth}\n`

/*
 * Run in a dedicated file because the global candidates and the global config
 * cache are module level state.
 */
describe('global tombi config discovery', () => {
  it(
    'should pick up a higher priority global config',
    async () => {
      const home = await fs.mkdtemp(path.join(os.tmpdir(), 'tombi-home-'))
      const xdgConfigHome = path.join(home, 'xdg')
      process.env.HOME = home
      process.env.USERPROFILE = home
      process.env.APPDATA = path.join(home, 'AppData')
      process.env.XDG_CONFIG_HOME = xdgConfigHome

      // Lower priority candidate: `~/.config/tombi/config.toml`.
      const lowConfigDir = path.join(home, '.config', 'tombi')
      await fs.mkdir(lowConfigDir, { recursive: true })
      await fs.writeFile(
        path.join(lowConfigDir, 'config.toml'),
        createConfig(LOWER_INDENT_WIDTH),
      )

      // Higher priority candidate directory, empty so it can be watched.
      const highConfigDir = path.join(xdgConfigHome, 'tombi')
      await fs.mkdir(highConfigDir, { recursive: true })

      const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tombi-project-'))
      const filepath = path.join(dir, 'a.toml')
      const formatToml = () =>
        format('[table]\nkey = 1\n', {
          filepath,
          parser: 'toml',
          plugins: [TomlPlugin],
        })

      await expect(formatToml()).resolves.toBe('[table]\n    key = 1\n')

      await fs.writeFile(
        path.join(highConfigDir, 'config.toml'),
        createConfig(HIGHER_INDENT_WIDTH),
      )

      await waitFor(
        async () => (await formatToml()) === '[table]\n        key = 1\n',
      )
    },
    TEST_TIMEOUT,
  )
})
