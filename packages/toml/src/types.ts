import type { FormatOptions } from '@taplo/lib'
import type { ParserOptions } from 'prettier'

export interface AST {
  formatted: string
}

export type TaploOptions = NonNullable<FormatOptions['options']>
export type PrettierTaploOptions = Omit<
  TaploOptions,
  | 'allowedBlankLines'
  | 'arrayTrailingComma'
  | 'columnWidth'
  | 'crlf'
  | 'indentString'
  | 'trailingNewline'
>
export type PrettierOptions = ParserOptions<AST> & PrettierTaploOptions
