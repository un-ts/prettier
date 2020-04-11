import prettier from 'prettier'
import PkgPlugin from 'prettier-plugin-pkg'

test('files', () => {
  const fixture = {
    files: ['lib', 'rules', '!lib/*.tsbuildinfo', 'bin'],
  }

  const input = JSON.stringify(fixture, null, 2)
  const output = prettier.format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: [PkgPlugin],
  })

  expect(output).toMatchSnapshot()
})
