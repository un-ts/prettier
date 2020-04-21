/* eslint-disable @typescript-eslint/no-type-alias */
declare module 'mvdan-sh' {
  export const enum LangVariant {
    LangBash,
    LangPOSIX,
    LangMirBSDKorn,
  }

  namespace sh {
    interface Pos {
      After(p: Pos): boolean
      Col(): number
      IsValid(): boolean
      Line(): number
      Offset(): number
      String(): string
    }

    interface Node {
      Pos(): Pos
      End(): Pos
    }

    type Command = Node

    type WordPart = Node

    interface Word extends Node {
      Parts: WordPart[]
      Lit(): string
    }

    interface Lit extends Node {
      ValuePos: Pos
      ValueEnd: Pos
      Value: string
    }

    interface Stmt extends Node {
      Comments: Comment[]
      Cmd: Command
      Position: Pos
      Semicolon: Pos
      Negated: boolean
      Background: boolean
      Coprocess: boolean
    }

    interface Comment extends Node {
      Hash: Pos
      Text: string
    }

    interface File extends Node {
      Name: string
      Stmts?: Stmt[]
      Last: Stmt[]
    }

    type ParserOption = (parser: Parser) => void

    type PrinterOption = (printer: Printer) => void

    interface Parser {
      Parse(text: string, path?: string): File
    }

    interface Printer {
      Print(node: Node): string
    }

    interface ShellScript {
      syntax: {
        LangBash: LangVariant.LangBash
        LangPOSIX: LangVariant.LangPOSIX
        LangMirBSDKorn: LangVariant.LangMirBSDKorn
        NewParser(...options: ParserOption[]): Parser
        NewPrinter(...options: PrinterOption[]): Printer
        KeepComments(enabled?: boolean): ParserOption
        StopAt(word: string): ParserOption
        Variant(lang: LangVariant): ParserOption
        Indent(spaces: number): PrinterOption
        BinaryNextLine(enabled: boolean): PrinterOption
        SwitchCaseIndent(enabled: boolean): PrinterOption
        SpaceRedirects(enabled: boolean): PrinterOption
        KeepPadding(enabled: boolean): PrinterOption
        Minify(enabled: boolean): PrinterOption
        FunctionNextLine(enabled: boolean): PrinterOption
        DebugPrint(node: Node): void
        NodeType(node: Node): string
        Walk(node: Node, walker: (node: Node) => boolean): void
      }
    }
  }

  const sh: sh.ShellScript

  export = sh
}
