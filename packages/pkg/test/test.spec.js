const { join } = require('path')

const prettier = require('prettier')

const pkg = require('../package.json')

const shuffle = arr => {
  const result = arr.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[rand]] = [result[rand], result[i]]
  }
  return result
}

test('randomize', () => {
  const options = {
    filepath: join(__dirname, 'package.json'),
    parser: 'json-stringify',
    plugins: ['prettier-plugin-pkg'],
  }
  const keys = shuffle(Object.keys(pkg))
  const fixture = {}

  for (const key of keys) {
    fixture[key] = pkg[key]
  }

  const input = JSON.stringify(fixture, null, 2)
  expect(prettier.format(input, options)).toMatchSnapshot()
})

test('preprocess', () => {
  const options = {
    filepath: join('package.json'),
    parser: 'json-stringify',
    plugins: ['prettier-plugin-pkg'],
    preprocess: input => {
      const { version, repository } = JSON.parse(input)
      const result = { repository, version }
      return result
    },
  }
  const keys = shuffle(Object.keys(pkg))
  const fixture = {}

  for (const key of keys) {
    fixture[key] = pkg[key]
  }

  const input = JSON.stringify(fixture, null, 2)
  const output = prettier.format(input, options)

  expect(output).toMatchSnapshot()
})

test('not package.json', () => {
  const options = {
    filepath: 'batman.json',
    parser: 'json-stringify',
    plugins: ['prettier-plugin-pkg'],
  }
  const fixture = { version: 'batman', name: 'joker' }
  const input = JSON.stringify(fixture, null, 2)
  const output = prettier.format(input, options)

  expect(input.trim()).toBe(output.trim())
})

test('broken json', () => {
  const options = {
    filepath: 'broken.json',
    parser: 'json-stringify',
    plugins: ['prettier-plugin-pkg'],
  }

  const broken = `{
  "name": "prettier-plugin-pkg",
  "batmam": {]
}`

  expect(() => prettier.format(broken, options)).toThrow()
})
