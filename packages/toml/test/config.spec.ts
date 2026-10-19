import { getTombiConfig } from '../src/config.js'
import type { PrettierOptions } from '../src/types.js'

const defaults = {
  bracketSpacing: true,
  printWidth: 80,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
} as PrettierOptions

const explicit = {
  bracketSpacing: false,
  printWidth: 100,
  singleQuote: true,
  tabWidth: 4,
  useTabs: false,
} as PrettierOptions

const getRules = (config: unknown) =>
  (config as { format: { rules: Record<string, unknown> } }).format.rules

describe('tombi config', () => {
  it('should include Prettier defaults in the rules', () => {
    expect(getRules(getTombiConfig(defaults))).toEqual({
      'indent-style': 'space',
      'indent-width': 2,
      'inline-table-brace-space-width': 1,
      'line-width': 80,
      'string-quote-style': 'double',
    })
  })

  it('should map explicitly configured Prettier options', () => {
    expect(getRules(getTombiConfig(explicit))).toEqual({
      'indent-style': 'space',
      'indent-width': 4,
      'inline-table-brace-space-width': 0,
      'line-width': 100,
      'string-quote-style': 'single',
    })
  })

  it('should include explicitly configured plugin options', () => {
    expect(
      getRules(
        getTombiConfig({
          ...defaults,
          commentStyle: 'preserve',
        } as PrettierOptions),
      ),
    ).toMatchObject({ 'comment-style': 'preserve' })
  })

  it('should default the toml version and always disable the schema', () => {
    expect(getTombiConfig(defaults)['toml-version']).toBe('v1.0.0')
    expect(
      getTombiConfig({
        ...defaults,
        tomlVersion: 'v1.1.0',
      } as PrettierOptions)['toml-version'],
    ).toBe('v1.1.0')
    expect(getTombiConfig(defaults).schema).toEqual({ enabled: false })
  })
  it('should map useTabs and explicit quote/spacing overrides', () => {
    expect(
      getRules(
        getTombiConfig({
          ...defaults,
          useTabs: true,
          stringQuoteStyle: 'preserve',
          inlineTableBraceSpaceWidth: 2,
        } as PrettierOptions),
      ),
    ).toMatchObject({
      'indent-style': 'tab',
      'inline-table-brace-space-width': 2,
      'string-quote-style': 'preserve',
    })
  })

  it('should leave the line width unset when Prettier has none', () => {
    expect(
      getRules(
        getTombiConfig({
          ...defaults,
          printWidth: undefined,
        } as unknown as PrettierOptions),
      ),
    ).not.toHaveProperty('line-width')
  })
})
