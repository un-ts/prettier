import { buildTombiConfig } from '../src/config.js'
import type { PrettierOptions } from '../src/types.js'

describe('buildTombiConfig', () => {
  it('should serialize camelCase options to kebab-case tombi rules', () => {
    const config = buildTombiConfig({
      bracketSpacing: false,
      printWidth: 100,
      singleQuote: true,
      tabWidth: 4,
      useTabs: false,
    } as PrettierOptions)

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
})
