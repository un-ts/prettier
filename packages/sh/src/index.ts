import { Doc, FastPath, Plugin } from 'prettier'
// @ts-ignore
const sh = require('mvdan-sh')

const syntax = sh.syntax
const parser = syntax.NewParser()
const printer = syntax.NewPrinter()

export default {
  name: 'prettier-plugin-sh',
  languages: [
    {
      name: 'ShellScript',
      parsers: ['sh-parse'],
    },
  ],
  parsers: {
    'sh-parse': {
      parse: (text: string) => parser.Parse(text, 'src'),
      astFormat: 'sh-parse',
      locStart: () => -1,
      locEnd: () => -1,
      hasPragma: () => false,
    },
  },
  printers: {
    'sh-parse': {
      print: (path: FastPath): Doc => printer.Print(path.getValue()),
    },
  },
} as Plugin
