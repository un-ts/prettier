import sh, { LangVariant, Node } from 'mvdan-sh'
import { FastPath, ParserOptions, Plugin, RequiredOptions } from 'prettier'

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

export type ShParserOptions = ShOptions & ParserOptions

export default {
  name: 'prettier-plugin-sh',
  languages,
  parsers: {
    sh: {
      parse: (
        text,
        _parsers,
        {
          filepath,
          /* istanbul ignore next */ keepComments = true,
          stopAt,
          variant,
        }: Partial<ShOptions>,
      ) => {
        const parserOptions = [syntax.KeepComments(keepComments)]

        /* istanbul ignore if */
        if (stopAt != null) {
          parserOptions.push(syntax.StopAt(stopAt))
        }

        /* istanbul ignore if */
        if (variant != null) {
          parserOptions.push(syntax.Variant(variant))
        }

        return syntax.NewParser(...parserOptions).Parse(text, filepath)
      },
      astFormat: 'sh',
      locStart: /* istanbul ignore next */ (node: Node) => node.Pos().Offset(),
      locEnd: /* istanbul ignore next */ (node: Node) => node.End().Offset(),
    },
  },
  printers: {
    sh: {
      print: (
        path: FastPath<Node>,
        {
          useTabs,
          tabWidth,
          indent = useTabs ? 0 : tabWidth,
          /* istanbul ignore next */ binaryNextLine = true,
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
