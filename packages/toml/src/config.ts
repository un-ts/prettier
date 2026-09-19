import { stringify } from 'smol-toml'

import type { PrettierOptions } from './types.js'

/** A primitive Tombi configuration value. */
type TombiRuleValue = boolean | number | string | undefined

/** A parsed Tombi configuration. */
export type TombiConfig = Record<string, unknown>

const DEFAULT_TOML_VERSION = 'v1.0.0'

/**
 * Tombi's configuration is `kebab-case`, while the options are plain
 * JavaScript `camelCase` identifiers.
 */
const toKebabCase = (value: string) =>
  value.replaceAll(/[A-Z]/g, char => `-${char.toLowerCase()}`)

/** Resolve the string quote style, inheriting Prettier's `singleQuote`. */
const resolveStringQuoteStyle = (options: PrettierOptions) =>
  options.stringQuoteStyle ?? (options.singleQuote ? 'single' : 'double')

/** Resolve inline table spacing, inheriting Prettier's `bracketSpacing`. */
const resolveInlineTableBraceSpaceWidth = (options: PrettierOptions) =>
  options.inlineTableBraceSpaceWidth ?? (options.bracketSpacing ? 1 : 0)

/** Resolve the line width, inheriting Prettier's `printWidth`. */
const resolveLineWidth = (options: PrettierOptions) =>
  Number.isFinite(options.printWidth) ? options.printWidth : undefined

/** Collect the Tombi `[format.rules]` entries from the Prettier options. */
function getRules(options: PrettierOptions): Record<string, TombiRuleValue> {
  return {
    arrayBracketSpaceWidth: options.arrayBracketSpaceWidth,
    arrayCommaSpaceWidth: options.arrayCommaSpaceWidth,
    commentStyle: options.commentStyle,
    dateTimeDelimiter: options.dateTimeDelimiter,
    groupBlankLinesLimit: options.groupBlankLinesLimit,
    indentStyle: options.useTabs ? 'tab' : 'space',
    indentSubTables: options.indentSubTables,
    indentTableKeyValuePairs: options.indentTableKeyValuePairs,
    indentWidth: options.tabWidth,
    inlineTableBraceSpaceWidth: resolveInlineTableBraceSpaceWidth(options),
    inlineTableCommaSpaceWidth: options.inlineTableCommaSpaceWidth,
    keyValueEqualsSignAlignment: options.keyValueEqualsSignAlignment,
    keyQuoteStyle: options.keyQuoteStyle,
    keyValueEqualsSignSpaceWidth: options.keyValueEqualsSignSpaceWidth,
    lineWidth: resolveLineWidth(options),
    stringQuoteStyle: resolveStringQuoteStyle(options),
    tableBlankLines: options.tableBlankLines,
    trailingCommentAlignment: options.trailingCommentAlignment,
    trailingCommentSpaceWidth: options.trailingCommentSpaceWidth,
  }
}

/** Convert the camelCase rules to Tombi's `kebab-case` config keys. */
const toTombiRules = (rules: Record<string, TombiRuleValue>) =>
  Object.fromEntries(
    Object.entries(rules)
      .filter(
        (entry): entry is [string, Exclude<TombiRuleValue, undefined>] =>
          entry[1] != null,
      )
      .map(([key, value]) => [toKebabCase(key), value]),
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
    format: { rules: toTombiRules(getRules(options)) },
  }
}

/**
 * Merge a discovered `tombi.toml` with the Prettier derived configuration.
 * Tombi's own configuration takes precedence over the corresponding Prettier
 * options, while Prettier options fill in the rules the config does not set.
 */
export function mergeTombiConfig(
  prettierConfig: TombiConfig,
  fileConfig: TombiConfig,
): TombiConfig {
  const prettierFormat = prettierConfig.format as
    { rules?: Record<string, TombiRuleValue> } | undefined
  const fileFormat = fileConfig.format as
    { rules?: Record<string, TombiRuleValue> } | undefined

  return {
    ...prettierConfig,
    ...fileConfig,
    format: {
      ...prettierFormat,
      ...fileFormat,
      rules: {
        ...prettierFormat?.rules,
        ...fileFormat?.rules,
      },
    },
  }
}

/** Serialize a Tombi configuration to TOML. */
export const serializeTombiConfig = (config: TombiConfig): string =>
  stringify(config)
