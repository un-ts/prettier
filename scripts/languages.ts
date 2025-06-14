import fs from 'node:fs'

import * as linguistLanguages from 'linguist-languages'
import type { SupportLanguage } from 'prettier'

const EXTRA_SH_LANGUAGES: SupportLanguage[] = [
  {
    name: 'JvmOptions',
    since: '0.1.0',
    parsers: ['sh'],
    extensions: ['.vmoptions'],
    filenames: ['jvm.options'],
    vscodeLanguageIds: ['jvmoptions'],
  },
  {
    name: 'hosts',
    since: '0.1.0',
    parsers: ['sh'],
    filenames: ['hosts'],
    vscodeLanguageIds: ['hosts'],
  },
  {
    name: 'dotenv',
    since: '0.1.0',
    parsers: ['sh'],
    extensions: ['.env'],
    filenames: ['.env.*'],
    vscodeLanguageIds: ['dotenv'],
  },
  {
    name: 'nvmrc',
    since: '0.14.0',
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
        since: '0.1.0',
        parsers: [parser],
        linguistLanguageId,
        vscodeLanguageIds: [aceMode === 'sh' ? 'shellscript' : aceMode],
        ...rest,
      })
      return acc
    },
    [],
  )

fs.writeFileSync(
  'packages/autocorrect/src/languages.ts',
  `import type { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
    getSupportedLanguages('autocorrect', ['all']),
    null,
    2,
  )} as SupportLanguage[]`,
)

fs.writeFileSync(
  'packages/sh/src/languages.ts',
  `import type { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
    [
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
    ],
    null,
    2,
  )} as SupportLanguage[]
`,
)

fs.writeFileSync(
  'packages/sql/src/languages.ts',
  `import type { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
    [...getSupportedLanguages('sql', ['sql', 'pgsql'])],
    null,
    2,
  )} as SupportLanguage[]
`,
)

fs.writeFileSync(
  'packages/toml/src/languages.ts',
  `import type { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
    [...getSupportedLanguages('toml')],
    null,
    2,
  )} as SupportLanguage[]
`,
)
