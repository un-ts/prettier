import prettier from 'prettier'
import { ParseError } from 'sh-syntax'

import ShPlugin from '../src/index.js'

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
    expect((err as ParseError).Text).toMatchSnapshot()
  }
})
