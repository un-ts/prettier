import { format } from 'prettier'

import pkg2 from './fixtures/fixture2.json'

import PkgPlugin from 'prettier-plugin-pkg'

test('sort-order', async () => {
  const input = JSON.stringify(pkg2, null, 2)
  const output = await format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: [PkgPlugin],
    packageSortOrder: ['name', 'version', 'description', 'scripts'],
  })

  expect(output).toMatchSnapshot()
})
