import { format } from 'prettier'

import PkgPlugin from 'prettier-plugin-pkg'

test('files', async () => {
  const fixture = {
    files: ['lib', 'rules', '!lib/*.tsbuildinfo', 'bin'],
  }

  const input = JSON.stringify(fixture, null, 2)
  const output = await format(input, {
    filepath: 'package.json',
    parser: 'json-stringify',
    plugins: [PkgPlugin],
  })

  expect(output).toMatchSnapshot()
})
