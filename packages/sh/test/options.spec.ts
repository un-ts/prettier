import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { format } from 'prettier'

import * as sh from 'prettier-plugin-sh'

describe('printer options', () => {
  const redundantSyntax = 'echo $(( (1 + 2) ))\n'

  it('preserves redundant shell syntax by default', async () => {
    await expect(
      format(redundantSyntax, {
        filepath: 'test.sh',
        plugins: [sh],
      }),
    ).resolves.toBe('echo $(((1 + 2)))\n')
  })

  it.each([
    '.bashrc',
    '.envrc',
    '.husky/pre-commit',
    '.profile',
    'APKBUILD',
    'PKGBUILD',
    'script.sh.in',
    'test.bash',
    'test.sh',
    'test.zsh',
  ])(
    'simplifies redundant shell syntax in `%s` when enabled',
    async filepath => {
      await expect(
        format(redundantSyntax, {
          filepath,
          plugins: [sh],
          simplify: true,
        }),
      ).resolves.toBe('echo $((1 + 2))\n')
    },
  )

  it.each([undefined, 'file:///invalid%path.sh', 'script', 'script.txt'])(
    'simplifies explicit shell input with filepath `%s`',
    async filepath => {
      await expect(
        format(redundantSyntax, {
          filepath,
          parser: 'sh',
          plugins: [sh],
          simplify: true,
        }),
      ).resolves.toBe('echo $((1 + 2))\n')
    },
  )

  it.each([
    '.ackrc',
    '.dockerignore',
    '.env',
    '.env.development',
    '.env.sh',
    '.gitattributes',
    '.gitignore',
    '.husky/.env.local',
    '.husky/config.properties',
    '.node-version',
    '.nvmrc',
    '.rspec',
    '.tm_properties',
    '.yardopts',
    'ackrc',
    'CODEOWNERS',
    'config.env',
    'config.PROPERTIES',
    'config.properties',
    'config.vmoptions',
    'events.ical',
    'events.ics',
    'global.gitignore',
    'HOSTS',
    'hosts',
    'jvm.options',
    'mocha.opts',
    'package.pc',
    'package.pc.in',
    'person.vcf',
  ])(
    'ignores `minify` and `simplify` for non-shell file `%s`',
    async filepath => {
      const input = '# example value\nvalue=$(( (1 + 2) ))\n'
      const options = { filepath, plugins: [sh] }
      const expected = '# example value\nvalue=$(((1 + 2)))\n'

      await expect(format(input, options)).resolves.toBe(expected)
      await expect(format(input, { ...options, simplify: true })).resolves.toBe(
        expected,
      )
      await expect(format(input, { ...options, minify: true })).resolves.toBe(
        expected,
      )
      await expect(
        format(input, { ...options, minify: true, simplify: true }),
      ).resolves.toBe(expected)
    },
  )

  it.each(['.env.development', '.tm_properties', 'config.properties'])(
    'ignores `minify` and `simplify` for an encoded file URL pointing to `%s`',
    async filepath => {
      await expect(
        format('value=$(( (1 + 2) ))\n', {
          filepath: pathToFileURL(path.resolve(filepath)).href.replaceAll(
            '.',
            '%2E',
          ),
          minify: true,
          plugins: [sh],
          simplify: true,
        }),
      ).resolves.toBe('value=$(((1 + 2)))\n')
    },
  )

  it('simplifies shell input with an encoded file URL', async () => {
    await expect(
      format(redundantSyntax, {
        filepath: pathToFileURL(path.resolve('test.sh')).href.replaceAll(
          '.',
          '%2E',
        ),
        plugins: [sh],
        simplify: true,
      }),
    ).resolves.toBe('echo $((1 + 2))\n')
  })

  it('ignores `minify` and `simplify` for non-shell files with an explicit shell parser', async () => {
    await expect(
      format('value=$(( (1 + 2) ))\n', {
        filepath: 'config.properties',
        minify: true,
        parser: 'sh',
        plugins: [sh],
        simplify: true,
      }),
    ).resolves.toBe('value=$(((1 + 2)))\n')
  })

  it.each([false, true])(
    'minifies shell input when `simplify` is %s',
    async simplify => {
      await expect(
        format('value=$(( (1 + 2) ))\n', {
          filepath: 'test.sh',
          minify: true,
          plugins: [sh],
          simplify,
        }),
      ).resolves.toBe('value=$((1+2))\n')
    },
  )
})
