import { format } from 'prettier'

import TomlPlugin from 'prettier-plugin-toml'

const formatToml = (
  code: string,
  options: Parameters<typeof format>[1] = {},
): Promise<string> =>
  format(code, {
    filepath: 'foo.toml',
    parser: 'toml',
    plugins: [TomlPlugin],
    ...options,
  })

describe('prettier core options', () => {
  it('should respect `singleQuote` only for strings that are valid literal strings', async () => {
    const input = [
      'plain = "value"',
      String.raw`escaped = "line\nbreak"`,
      "single = 'value'",
      '',
    ].join('\n')

    await expect(formatToml(input, { singleQuote: true })).resolves.toBe(
      [
        "plain = 'value'",
        String.raw`escaped = "line\nbreak"`,
        "single = 'value'",
        '',
      ].join('\n'),
    )
  })

  it('should map `bracketSpacing` to inline table spacing', async () => {
    await expect(
      formatToml('table = { a = 1, b = 2 }\n', { bracketSpacing: false }),
    ).resolves.toBe('table = {a = 1, b = 2}\n')
  })

  it('should allow overriding the inherited quote style', async () => {
    await expect(
      formatToml('value = "text"\n', {
        singleQuote: true,
        stringQuoteStyle: 'double',
      }),
    ).resolves.toBe('value = "text"\n')
  })
})
