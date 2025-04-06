import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { type Options, format } from 'prettier'

import pkg1 from './fixtures/fixture1.json'
import pkg2 from './fixtures/fixture2.json'
import pkg3 from './fixtures/fixture3.json'

import PkgPlugin from 'prettier-plugin-pkg'

const pkgs = [pkg1, pkg2, pkg3]

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    // eslint-disable-next-line sonarjs/pseudo-random
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const createFixture = (index: 0 | 1 = 0) => {
  const pkg: Record<string, unknown> = pkgs[index]
  return shuffle(Object.keys(pkg)).reduce(
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
    }),
  ).rejects.toThrow()
})
