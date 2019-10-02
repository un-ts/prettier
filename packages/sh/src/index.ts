import sh, { Node } from 'mvdan-sh'
import { FastPath, Plugin } from 'prettier'

import { languages } from './languages'

const { syntax } = sh
const parser = syntax.NewParser()
const printer = syntax.NewPrinter()

syntax.KeepComments(parser, true)

export default {
  name: 'prettier-plugin-sh',
  languages,
  parsers: {
    sh: {
      parse: (text, _parsers, { filepath }) => parser.Parse(text, filepath),
      astFormat: 'sh',
      locStart: (node: Node) => node.Pos().Offset(),
      locEnd: (node: Node) => node.End().Offset(),
    },
  },
  printers: {
    sh: {
      print: (path: FastPath<Node>) => printer.Print(path.getValue()),
    },
  },
} as Plugin
