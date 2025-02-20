import sh, { type Node, type Pos } from 'mvdan-sh'
import type { ParserOptions, Plugin } from 'prettier'
import {
  type File,
  type Node as ShSyntaxNode,
  type ParseError,
  type ShOptions,
  processor,
} from 'sh-syntax'

import { languages } from './languages.js'

const { syntax } = sh

export interface ShParserOptions
  extends Required<ParserOptions<Node | ShSyntaxNode>>,
    Required<ShOptions> {
  experimentalWasm: boolean
}

export interface IShParseError extends Error {
  Filename: string
  Pos: Pos
  Text: string
  Incomplete: boolean
  Error(): void
}

class ShParseError extends SyntaxError {
  declare cause: IShParseError

  declare loc: { start: { column: number; line: number } } | undefined

  constructor(err: IShParseError) {
    super(err.Text)
    this.cause = err
    this.loc = {
      start: {
        column: err.Pos.Col(),
        line: err.Pos.Line(),
      },
    }
  }
}

class ShSyntaxParseError<
  E extends Error = ParseError | SyntaxError,
> extends SyntaxError {
  declare cause: E

  declare loc: { start: { column: number; line: number } } | undefined

  constructor(err: E) {
    const error = err as ParseError | SyntaxError
    super(('Text' in error && error.Text) || error.message)
    this.cause = err
    // `error instanceof ParseError` won't not work because the error is thrown wrapped by `synckit`
    if ('Pos' in error && error.Pos != null && typeof error.Pos === 'object') {
      this.loc = { start: { column: error.Pos.Col, line: error.Pos.Line } }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (val: unknown): val is Function => typeof val === 'function'

const ShPlugin: Plugin<Node | ShSyntaxNode> = {
  languages,
  parsers: {
    sh: {
      async parse(
        text,
        {
          filepath,
          keepComments = true,
          stopAt,
          variant,
          experimentalWasm,
        }: Partial<ShParserOptions>,
      ) {
        if (experimentalWasm) {
          try {
            return await processor(text, {
              filepath,
              keepComments,
              stopAt,
              variant,
            })
          } catch (err: unknown) {
            throw new ShSyntaxParseError(err as Error)
          }
        }

        const parserOptions = [syntax.KeepComments(keepComments)]

        if (stopAt != null) {
          parserOptions.push(syntax.StopAt(stopAt))
        }

        if (variant != null) {
          parserOptions.push(syntax.Variant(variant))
        }

        try {
          return syntax.NewParser(...parserOptions).Parse(text, filepath)
        } catch (err: unknown) {
          throw new ShParseError(err as IShParseError)
        }
      },
      astFormat: 'sh',
      hasPragma: (text: string): boolean => {
        // We don't want to parse every file twice but Prettier's interface
        // isn't conducive to caching/memoizing an upstream Parser, so we're
        // going with some minor Regex hackery.
        //
        // Only read empty lines, comments, and shebangs at the start of the file.
        // We do not support Bash's pseudo-block comments.

        // No, we don't support unofficial block comments.
        const commentLineRegex = /^\s*(#(?<comment>.*))?$/gm
        let lastIndex = -1

        // Only read leading comments, skip shebangs, and check for the pragma.
        // We don't want to have to parse every file twice.
        for (;;) {
          const match = commentLineRegex.exec(text)

          // Found "real" content, EoF, or stuck in a loop.
          if (match == null || match.index !== lastIndex + 1) {
            return false
          }

          lastIndex = commentLineRegex.lastIndex
          const comment = match.groups?.comment?.trim()

          // Empty lines and shebangs have no captures
          if (comment == null) {
            continue
          }

          if (
            comment.startsWith('@prettier') ||
            comment.startsWith('@format')
          ) {
            return true
          }
        }
      },
      locStart: node =>
        isFunction(node.Pos) ? node.Pos().Offset() : node.Pos.Offset,
      locEnd: node =>
        isFunction(node.End) ? node.End().Offset() : node.End.Offset,
    },
  },
  printers: {
    sh: {
      print(
        path,
        {
          originalText,
          filepath,
          useTabs,
          tabWidth,
          indent = useTabs ? 0 : tabWidth,
          binaryNextLine = true,
          switchCaseIndent = true,
          spaceRedirects = true,
          keepPadding,
          minify,
          functionNextLine,
          experimentalWasm,
        }: ShParserOptions,
      ) {
        if (experimentalWasm) {
          return processor(path.getNode() as File, {
            originalText,
            filepath,
            useTabs,
            tabWidth,
            indent,
            binaryNextLine,
            switchCaseIndent,
            spaceRedirects,
            keepPadding,
            minify,
            functionNextLine,
            // https://github.com/prettier/prettier/issues/15080#issuecomment-1630987744
          }) as unknown as string
        }

        return syntax
          .NewPrinter(
            syntax.Indent(indent),
            syntax.BinaryNextLine(binaryNextLine),
            syntax.SwitchCaseIndent(switchCaseIndent),
            syntax.SpaceRedirects(spaceRedirects),
            syntax.KeepPadding(keepPadding),
            syntax.Minify(minify),
            syntax.FunctionNextLine(functionNextLine),
          )
          .Print(path.node as Node)
      },
    },
  },
  options: {
    keepComments: {
      // since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      default: true,
      description:
        'KeepComments makes the parser parse comments and attach them to nodes, as opposed to discarding them.',
    },
    stopAt: {
      // since: '0.1.0',
      category: 'Config',
      type: 'path',
      description: [
        'StopAt configures the lexer to stop at an arbitrary word, treating it as if it were the end of the input. It can contain any characters except whitespace, and cannot be over four bytes in size.',
        'This can be useful to embed shell code within another language, as one can use a special word to mark the delimiters between the two.',
        'As a word, it will only apply when following whitespace or a separating token. For example, StopAt("$$") will act on the inputs "foo $$" and "foo;$$", but not on "foo \'$$\'".',
        'The match is done by prefix, so the example above will also act on "foo $$bar".',
      ].join('\n'),
    },
    variant: {
      // since: '0.1.0',
      category: 'Config',
      type: 'choice',
      default: undefined,
      choices: [
        {
          value: 0, // LangVariant.LangBash,
          description: 'Bash',
        },
        {
          value: 1, // LangVariant.LangPOSIX,
          description: 'POSIX',
        },
        {
          value: 2, // LangVariant.LangMirBSDKorn,
          description: 'MirBSDKorn',
        },
        {
          value: 3, // LangVariant.LangBats,
          description: 'Bats',
        },
      ],
      description:
        'Variant changes the shell language variant that the parser will accept.',
    },
    indent: {
      // since: '0.1.0',
      category: 'Format',
      type: 'int',
      description:
        'Indent sets the number of spaces used for indentation. If set to 0, tabs will be used instead.',
    },
    binaryNextLine: {
      // since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      default: true,
      description:
        'BinaryNextLine will make binary operators appear on the next line when a binary command, such as a pipe, spans multiple lines. A backslash will be used.',
    },
    switchCaseIndent: {
      // since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: true,
      description:
        'SwitchCaseIndent will make switch cases be indented. As such, switch case bodies will be two levels deeper than the switch itself.',
    },
    spaceRedirects: {
      // since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: true,
      description:
        "SpaceRedirects will put a space after most redirection operators. The exceptions are '>&', '<&', '>(', and '<('.",
    },
    keepPadding: {
      // since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: false,
      description: [
        'KeepPadding will keep most nodes and tokens in the same column that they were in the original source. This allows the user to decide how to align and pad their code with spaces.',
        'Note that this feature is best-effort and will only keep the alignment stable, so it may need some human help the first time it is run.',
      ].join('\n'),
    },
    minify: {
      // since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      default: false,
      description:
        'Minify will print programs in a way to save the most bytes possible. For example, indentation and comments are skipped, and extra whitespace is avoided when possible.',
    },
    functionNextLine: {
      // since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: false,
      description:
        "FunctionNextLine will place a function's opening braces on the next line.",
    },
    experimentalWasm: {
      // since: '0.13.0',
      category: 'config',
      type: 'boolean',
      default: false,
      description:
        'Whether prefer to use experimental `sh-syntax` instead of `mvdan-sh`, it could still be buggy',
    },
  },
}

export default ShPlugin
