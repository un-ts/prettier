import type { ParserOptions } from 'prettier'
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

  it('should not expose source locations', () => {
    expect(parser.locStart()).toBe(-1)
    expect(parser.locEnd()).toBe(-1)
  })
})
