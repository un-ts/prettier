import { formatDockerfileContents } from '@reteps/dockerfmt'
import { format } from 'prettier'

import * as sh from 'prettier-plugin-sh'

vi.mock('@reteps/dockerfmt', () => ({
  formatDockerfileContents: vi.fn(),
}))

describe('Dockerfile fallback', () => {
  it.each(['Containerfile', 'Dockerfile', 'test.Dockerfile'])(
    'ignores `minify` and `simplify` when formatting `%s` as shell',
    async filepath => {
      const formatter = vi.mocked(formatDockerfileContents)
      formatter.mockRejectedValue(new Error('Dockerfile formatting error'))

      const input = '# image configuration\nRUN echo $(( (1 + 2) ))\n'
      const options = { filepath, plugins: [sh] }
      const expected = '# image configuration\nRUN echo $(((1 + 2)))\n'

      await expect(format(input, options)).resolves.toBe(expected)
      await expect(format(input, { ...options, simplify: true })).resolves.toBe(
        expected,
      )
      await expect(format(input, { ...options, minify: true })).resolves.toBe(
        expected,
      )
      await expect(
        format(input, { ...options, minify: true, simplify: true }),
      ).resolves.toBe(expected)
      expect(formatter).toHaveBeenCalledWith(input, expect.any(Object))
    },
  )
})
