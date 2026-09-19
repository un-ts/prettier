import type { PrettierOptions } from './types.js'

type TombiRuleValue = boolean | number | string | undefined

/**
 * Serialize a single TOML value.
 *
 * All supported values are booleans, finite numbers and strings without
 * special characters, so `JSON.stringify` produces valid TOML literals.
 */
const serializeValue = (value: Exclude<TombiRuleValue, undefined>) =>
  JSON.stringify(value)

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

/**
 * Build a virtual `tombi.toml` configuration from the resolved Prettier
 * options. Prettier's own `printWidth`, `tabWidth`, `useTabs`, `singleQuote`
 * and `bracketSpacing` options are mapped to their Tombi counterparts.
 */
export function buildTombiConfig(options: PrettierOptions): string {
  const rules = getRules(options)

  return [
    `toml-version = ${serializeValue(options.tomlVersion ?? 'v1.0.0')}`,
    '',
    /*
     * Keep formatting deterministic and offline: schema driven reordering must
     * not affect Prettier output, and loading the remote schema catalogs would
     * make every format call hit the network.
     */
    '[schema]',
    'enabled = false',
    '',
    '[format.rules]',
    ...Object.entries(rules)
      .filter(
        (entry): entry is [string, Exclude<TombiRuleValue, undefined>] =>
          entry[1] != null,
      )
      .map(([key, value]) => `${toKebabCase(key)} = ${serializeValue(value)}`),
    '',
  ].join('\n')
}
