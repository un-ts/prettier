import prettier from 'prettier'

import PkgPlugin from '../src/index.js'

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
    plugins: [PkgPlugin],
    pluginSearchDirs: false,
  })

  expect(output).toMatchSnapshot()
})
