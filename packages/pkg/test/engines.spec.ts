import prettier from 'prettier'

test('engines', () => {
  const fixture = {
    engines: {
      npm: 'joker',
      node: 'batman',
    },
  }

  const input = JSON.stringify(fixture, null, 2)
  const output = prettier.format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: ['prettier-plugin-pkg'],
  })

  expect(output).toMatchSnapshot()
})
