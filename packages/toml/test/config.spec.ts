import {
  getTombiConfig,
  mergeTombiConfig,
  serializeTombiConfig,
} from '../src/config.js'
import type { PrettierOptions } from '../src/types.js'

const options = {
  bracketSpacing: false,
  printWidth: 100,
  singleQuote: true,
  tabWidth: 4,
  useTabs: false,
} as PrettierOptions

describe('tombi config', () => {
  it('should serialize camelCase options to kebab-case tombi rules', () => {
    const config = serializeTombiConfig(getTombiConfig(options))

    expect(config).toContain('line-width = 100')
    expect(config).toContain('indent-width = 4')
    expect(config).toContain('indent-style = "space"')
    expect(config).toContain('string-quote-style = "single"')
    expect(config).toContain('inline-table-brace-space-width = 0')

    const ruleKeys = config
      .split('[format.rules]\n')[1]
      .trim()
      .split('\n')
      .map(line => line.split(' = ')[0])

    expect(ruleKeys).not.toHaveLength(0)
    expect(ruleKeys.every(key => key === key.toLowerCase())).toBe(true)
  })

  it('should let a discovered config override prettier derived rules', () => {
    const merged = mergeTombiConfig(getTombiConfig(options), {
      'toml-version': 'v1.1.0',
      format: { rules: { 'comment-style': 'preserve', 'line-width': 120 } },
    })

    expect(merged['toml-version']).toBe('v1.1.0')
    expect(
      (merged.format as { rules: Record<string, unknown> }).rules,
    ).toMatchObject({
      'comment-style': 'preserve',
      'indent-width': 4,
      'line-width': 120,
      'string-quote-style': 'single',
    })
  })
})
