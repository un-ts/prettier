import { prettierOptionsDefinitions } from './options.js'
import type { PrettierOptions, PrettierTombiOptions } from './types.js'

/** A primitive Tombi configuration value. */
type TombiRuleValue = boolean | number | string | undefined

/** A Tombi configuration fragment. */
export type TombiConfig = Record<string, unknown>

const DEFAULT_TOML_VERSION = 'v1.0.0'

/** [Prettier core defaults](https://prettier.io/docs/en/options). */
const DEFAULT_PRINT_WIDTH = 80
const DEFAULT_TAB_WIDTH = 2

/**
 * Options that map directly to a Tombi rule. `toml-version` is a top level
 * option, while `stringQuoteStyle` and `inlineTableBraceSpaceWidth` also derive
 * from Prettier's `singleQuote` and `bracketSpacing`.
 */
const RULE_OPTION_NAMES = (
  Object.keys(prettierOptionsDefinitions) as Array<keyof PrettierTombiOptions>
).filter(
  name =>
    name !== 'tomlVersion' &&
    name !== 'stringQuoteStyle' &&
    name !== 'inlineTableBraceSpaceWidth',
)

/**
 * Tombi's configuration is `kebab-case`, while the options are plain
 * JavaScript `camelCase` identifiers.
 */
const toKebabCase = (value: string) =>
  value.replaceAll(/[A-Z]/g, char => `-${char.toLowerCase()}`)

/** Resolve the line width, inheriting Prettier's `printWidth`. */
const resolveLineWidth = (options: PrettierOptions) =>
  Number.isFinite(options.printWidth) ? options.printWidth : undefined

/** Resolve the indentation style, inheriting Prettier's `useTabs`. */
const resolveIndentStyle = (options: PrettierOptions) =>
  options.useTabs ? 'tab' : 'space'

/** Resolve the string quote style, inheriting Prettier's `singleQuote`. */
const resolveStringQuoteStyle = (options: PrettierOptions) =>
  options.stringQuoteStyle ?? (options.singleQuote ? 'single' : 'double')

/** Resolve inline table spacing, inheriting Prettier's `bracketSpacing`. */
const resolveInlineTableBraceSpaceWidth = (options: PrettierOptions) =>
  options.inlineTableBraceSpaceWidth ?? (options.bracketSpacing ? 1 : 0)

/** `[rule, value, explicitly configured]` tuples for Prettier's core options. */
const getCoreCandidates = (
  options: PrettierOptions,
): Array<[string, TombiRuleValue, boolean]> => [
  [
    'lineWidth',
    resolveLineWidth(options),
    options.printWidth !== DEFAULT_PRINT_WIDTH,
  ],
  ['indentWidth', options.tabWidth, options.tabWidth !== DEFAULT_TAB_WIDTH],
  ['indentStyle', resolveIndentStyle(options), options.useTabs === true],
  [
    'stringQuoteStyle',
    resolveStringQuoteStyle(options),
    options.singleQuote || options.stringQuoteStyle !== undefined,
  ],
  [
    'inlineTableBraceSpaceWidth',
    resolveInlineTableBraceSpaceWidth(options),
    !options.bracketSpacing || options.inlineTableBraceSpaceWidth !== undefined,
  ],
]

/** All rules derived from the resolved Prettier options. */
function getAllRules(options: PrettierOptions): Record<string, TombiRuleValue> {
  const rules: Record<string, TombiRuleValue> = {}

  for (const [name, value] of getCoreCandidates(options)) {
    rules[name] = value
  }

  for (const name of RULE_OPTION_NAMES) {
    rules[name] = options[name]
  }

  return rules
}

const toTombiRules = (rules: Record<string, TombiRuleValue>) =>
  Object.fromEntries(
    Object.entries(rules)
      .filter(
        (entry): entry is [string, Exclude<TombiRuleValue, undefined>] =>
          entry[1] != null,
      )
      .map(([name, value]) => [toKebabCase(name), value]),
  )

/**
 * The complete Tombi configuration derived from Prettier's resolved options.
 *
 * Prettier's options are authoritative: its own defaults are included, so a
 * `tombi.toml` rule that Prettier also exposes does not silently change the
 * output. The discovered configuration still supplies the rules the plugin
 * does not expose, and its `[[overrides]]` are applied by Tombi last.
 *
 * The schema lookup is disabled so formatting stays deterministic and offline.
 */
export function getTombiConfig(options: PrettierOptions): TombiConfig {
  return {
    'toml-version': options.tomlVersion ?? DEFAULT_TOML_VERSION,
    schema: { enabled: false },
    format: { rules: toTombiRules(getAllRules(options)) },
  }
}
