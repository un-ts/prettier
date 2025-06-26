import fs from 'node:fs'
import path from 'node:path'

import * as linguistLanguages from 'linguist-languages'
import type { SupportLanguage } from 'prettier'
import serializeJavascript from 'serialize-javascript'

const EXTRA_SH_LANGUAGES: SupportLanguage[] = [
  {
    name: 'JvmOptions',
    parsers: ['sh'],
    extensions: ['.vmoptions'],
    filenames: ['jvm.options'],
    vscodeLanguageIds: ['jvmoptions'],
  },
  {
    name: 'hosts',
    parsers: ['sh'],
    filenames: ['hosts'],
    vscodeLanguageIds: ['hosts'],
  },
  {
    name: 'dotenv',
    parsers: ['sh'],
    extensions: ['.env'],
    vscodeLanguageIds: ['dotenv'],
    isSupported({ filepath }) {
      const basename = path.basename(filepath)
      return basename === '.env' || basename.startsWith('.env.')
    },
  },
  {
    name: 'husky',
    parsers: ['sh'],
    isSupported({ filepath }) {
      const dirname = path.dirname(filepath)
      return path.basename(dirname) === '.husky'
    },
  },
  {
    name: 'nvmrc',
    parsers: ['sh'],
    extensions: ['.node-version', '.nvmrc'],
    filenames: ['.node-version', '.nvmrc'],
  },
]

const getSupportedLanguages = (
  parser: 'autocorrect' | 'dockerfile' | 'sh' | 'sql' | 'toml',
  aceModes: string[] = [parser],
  excludeNames?: string[],
) =>
  Object.values(linguistLanguages).reduce<SupportLanguage[]>(
    (
      acc,
      { aceMode, name, type: _type, languageId: linguistLanguageId, ...rest },
    ) => {
      if (!aceModes.includes('all') && !aceModes.includes(aceMode)) {
        return acc
      }
      if (excludeNames?.includes(name)) {
        return acc
      }
      if ('color' in rest) {
        // @ts-expect-error -- annoying
        delete rest.color
      }
      acc.push({
        name,
        aceMode,
        parsers: [parser],
        linguistLanguageId,
        vscodeLanguageIds: [aceMode === 'sh' ? 'shellscript' : aceMode],
        ...rest,
      })
      return acc
    },
    [],
  )

const serialize = (input: unknown) =>
  serializeJavascript(input, { space: 2, unsafe: true })

fs.writeFileSync(
  'packages/autocorrect/src/languages.ts',
  `import type { SupportLanguage } from 'prettier'

export const languages = ${serialize(
    getSupportedLanguages('autocorrect', ['all']),
  )} as SupportLanguage[]`,
)

fs.writeFileSync(
  'packages/sh/src/languages.ts',
  `import path from 'node:path'

  import type { SupportLanguage } from 'prettier'

export const languages = ${serialize([
    ...getSupportedLanguages('dockerfile'),
    ...getSupportedLanguages(
      'sh',
      ['gitignore', 'properties', 'sh'],
      [
        /**
         * `ShellSession` includes both commands and output. We can't reliably
         * format the latter, so we exclude this language entirely.
         */
        'ShellSession',
      ],
    ),
    ...EXTRA_SH_LANGUAGES,
  ])} as SupportLanguage[]
`,
)

fs.writeFileSync(
  'packages/sql/src/languages.ts',
  `import type { SupportLanguage } from 'prettier'

export const languages = ${serialize([
    ...getSupportedLanguages('sql', ['sql', 'pgsql']),
  ])} as SupportLanguage[]
`,
)

fs.writeFileSync(
  'packages/toml/src/languages.ts',
  `import type { SupportLanguage } from 'prettier'

export const languages = ${serialize([
    ...getSupportedLanguages('toml'),
  ])} as SupportLanguage[]
`,
)
