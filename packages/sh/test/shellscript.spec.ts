import { format } from 'prettier'
import { ParseError } from 'sh-syntax'

import ShPlugin, { type IShParseError } from 'prettier-plugin-sh'

test('fatal parse error with meaningful message', async () => {
  try {
    await format(`echo )`, {
      filepath: 'broken.sh',
      parser: 'sh',
      plugins: [ShPlugin],
    })
  } catch (err: unknown) {
    expect(((err as Error).cause as IShParseError).Text).toMatchSnapshot()
  }

  try {
    await format(`echo )`, {
      filepath: 'broken.sh',
      parser: 'sh',
      plugins: [ShPlugin],
      // @ts-expect-error
      experimentalWasm: true,
    })
  } catch (err: unknown) {
    const error = (err as Error).cause as ParseError | undefined
    expect(error?.Text || error?.message).toMatchSnapshot()
  }
})
