import { format } from 'prettier'

import * as sh from 'prettier-plugin-sh'

describe('printer options', () => {
  const redundantSyntax = 'echo $(( (1 + 2) ))\n'

  it('preserves redundant shell syntax by default', async () => {
    await expect(
      format(redundantSyntax, {
        filepath: 'test.sh',
        plugins: [sh],
      }),
    ).resolves.toBe('echo $(((1 + 2)))\n')
  })

  it('simplifies redundant shell syntax when enabled', async () => {
    await expect(
      format(redundantSyntax, {
        filepath: 'test.sh',
        plugins: [sh],
        simplify: true,
      }),
    ).resolves.toBe('echo $((1 + 2))\n')
  })
})
