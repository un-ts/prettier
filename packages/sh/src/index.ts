import type { Parser, ParserOptions, Plugin, Printer } from 'prettier'
import {
  type File,
  LangVariant,
  type Node,
  type ParseError,
  type ShOptions,
  type ShPrintOptions as ShFormatOptions,
  processor,
} from 'sh-syntax'

export { languages } from './languages.js'

export interface DockerfilePrintOptions extends ParserOptions<string> {
  indent?: number
}

export interface ShParserOptions
  extends Partial<ParserOptions<Node>>,
    ShOptions {
  filepath: string
}

export interface ShPrintOptions extends ShFormatOptions {
  filepath: string
  tabWidth: number
}

export class ShSyntaxParseError<
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

function hasPragma(text: string) {
  /**
   * We don't want to parse every file twice but Prettier's interface
   * isn't conducive to caching/memoizing an upstream Parser, so we're
   * going with some minor Regex hackery.
   *
   * Only read empty lines, comments, and shebangs at the start of the file.
   * We do not support Bash's pseudo-block comments.
   */

  // No, we don't support unofficial block comments.
  const commentLineRegex = /^\s*(#(?<comment>.*))?$/gm
  let lastIndex = -1

  /**
   * Only read leading comments, skip shebangs, and check for the pragma.
   * We don't want to have to parse every file twice.
   */
  for (;;) {
    const match = commentLineRegex.exec(text)

    // Found "real" content, EoF, or stuck in a loop.
    if (match == null || match.index !== lastIndex + 1) {
      return false
    }

    lastIndex = commentLineRegex.lastIndex
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- incorrect typing
    const comment = match.groups?.comment?.trim()

    // Empty lines and shebangs have no captures
    if (comment == null) {
      continue
    }

    if (comment.startsWith('@prettier') || comment.startsWith('@format')) {
      return true
    }
  }
}

const dockerfileParser: Parser<string> = {
  astFormat: 'dockerfile',
  hasPragma,
  parse: text => text,
  locStart: () => 0,
  locEnd: node => node.length,
}

let formatDockerfileContents_:
  | typeof import('@reteps/dockerfmt').formatDockerfileContents
  | undefined

const getFormatDockerfileContents = async () => {
  if (!formatDockerfileContents_) {
    const dockerfmt = await import('@reteps/dockerfmt')
    formatDockerfileContents_ = dockerfmt.formatDockerfileContents
  }
  return formatDockerfileContents_
}

const dockerPrinter: Printer<string> = {
  // @ts-expect-error -- https://github.com/prettier/prettier/issues/15080#issuecomment-1630987744
  async print(
    path,
    {
      useTabs,
      tabWidth,
      indent = useTabs ? 0 : tabWidth,
    }: DockerfilePrintOptions,
  ) {
    const node = path.getNode()
    if (!node) {
      return ''
    }
    const formatDockerfileContents = await getFormatDockerfileContents()
    return formatDockerfileContents(node, {
      indent,
      trailingNewline: true,
    })
  },
}

const shParser: Parser<Node> = {
  astFormat: 'sh',
  hasPragma,
  locStart: node => node.Pos.Offset,
  locEnd: node => node.End.Offset,
  async parse(
    text,
    {
      filepath,
      keepComments = true,
      /** The following \@link doesn't work as expected, see {@link https://github.com/microsoft/tsdoc/issues/9} */
      /** TODO: support {@link LangVariant.LangAuto} */ // eslint-disable-line sonarjs/todo-tag
      variant,
      stopAt,
      recoverErrors,
    }: ShParserOptions,
  ) {
    return processor(text, {
      filepath,
      keepComments,
      variant,
      stopAt,
      recoverErrors,
    })
  },
}

const shPrinter: Printer<Node | string> = {
  // @ts-expect-error -- https://github.com/prettier/prettier/issues/15080#issuecomment-1630987744
  async print(
    path,
    {
      originalText,
      filepath,

      // parser options
      keepComments = true,
      variant,
      stopAt,
      recoverErrors,

      // printer options
      useTabs,
      tabWidth,
      indent = useTabs ? 0 : tabWidth,
      binaryNextLine = true,
      switchCaseIndent = true,
      spaceRedirects = true,
      // eslint-disable-next-line sonarjs/deprecation
      keepPadding,
      minify,
      singleLine,
      functionNextLine,
    }: ShPrintOptions,
  ) {
    const node = path.getNode()
    if (!node) {
      return ''
    }
    return processor(node as File, {
      originalText,
      filepath,
      keepComments,
      variant,
      stopAt,
      recoverErrors,
      useTabs,
      tabWidth,
      indent,
      binaryNextLine,
      switchCaseIndent,
      spaceRedirects,
      keepPadding,
      minify,
      singleLine,
      functionNextLine,
    })
  },
}

export const parsers = {
  dockerfile: dockerfileParser,
  sh: shParser,
}

export const printers = {
  dockerfile: dockerPrinter,
  sh: shPrinter,
}

export const options: Plugin['options'] = {
  keepComments: {
    // since: '0.1.0',
    category: 'Output',
    type: 'boolean',
    default: true,
    description:
      'KeepComments makes the parser parse comments and attach them to nodes, as opposed to discarding them.',
  },
  variant: {
    // since: '0.1.0',
    category: 'Config',
    type: 'choice',
    choices: [
      {
        value: LangVariant.LangBash,
        description: [
          'LangBash corresponds to the GNU Bash language, as described in its manual at https://www.gnu.org/software/bash/manual/bash.html.',
          '',
          'We currently follow Bash version 5.2.',
          '',
          'Its string representation is "bash".',
        ].join('\n'),
      },
      {
        value: LangVariant.LangPOSIX,
        description: [
          'LangPOSIX corresponds to the POSIX Shell language, as described at https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html.',
          '',
          'Its string representation is "posix" or "sh".',
        ].join('\n'),
      },
      {
        value: LangVariant.LangMirBSDKorn,
        description: [
          'LangMirBSDKorn corresponds to the MirBSD Korn Shell, also known as mksh, as described at http://www.mirbsd.org/htman/i386/man1/mksh.htm.',
          'Note that it shares some features with Bash, due to the shared ancestry that is ksh.',
          '',
          'We currently follow mksh version 59.',
          '',
          'Its string representation is "mksh".',
        ].join('\n'),
      },
      {
        value: LangVariant.LangBats,
        description: [
          'LangBats corresponds to the Bash Automated Testing System language, as described at https://github.com/bats-core/bats-core.',
          "Note that it's just a small extension of the Bash language.",
          '',
          'Its string representation is "bats".',
        ].join('\n'),
      },
      {
        value: LangVariant.LangAuto,
        description: [
          "LangAuto corresponds to automatic language detection, commonly used by end-user applications like shfmt, which can guess a file's language variant given its filename or shebang.",
          '',
          'At this time, [Variant] does not support LangAuto.',
        ].join('\n'),
      },
    ],
    description:
      'Variant changes the shell language variant that the parser will accept.',
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
  recoverErrors: {
    // since: '0.17.0',
    category: 'Config',
    type: 'path',
    description: [
      'RecoverErrors allows the parser to skip up to a maximum number of errors in the given input on a best-effort basis.',
      'This can be useful to tab-complete an interactive shell prompt, or when providing diagnostics on slightly incomplete shell source.',
      '',
      'Currently, this only helps with mandatory tokens from the shell grammar which are not present in the input. They result in position fields or nodes whose position report [Pos.IsRecovered] as true.',
      '',
      'For example, given the input `(foo |`, the result will contain two recovered positions; first, the pipe requires a statement to follow, and as [Stmt.Pos] reports, the entire node is recovered.',
      'Second, the subshell needs to be closed, so [Subshell.Rparen] is recovered.',
    ].join('\n'),
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
      'KeepPadding will keep most nodes and tokens in the same column that they were in the original source.',
      'This allows the user to decide how to align and pad their code with spaces.',
      '',
      'Note that this feature is best-effort and will only keep the alignment stable, so it may need some human help the first time it is run.',
    ].join('\n'),
    deprecated: [
      'This formatting option is flawed and buggy, and often does not result in what the user wants when the code gets complex enough.',
      'The next major version, v4, will remove this feature entirely.',
      'See: https://github.com/mvdan/sh/issues/658',
    ].join('\n'),
  },
  minify: {
    // since: '0.1.0',
    category: 'Output',
    type: 'boolean',
    default: false,
    description: [
      'Minify will print programs in a way to save the most bytes possible.',
      'For example, indentation and comments are skipped, and extra whitespace is avoided when possible.',
    ].join('\n'),
  },
  singleLine: {
    // since: '0.17.0',
    category: 'Format',
    type: 'boolean',
    default: false,
    description: [
      'SingleLine will attempt to print programs in one line. For example, lists of commands or nested blocks do not use newlines in this mode.',
      'Note that some newlines must still appear, such as those following comments or around here-documents.',
      '',
      "Print's trailing newline when given a [*File] is not affected by this option.",
    ].join('\n'),
  },
  functionNextLine: {
    // since: '0.1.0',
    category: 'Format',
    type: 'boolean',
    default: false,
    description:
      "FunctionNextLine will place a function's opening braces on the next line.",
  },
}
