import type { FormatOptions } from '@taplo/lib'
import type { ParserOptions } from 'prettier'

export type TaploOptions = NonNullable<FormatOptions['options']>
export type PrettierTaploOptions = Omit<
  TaploOptions,
  | 'arrayTrailingComma'
  | 'columnWidth'
  | 'crlf'
  | 'indentString'
  | 'trailingNewline'
>
export type PrettierOptions = ParserOptions & PrettierTaploOptions
