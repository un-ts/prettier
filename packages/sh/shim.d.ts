declare module 'mvdan-sh' {
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

    // eslint-disable-next-line @typescript-eslint/no-type-alias
    type Command = Node

    interface Stmt {
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

    interface Parser {
      keepComments: boolean
      (...options: ParserOption[]): Parser
      Parse(text: string, path?: string): File
    }

    interface Printer {
      (): Printer
      Print(node: Node): string
    }

    interface ShellScript {
      syntax: {
        NewParser: Parser
        NewPrinter: Printer
        KeepComments(parser: sh.Parser, keep: boolean): ParserOption
        DebugPrint(node: Node): void
        NodeType(node: Node): string
        ValidName(value: string): boolean
        Walk(node: Node, walker: (node: Node) => boolean): void
      }
    }
  }

  const sh: sh.ShellScript

  export = sh
}
