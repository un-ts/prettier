import type { ParserOptions } from 'prettier'

/** The TOML specification version used to parse and format the document. */
export type TomlVersion = 'v1.0.0' | 'v1.1.0-preview' | 'v1.1.0'

/** The preferred quote character for strings and keys. */
export type StringQuoteStyle = 'double' | 'preserve' | 'single'

/** The style used to format comments. */
export type CommentStyle = 'normalize' | 'preserve'

/** The delimiter used between the date and time parts of a date-time value. */
export type DateTimeDelimiter = 'preserve' | 'space' | 'T'

/**
 * Tombi formatter options exposed by this Prettier plugin.
 *
 * @see https://github.com/tombi-toml/tombi
 */
export interface PrettierTombiOptions {
  /** The TOML version to use when parsing and formatting. */
  tomlVersion?: TomlVersion
  /** The number of spaces inside the brackets of a single line array. */
  arrayBracketSpaceWidth?: number
  /** The number of spaces after the comma in a single line array. */
  arrayCommaSpaceWidth?: number
  /** The style used to format comments. */
  commentStyle?: CommentStyle
  /** The delimiter between date and time. */
  dateTimeDelimiter?: DateTimeDelimiter
  /** The blank lines limit between groups. */
  groupBlankLinesLimit?: number
  /** Whether to indent sub-tables. */
  indentSubTables?: boolean
  /** Whether to indent table key-value pairs. */
  indentTableKeyValuePairs?: boolean
  /** The number of spaces inside the braces of a single line inline table. */
  inlineTableBraceSpaceWidth?: number
  /** The number of spaces after the comma in a single line inline table. */
  inlineTableCommaSpaceWidth?: number
  /** Whether to align the equals sign in key-value pairs. */
  keyValueEqualsSignAlignment?: boolean
  /**
   * The preferred quote character for keys.
   *
   * Defaults to `stringQuoteStyle`.
   */
  keyQuoteStyle?: StringQuoteStyle
  /** The preferred quote character for strings. */
  stringQuoteStyle?: StringQuoteStyle
  /** Whether to align the trailing comments in key-value pairs. */
  trailingCommentAlignment?: boolean
  /** The number of spaces around the equals sign in a key-value pair. */
  keyValueEqualsSignSpaceWidth?: number
  /** The number of blank lines between tables. */
  tableBlankLines?: number
  /** The number of spaces before a trailing comment. */
  trailingCommentSpaceWidth?: number
}

export type PrettierOptions = ParserOptions & PrettierTombiOptions
