import type { ParserOptions } from 'prettier'
import { format as formatToml } from 'tombit'
import { describe, expect, it, vi } from 'vitest'

import TomlPlugin from '../src/index.js'

vi.mock('tombit', () => ({
  format: vi.fn(() => Promise.resolve({ diagnostics: [] })),
}))

const parser = TomlPlugin.parsers!.toml as {
  parse: (code: string, options: ParserOptions) => Promise<string>
  locStart: (node?: unknown) => number
  locEnd: (node?: unknown) => number
}

const options = {
  bracketSpacing: true,
  filepath: 'a.toml',
  printWidth: 80,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
} as ParserOptions

describe('toml plugin', () => {
  it('should report a syntax error when tombi returns no diagnostic', async () => {
    await expect(parser.parse('a=1', options)).rejects.toThrow(
      'Tombi failed to format the TOML document.',
    )
  })

  it('should pass the synthetic filepath and the override config', async () => {
    vi.mocked(formatToml).mockClear()

    await expect(
      parser.parse('a=1', {
        ...options,
        filepath: undefined,
      } as unknown as ParserOptions),
    ).rejects.toThrow('Tombi failed to format the TOML document.')

    const [call] = vi.mocked(formatToml).mock.calls
    expect(call[0]).toBe('a=1')
    expect(call[1]).toBe('stdin.toml')
    expect(call[2]).toHaveProperty(
      'overrideConfig.format.rules.line-width',
      options.printWidth,
    )
  })

  it('should not expose source locations', () => {
    expect(parser.locStart()).toBe(-1)
    expect(parser.locEnd()).toBe(-1)
  })
})
