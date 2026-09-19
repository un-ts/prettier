import { stringify } from 'smol-toml'

import {
  getTombiConfig,
  getTombiOverrides,
  mergeTombiConfig,
} from '../src/config.js'
import type { PrettierOptions } from '../src/types.js'

const options = {
  bracketSpacing: false,
  printWidth: 100,
  singleQuote: true,
  tabWidth: 4,
  useTabs: false,
} as PrettierOptions

const getRules = (config: unknown) =>
  (config as { format: { rules: Record<string, unknown> } }).format.rules

describe('tombi config', () => {
  it('should serialize camelCase options to kebab-case tombi rules', () => {
    const config = stringify(getTombiConfig(options))

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

  it('should only put explicitly set options into the overrides', () => {
    expect(getRules(getTombiOverrides(options))).toMatchObject({
      'indent-width': 4,
      'inline-table-brace-space-width': 0,
      'line-width': 100,
      'string-quote-style': 'single',
    })
    expect(getRules(getTombiOverrides(options))).not.toHaveProperty(
      'comment-style',
    )
  })

  it('should let explicit prettier options override a discovered config', () => {
    const merged = mergeTombiConfig(
      getTombiConfig(options),
      {
        format: {
          rules: {
            'comment-style': 'preserve',
            'indent-width': 2,
            'line-width': 120,
          },
        },
      },
      getTombiOverrides(options),
    )

    expect(getRules(merged)).toMatchObject({
      // Not set by the user, so the config wins.
      'comment-style': 'preserve',
      // Explicitly set by the user, so Prettier wins.
      'indent-width': 4,
      'line-width': 100,
      'string-quote-style': 'single',
    })
  })

  it('should let a discovered config override prettier defaults', () => {
    const merged = mergeTombiConfig(
      getTombiConfig({ tabWidth: 2 } as PrettierOptions),
      { format: { rules: { 'indent-width': 8 } } },
      getTombiOverrides({ tabWidth: 2 } as PrettierOptions),
    )

    expect(getRules(merged)).toMatchObject({ 'indent-width': 8 })
  })

  it('should always disable the schema lookup', () => {
    const merged = mergeTombiConfig(
      getTombiConfig(options),
      {
        schema: { enabled: true, catalog: { paths: ['https://example.com'] } },
      },
      getTombiOverrides(options),
    )

    expect(merged.schema).toMatchObject({
      catalog: { paths: ['https://example.com'] },
      enabled: false,
    })
  })
})
