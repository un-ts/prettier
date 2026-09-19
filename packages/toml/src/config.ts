import { stringify } from 'smol-toml'

import { prettierOptionsDefinitions } from './options.js'
import type { PrettierOptions, PrettierTombiOptions } from './types.js'

/** A primitive Tombi configuration value. */
type TombiRuleValue = boolean | number | string | undefined

/** A parsed Tombi configuration. */
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

const getOptionDefault = (name: keyof PrettierTombiOptions) =>
  (prettierOptionsDefinitions[name] as { default?: unknown }).default

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

const addRule = (
  rules: Record<string, TombiRuleValue>,
  name: string,
  value: TombiRuleValue,
  condition: boolean,
) => {
  if (condition) {
    rules[name] = value
  }
}

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

/** Core rules that differ from Prettier's own defaults. */
function getExplicitCoreRules(
  options: PrettierOptions,
): Record<string, TombiRuleValue> {
  const rules: Record<string, TombiRuleValue> = {}

  for (const [name, value, condition] of getCoreCandidates(options)) {
    addRule(rules, name, value, condition)
  }

  return rules
}

/**
 * The explicit core rules plus every explicitly configured plugin option. They
 * take precedence over a discovered `tombi.toml`.
 */
function getOverrideRules(
  options: PrettierOptions,
): Record<string, TombiRuleValue> {
  const rules = getExplicitCoreRules(options)

  for (const name of RULE_OPTION_NAMES) {
    addRule(
      rules,
      name,
      options[name],
      options[name] !== undefined && options[name] !== getOptionDefault(name),
    )
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
 * Build a Tombi configuration from the resolved Prettier options. Prettier's
 * own `printWidth`, `tabWidth`, `useTabs`, `singleQuote` and `bracketSpacing`
 * options are mapped to their Tombi counterparts.
 *
 * The schema lookup is disabled so formatting stays deterministic and offline:
 * the remote schema catalogs would otherwise make every format call hit the
 * network.
 */
export function getTombiConfig(options: PrettierOptions): TombiConfig {
  return {
    'toml-version': options.tomlVersion ?? DEFAULT_TOML_VERSION,
    schema: { enabled: false },
    format: { rules: toTombiRules(getAllRules(options)) },
  }
}

/**
 * The rules that were explicitly configured through Prettier options. They
 * take precedence over a discovered `tombi.toml`.
 */
export function getTombiOverrides(options: PrettierOptions): TombiConfig {
  const overrides: TombiConfig = {
    format: { rules: toTombiRules(getOverrideRules(options)) },
  }

  if (
    options.tomlVersion !== undefined &&
    options.tomlVersion !== DEFAULT_TOML_VERSION
  ) {
    overrides['toml-version'] = options.tomlVersion
  }

  return overrides
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Recursively merge configs, later ones taking precedence. */
const deepMerge = (...configs: TombiConfig[]): TombiConfig =>
  configs.reduce<TombiConfig>((result, config) => {
    for (const [key, value] of Object.entries(config)) {
      result[key] =
        isPlainObject(value) && isPlainObject(result[key])
          ? deepMerge(result[key], value)
          : value
    }
    return result
  }, {})

/**
 * Merge a discovered `tombi.toml` with the Prettier derived configuration. The
 * discovered config overrides Prettier's defaults, while explicitly configured
 * Prettier options override the discovered config.
 *
 * Tombi's schema lookup is always disabled: this plugin is a formatter, so
 * schema driven ordering must not affect the output and the remote schema
 * catalogs must never be fetched.
 */
export function mergeTombiConfig(
  prettierConfig: TombiConfig,
  fileConfig: TombiConfig,
  prettierOverrides: TombiConfig,
): TombiConfig {
  const merged = deepMerge(prettierConfig, fileConfig, prettierOverrides)
  const schema = isPlainObject(merged.schema) ? merged.schema : {}

  return { ...merged, schema: { ...schema, enabled: false } }
}

/** Serialize a Tombi configuration to TOML. */
export const serializeTombiConfig = (config: TombiConfig): string =>
  stringify(config)
