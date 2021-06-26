import sh, { LangVariant, Node, Pos } from 'mvdan-sh'
import { AstPath, ParserOptions, Plugin, RequiredOptions } from 'prettier'

import { languages } from './languages'

const { syntax } = sh

export interface ShOptions extends RequiredOptions {
  // parser
  keepComments: boolean
  stopAt: string
  variant: LangVariant

  // printer
  indent: number
  binaryNextLine: boolean
  switchCaseIndent: boolean
  spaceRedirects: boolean
  keepPadding: boolean
  minify: boolean
  functionNextLine: boolean
}

export type ShParserOptions = ParserOptions & ShOptions

export interface ShParseError {
  Filename: string
  Pos: Pos
  Text: string
  Incomplete: boolean
  Error(): void
}

export default {
  name: 'prettier-plugin-sh',
  languages,
  parsers: {
    sh: {
      parse: (
        text,
        _parsers,
        { filepath, keepComments = true, stopAt, variant }: Partial<ShOptions>,
      ) => {
        const parserOptions = [syntax.KeepComments(keepComments)]

        if (stopAt != null) {
          parserOptions.push(syntax.StopAt(stopAt))
        }

        if (variant != null) {
          parserOptions.push(syntax.Variant(variant))
        }

        try {
          return syntax.NewParser(...parserOptions).Parse(text, filepath)
        } catch (e) {
          const err = e as ShParseError
          throw Object.assign(new SyntaxError(err.Text), {
            loc: {
              start: {
                column: err.Pos.Col(),
                line: err.Pos.Line(),
              },
            },
          })
        }
      },
      astFormat: 'sh',
      locStart: (node: Node) => node.Pos().Offset(),
      locEnd: (node: Node) => node.End().Offset(),
    },
  },
  printers: {
    sh: {
      print: (
        path: AstPath<Node>,
        {
          useTabs,
          tabWidth,
          indent = useTabs ? 0 : tabWidth,
          binaryNextLine = true,
          switchCaseIndent,
          spaceRedirects,
          keepPadding,
          minify,
          functionNextLine,
        }: ShParserOptions,
      ) =>
        syntax
          .NewPrinter(
            syntax.Indent(indent),
            syntax.BinaryNextLine(binaryNextLine),
            syntax.SwitchCaseIndent(switchCaseIndent),
            syntax.SpaceRedirects(spaceRedirects),
            syntax.KeepPadding(keepPadding),
            syntax.Minify(minify),
            syntax.FunctionNextLine(functionNextLine),
          )
          .Print(path.getValue()),
    },
  },
} as Plugin
