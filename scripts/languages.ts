import fs from 'node:fs'

import LinguistLanguages from 'linguist-languages'
import { SupportLanguage } from 'prettier'

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
]

const getSupportLanguages = (parser: 'sh' | 'sql', aceModes: string[]) =>
  Object.values(LinguistLanguages).reduce<SupportLanguage[]>(
    (
      acc,
      {
        aceMode,
        name,
        type: _type,
        color: _color,
        languageId: linguistLanguageId,
        ...rest
      },
    ) => {
      if (!aceModes.includes(aceMode)) {
        return acc
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
  'packages/sh/src/languages.ts',
  `import { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
    [
      ...getSupportLanguages('sh', ['dockerfile', 'gitignore', 'sh']),
      ...EXTRA_SH_LANGUAGES,
    ],
    null,
    2,
  )} as SupportLanguage[]`,
)

fs.writeFileSync(
  'packages/sql/src/languages.ts',
  `import { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
    [...getSupportLanguages('sql', ['sql', 'pgsql'])],
    null,
    2,
  )} as SupportLanguage[]`,
)
