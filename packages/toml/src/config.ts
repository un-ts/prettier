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
 * Build a virtual `tombi.toml` configuration from the resolved Prettier
 * options. Prettier's own `printWidth`, `tabWidth` and `useTabs` options are
 * mapped to their Tombi counterparts.
 */
export function buildTombiConfig(options: PrettierOptions): string {
  const rules: Record<string, TombiRuleValue> = {
    'array-bracket-space-width': options.arrayBracketSpaceWidth,
    'array-comma-space-width': options.arrayCommaSpaceWidth,
    'comment-style': options.commentStyle,
    'date-time-delimiter': options.dateTimeDelimiter,
    'group-blank-lines-limit': options.groupBlankLinesLimit,
    'indent-style': options.useTabs ? 'tab' : 'space',
    'indent-sub-tables': options.indentSubTables,
    'indent-table-key-value-pairs': options.indentTableKeyValuePairs,
    'indent-width': options.tabWidth,
    'inline-table-brace-space-width':
      options.inlineTableBraceSpaceWidth ?? (options.bracketSpacing ? 1 : 0),
    'inline-table-comma-space-width': options.inlineTableCommaSpaceWidth,
    'key-value-equals-sign-alignment': options.keyValueEqualsSignAlignment,
    'key-quote-style': options.keyQuoteStyle,
    'key-value-equals-sign-space-width': options.keyValueEqualsSignSpaceWidth,
    'line-width': Number.isFinite(options.printWidth)
      ? options.printWidth
      : undefined,
    'string-quote-style':
      options.stringQuoteStyle ?? (options.singleQuote ? 'single' : 'double'),
    'table-blank-lines': options.tableBlankLines,
    'trailing-comment-alignment': options.trailingCommentAlignment,
    'trailing-comment-space-width': options.trailingCommentSpaceWidth,
  }

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
      .map(([key, value]) => `${key} = ${serializeValue(value)}`),
    '',
  ].join('\n')
}
