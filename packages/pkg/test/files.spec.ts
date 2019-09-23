import prettier from 'prettier'

test('files', () => {
  const fixture = {
    files: ['lib', 'rules'],
  }

  const input = JSON.stringify(fixture, null, 2)
  const output = prettier.format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: ['prettier-plugin-pkg'],
  })

  expect(output).toMatchSnapshot()
})
