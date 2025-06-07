import { format } from 'prettier'

import pkg1 from './fixtures/fixture1.json'

import PkgPlugin from 'prettier-plugin-pkg'

test('ignore-sort', async () => {
  const input = JSON.stringify(pkg1, null, 2)
  const output = await format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: [PkgPlugin],
    packageIgnoreSort: ['resolutions'],
  })

  expect(output).toMatchSnapshot()
})
