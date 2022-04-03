import prettier from 'prettier'
import ShPlugin from 'prettier-plugin-sh'
import { ParseError } from 'sh-syntax'

test('fatal parse error with meaningful message', () => {
  try {
    prettier.format(`echo )`, {
      filepath: 'broken.sh',
      parser: 'sh',
      plugins: [ShPlugin],
    })
  } catch (err: unknown) {
    // eslint-disable-next-line jest/no-conditional-expect
    expect((err as ParseError).Text).toMatchSnapshot()
  }
})
