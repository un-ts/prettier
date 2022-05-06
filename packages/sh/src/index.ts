import path from 'path'
import { fileURLToPath } from 'url'

import { IntSupportOption, PathSupportOption, Plugin } from 'prettier'
import { File, Node, ParseError, ShOptions } from 'sh-syntax'
import { createSyncFn } from 'synckit'

import { languages } from './languages.js'

const isInModule = typeof __dirname === 'undefined'

const _dirname = isInModule
  ? path.dirname(fileURLToPath(import.meta.url))
  : __dirname

const workerPath = path.resolve(
  _dirname,
  `../worker.${isInModule ? 'mjs' : 'cjs'}`,
)

interface ProcessorSync {
  (text: string, options?: ShOptions | undefined): File
  (ast: File, options?: ShOptions | undefined): string
}

const processorSync = createSyncFn(workerPath) as ProcessorSync

const handleError = <T>(fn: () => T) => {
  try {
    return fn()
  } catch (err: unknown) {
    const error = err as Error | ParseError | string

    if (typeof error === 'string') {
      throw new SyntaxError(error)
    }

    if ('Pos' in error) {
      throw Object.assign(error, {
        loc: {
          start: {
            column: error.Pos.Col,
            line: error.Pos.Line,
          },
        },
      })
    }

    throw error
  }
}

const ShPlugin: Plugin<Node> = {
  languages,
  parsers: {
    sh: {
      parse: (
        text,
        _parsers,
        {
          filepath,
          useTabs,
          tabWidth,
          keepComments,
          stopAt,
          variant,
          indent,
          binaryNextLine,
          switchCaseIndent,
          spaceRedirects,
          keepPadding,
          minify,
          functionNextLine,
        }: ShOptions,
      ) =>
        handleError(() =>
          processorSync(text, {
            filepath,
            useTabs,
            tabWidth,
            keepComments,
            stopAt,
            variant,
            indent,
            binaryNextLine,
            switchCaseIndent,
            spaceRedirects,
            keepPadding,
            minify,
            functionNextLine,
          }),
        ),
      astFormat: 'sh',
      locStart: (node: Node) => node.Pos.Offset,
      locEnd: (node: Node) => node.End.Offset,
    },
  },
  printers: {
    sh: {
      print: (
        path,
        {
          originalText,
          filepath,
          useTabs,
          tabWidth,
          keepComments,
          stopAt,
          variant,
          indent,
          binaryNextLine,
          switchCaseIndent,
          spaceRedirects,
          keepPadding,
          minify,
          functionNextLine,
        }: ShOptions,
      ) =>
        handleError(() =>
          processorSync(path.getValue() as File, {
            filepath,
            originalText,
            useTabs,
            tabWidth,
            keepComments,
            stopAt,
            variant,
            indent,
            binaryNextLine,
            switchCaseIndent,
            spaceRedirects,
            keepPadding,
            minify,
            functionNextLine,
          }),
        ),
    },
  },
  options: {
    keepComments: {
      since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      default: true,
      description:
        'KeepComments makes the parser parse comments and attach them to nodes, as opposed to discarding them.',
    },
    stopAt: {
      since: '0.1.0',
      category: 'Config',
      type: 'path',
      description: [
        'StopAt configures the lexer to stop at an arbitrary word, treating it as if it were the end of the input. It can contain any characters except whitespace, and cannot be over four bytes in size.',
        'This can be useful to embed shell code within another language, as one can use a special word to mark the delimiters between the two.',
        'As a word, it will only apply when following whitespace or a separating token. For example, StopAt("$$") will act on the inputs "foo $$" and "foo;$$", but not on "foo \'$$\'".',
        'The match is done by prefix, so the example above will also act on "foo $$bar".',
      ].join('\n'),
    } as PathSupportOption,
    variant: {
      since: '0.1.0',
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
      ],
      description:
        'Variant changes the shell language variant that the parser will accept.',
    },
    indent: {
      since: '0.1.0',
      category: 'Format',
      type: 'int',
      description:
        'Indent sets the number of spaces used for indentation. If set to 0, tabs will be used instead.',
    } as IntSupportOption,
    binaryNextLine: {
      since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      default: true,
      description:
        'BinaryNextLine will make binary operators appear on the next line when a binary command, such as a pipe, spans multiple lines. A backslash will be used.',
    },
    switchCaseIndent: {
      since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: true,
      description:
        'SwitchCaseIndent will make switch cases be indented. As such, switch case bodies will be two levels deeper than the switch itself.',
    },
    spaceRedirects: {
      since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: true,
      description:
        "SpaceRedirects will put a space after most redirection operators. The exceptions are '>&', '<&', '>(', and '<('.",
    },
    keepPadding: {
      since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: false,
      description: [
        'KeepPadding will keep most nodes and tokens in the same column that they were in the original source. This allows the user to decide how to align and pad their code with spaces.',
        'Note that this feature is best-effort and will only keep the alignment stable, so it may need some human help the first time it is run.',
      ].join('\n'),
    },
    minify: {
      since: '0.1.0',
      category: 'Output',
      type: 'boolean',
      default: false,
      description:
        'Minify will print programs in a way to save the most bytes possible. For example, indentation and comments are skipped, and extra whitespace is avoided when possible.',
    },
    functionNextLine: {
      since: '0.1.0',
      category: 'Format',
      type: 'boolean',
      default: false,
      description:
        "FunctionNextLine will place a function's opening braces on the next line.",
    },
  },
}

export default ShPlugin
