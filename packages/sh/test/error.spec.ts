import { format } from 'prettier'
import { ParseError } from 'sh-syntax'

import ShPlugin from 'prettier-plugin-sh'

test('fatal parse error with meaningful message', async () => {
  // eslint-disable-next-line vitest/valid-expect
  const { rejects } = expect(
    format(`echo )`, {
      filepath: 'broken.sh',
      parser: 'sh',
      plugins: [ShPlugin],
    }),
  )
  await rejects.toThrow(ParseError)
  await rejects.toThrow(
    'a command can only contain words and redirects; encountered )',
  )
})
