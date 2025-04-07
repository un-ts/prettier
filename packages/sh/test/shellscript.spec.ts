import { format } from 'prettier'

import ShPlugin from 'prettier-plugin-sh'

test('fatal parse error with meaningful message', async () => {
  await expect(
    format(`echo )`, {
      filepath: 'broken.sh',
      parser: 'sh',
      plugins: [ShPlugin],
    }),
  ).rejects.toThrowErrorMatchingSnapshot()

  await expect(
    format(`echo )`, {
      filepath: 'broken.sh',
      parser: 'sh',
      plugins: [ShPlugin],
      experimentalWasm: true,
    }),
  ).rejects.toThrowErrorMatchingSnapshot()
})
