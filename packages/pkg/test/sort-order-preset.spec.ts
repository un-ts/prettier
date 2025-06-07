import { format } from 'prettier'

import pkg1 from './fixtures/fixture1.json'
import pkg2 from './fixtures/fixture2.json'
import pkg3 from './fixtures/fixture3.json'

import PkgPlugin from 'prettier-plugin-pkg'

const sortOrderPresets = ['npm', 'npm-plus', 'unts']
const pkgs = [pkg1, pkg2, pkg3]

const matrix = sortOrderPresets.flatMap(preset =>
  pkgs.map(pkg => [preset, pkg]),
)

test.each(matrix)("sort-order-preset '%s'", async (preset, pkg) => {
  const input = JSON.stringify(pkg, null, 2)
  const output = await format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: [PkgPlugin],
    packageSortOrderPreset: preset,
  })

  expect(output).toMatchSnapshot()
})
