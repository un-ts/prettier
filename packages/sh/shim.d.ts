/* eslint-disable @typescript-eslint/no-type-alias */
declare module 'mvdan-sh' {
  const enum LangVariant {
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

    type ParserOption<T = unknown> = (parser: Parser, options?: T) => void

    type PrinterOption<T = unknown> = (printer: Printer, options?: T) => void

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
        NewParser<T>(...options: Array<ParserOption<T>>): Parser
        NewPrinter<T>(...options: Array<PrinterOption<T>>): Printer
        KeepComments(parser: Parser, keep?: boolean): void
        StopAt(word: string): ParserOption<string>
        Variant(lang: LangVariant): ParserOption<string>
        DebugPrint(node: Node): void
        NodeType(node: Node): string
        Walk(node: Node, walker: (node: Node) => boolean): void
      }
    }
  }

  const sh: sh.ShellScript

  export = sh
}
