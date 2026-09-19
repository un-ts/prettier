import type { SupportOption } from 'prettier'

import type { PrettierTombiOptions } from './types.js'

/**
 * Prettier options mapped to the corresponding Tombi `[format.rules]` entries.
 *
 * @see https://github.com/tombi-toml/tombi/blob/main/crates/tombi-config/src/format.rs
 */
export const prettierOptionsDefinitions = {
  tomlVersion: {
    name: 'tomlVersion',
    type: 'choice',
    category: 'toml',
    default: 'v1.0.0',
    description: 'The TOML version to use when parsing and formatting.',
    choices: [
      { value: 'v1.0.0', description: 'TOML v1.0.0' },
      { value: 'v1.1.0', description: 'TOML v1.1.0' },
      { value: 'v1.1.0-preview', description: 'TOML v1.1.0 (preview)' },
    ],
  },
  arrayBracketSpaceWidth: {
    name: 'arrayBracketSpaceWidth',
    type: 'int',
    category: 'toml',
    default: 0,
    range: { start: 0, end: 255, step: 1 },
    description:
      'The number of spaces inside the brackets of a single line array.',
  },
  arrayCommaSpaceWidth: {
    name: 'arrayCommaSpaceWidth',
    type: 'int',
    category: 'toml',
    default: 1,
    range: { start: 0, end: 255, step: 1 },
    description: 'The number of spaces after the comma in a single line array.',
  },
  commentStyle: {
    name: 'commentStyle',
    type: 'choice',
    category: 'toml',
    default: 'normalize',
    description: 'The style used to format comments.',
    choices: [
      {
        value: 'normalize',
        description: "Normalize comment text following Tombi's rules",
      },
      { value: 'preserve', description: 'Preserve the original comment text' },
    ],
  },
  dateTimeDelimiter: {
    name: 'dateTimeDelimiter',
    type: 'choice',
    category: 'toml',
    default: 'T',
    description: 'The delimiter between date and time.',
    choices: [
      { value: 'T', description: 'Use `T` between date and time' },
      { value: 'space', description: 'Use a space between date and time' },
      { value: 'preserve', description: 'Preserve the original delimiter' },
    ],
  },
  groupBlankLinesLimit: {
    name: 'groupBlankLinesLimit',
    type: 'int',
    category: 'toml',
    default: 1,
    range: { start: 1, end: 255, step: 1 },
    description: 'The blank lines limit between groups.',
  },
  indentSubTables: {
    name: 'indentSubTables',
    type: 'boolean',
    category: 'toml',
    default: false,
    description: 'Whether to indent sub-tables.',
  },
  indentTableKeyValuePairs: {
    name: 'indentTableKeyValuePairs',
    type: 'boolean',
    category: 'toml',
    default: false,
    description: 'Whether to indent table key-value pairs.',
  },
  inlineTableBraceSpaceWidth: {
    name: 'inlineTableBraceSpaceWidth',
    type: 'int',
    category: 'toml',
    range: { start: 0, end: 255, step: 1 },
    description:
      'The number of spaces inside the braces of a single line inline table, defaults to `bracketSpacing` (1 or 0).',
  },
  inlineTableCommaSpaceWidth: {
    name: 'inlineTableCommaSpaceWidth',
    type: 'int',
    category: 'toml',
    default: 1,
    range: { start: 0, end: 255, step: 1 },
    description:
      'The number of spaces after the comma in a single line inline table.',
  },
  keyValueEqualsSignAlignment: {
    name: 'keyValueEqualsSignAlignment',
    type: 'boolean',
    category: 'toml',
    default: false,
    description: 'Whether to align the equals sign in key-value pairs.',
  },
  keyQuoteStyle: {
    name: 'keyQuoteStyle',
    type: 'choice',
    category: 'toml',
    description:
      'The preferred quote character for keys, defaults to `stringQuoteStyle`.',
    choices: [
      { value: 'double', description: 'Prefer double quotes' },
      { value: 'single', description: 'Prefer single quotes' },
      { value: 'preserve', description: 'Preserve the source quote' },
    ],
  },
  stringQuoteStyle: {
    name: 'stringQuoteStyle',
    type: 'choice',
    category: 'toml',
    description:
      'The preferred quote character for strings, defaults to `singleQuote` (`single` or `double`).',
    choices: [
      { value: 'double', description: 'Prefer double quotes' },
      { value: 'single', description: 'Prefer single quotes' },
      { value: 'preserve', description: 'Preserve the source quote' },
    ],
  },
  trailingCommentAlignment: {
    name: 'trailingCommentAlignment',
    type: 'boolean',
    category: 'toml',
    default: false,
    description: 'Whether to align the trailing comments in key-value pairs.',
  },
  keyValueEqualsSignSpaceWidth: {
    name: 'keyValueEqualsSignSpaceWidth',
    type: 'int',
    category: 'toml',
    default: 1,
    range: { start: 0, end: 255, step: 1 },
    description:
      'The number of spaces around the equals sign in a key-value pair.',
  },
  tableBlankLines: {
    name: 'tableBlankLines',
    type: 'int',
    category: 'toml',
    default: 1,
    range: { start: 0, end: 255, step: 1 },
    description: 'The number of blank lines between tables.',
  },
  trailingCommentSpaceWidth: {
    name: 'trailingCommentSpaceWidth',
    type: 'int',
    category: 'toml',
    default: 2,
    range: { start: 0, end: 255, step: 1 },
    description: 'The number of spaces before a trailing comment.',
  },
} satisfies Record<keyof PrettierTombiOptions, SupportOption>
