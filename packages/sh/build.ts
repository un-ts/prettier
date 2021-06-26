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

const EXTRA_LANGUAGES: SupportLanguage[] = [
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
    filenames: ['.env.*'],
    vscodeLanguageIds: ['dotenv'],
  },
]

const getShLanguages = (languages: Record<string, LinguistLanguage>) => [
  ...Object.entries(languages).reduce<SupportLanguage[]>(
    (acc, [name, language]) => {
      const {
        ace_mode: aceMode,
        tm_scope: tmScope,
        codemirror_mode: codemirrorMode,
        codemirror_mime_type: codemirrorMimeType,
        language_id: linguistLanguageId,
      } = language
      if (
        !['dockerfile', 'gitignore', 'ini', 'properties', 'sh'].includes(
          aceMode,
        )
      ) {
        return acc
      }
      acc.push({
        name,
        parsers: ['sh'],
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
  ),
  ...EXTRA_LANGUAGES,
]

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
      const languages = getShLanguages(
        load(rawText) as Record<string, LinguistLanguage>,
      )

      fs.writeFileSync(
        'src/languages.ts',
        `import { SupportLanguage } from 'prettier'

export const languages = ${JSON.stringify(
          languages,
          null,
          2,
        )} as SupportLanguage[]`,
      )
    })
  },
)
