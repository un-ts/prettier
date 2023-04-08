import { format } from 'prettier'

import PkgPlugin from 'prettier-plugin-pkg'

test('engines', async () => {
  const fixture = {
    engines: {
      npm: 'joker',
      node: 'batman',
    },
  }

  const input = JSON.stringify(fixture, null, 2)
  const output = await format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: [PkgPlugin],
    pluginSearchDirs: false,
  })

  expect(output).toMatchSnapshot()
})
