import path from 'node:path'
import { fileURLToPath } from 'node:url'

import _ from 'lodash'
import { type Options, format } from 'prettier'

import pkg1 from './fixtures/fixture1.json'
import pkg2 from './fixtures/fixture2.json'

import PkgPlugin from 'prettier-plugin-pkg'

const pkgs = [pkg1, pkg2]

const createFixture = (index: 0 | 1 = 0) => {
  const pkg: Record<string, unknown> = pkgs[index]
  return _.shuffle(Object.keys(pkg)).reduce(
    (acc, key) =>
      Object.assign(acc, {
        [key]: pkg[key],
      }),
    {},
  )
}

const JSON_STRINGIFY = 'json-stringify'

const _dirname =
  typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname

test('randomize', async () => {
  const input = JSON.stringify(createFixture(), null, 2)
  const output = await format(input, {
    filepath: path.join(_dirname, 'package.json'),
    parser: JSON_STRINGIFY,
    plugins: [PkgPlugin],
    pluginSearchDirs: false,
  })

  expect(output).toMatchSnapshot()
})

test('preprocess', async () => {
  const input = JSON.stringify(createFixture(1), null, 2)
  const output = await format(input, {
    filepath: path.join('package.json'),
    parser: JSON_STRINGIFY,
    plugins: [PkgPlugin],
    pluginSearchDirs: false,
    preprocess(content: string) {
      const { version, repository } = JSON.parse(content) as typeof pkg1
      return { repository, version }
    },
  } as Options)

  expect(output).toMatchSnapshot()
})

test('not package.json', async () => {
  const fixture = { version: 'batman', name: 'joker' }
  const input = JSON.stringify(fixture, null, 2)
  const output = await format(input, {
    filepath: 'batman.json',
    parser: JSON_STRINGIFY,
    plugins: [PkgPlugin],
    pluginSearchDirs: false,
  })

  expect(input.trim()).toBe(output.trim())
})

test('broken json', () => {
  const broken = `{
  "name": "prettier-plugin-pkg",
  "batman": {]
}`

  return expect(() =>
    format(broken, {
      filepath: 'broken.json',
      parser: JSON_STRINGIFY,
      plugins: [PkgPlugin],
      pluginSearchDirs: false,
    }),
  ).rejects.toThrow()
})
