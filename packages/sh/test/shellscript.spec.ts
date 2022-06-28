import prettier from 'prettier'

import ShPlugin, { IShParseError } from '../src/index.js'

test('fatal parse error with meaningful message', () => {
  try {
    prettier.format(`echo )`, {
      filepath: 'broken.sh',
      parser: 'sh',
      plugins: [ShPlugin],
      pluginSearchDirs: false,
    })
  } catch (err: unknown) {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(((err as SyntaxError).cause as IShParseError).Text).toMatchSnapshot()
  }
})
