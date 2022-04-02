import fs from 'fs'
import { get } from 'https'

import createHttpsProxyAgent from 'https-proxy-agent'
import { load } from 'js-yaml'
import { pick } from 'lodash'
import { SupportLanguage } from 'prettier'

const proxyUrl =
  process.env.https_proxy || process.env.http_proxy || process.env.all_proxy

const linguistLanguages =
  'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'

export interface LinguistLanguage {
  type: string
  group: string
  color: string
  aliases: string[]
  extensions: string[]
  filenames: string[]
  tm_scope: string
  ace_mode: string
  codemirror_mode: string
  codemirror_mime_type: string
  language_id: number
}

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

const getSupportLanguages = (
  languages: Record<string, LinguistLanguage>,
  parser: 'sh' | 'sql',
  aceModes: string[],
) =>
  Object.entries(languages).reduce<SupportLanguage[]>(
    (acc, [name, language]) => {
      const {
        ace_mode: aceMode,
        tm_scope: tmScope,
        codemirror_mode: codemirrorMode,
        codemirror_mime_type: codemirrorMimeType,
        language_id: linguistLanguageId,
      } = language
      if (!aceModes.includes(aceMode)) {
        return acc
      }
      acc.push({
        name,
        since: '0.1.0',
        parsers: [parser],
        ...pick(
          language,
          'group',
          'aliases',
          'extensions',
          'filenames',
          'interpreters',
        ),
        tmScope,
        aceMode,
        codemirrorMode,
        codemirrorMimeType,
        linguistLanguageId,
        vscodeLanguageIds: [aceMode === 'sh' ? 'shellscript' : aceMode],
      })
      return acc
    },
    [],
  )

get(
  linguistLanguages,
  {
    agent: proxyUrl ? createHttpsProxyAgent(proxyUrl) : undefined,
  },
  res => {
    let rawText = ''
    res.on('data', (data: Buffer) => {
      rawText += data.toString()
    })
    res.on('end', () => {
      const allLanguages = load(rawText) as Record<string, LinguistLanguage>

      fs.writeFileSync(
        'packages/sh/src/languages.ts',
        `import { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
          [
            ...getSupportLanguages(allLanguages, 'sh', [
              'dockerfile',
              'gitignore',
              'properties',
              'sh',
            ]),
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
          [...getSupportLanguages(allLanguages, 'sql', ['sql', 'pgsql'])],
          null,
          2,
        )} as SupportLanguage[]`,
      )
    })
  },
)
