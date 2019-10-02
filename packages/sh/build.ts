/* eslint-disable node/no-extraneous-import */
import fs from 'fs'
import { get } from 'https'
import { safeLoad } from 'js-yaml'
import { pick } from 'lodash'
import prettier, { SupportLanguage } from 'prettier'

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
    vscodeLanguageIds: ['dotenv'],
  },
]

const getShLanguages = (languages: Record<string, LinguistLanguage>) =>
  Object.entries(languages)
    .reduce<SupportLanguage[]>((acc, [name, language]) => {
      const { ace_mode: aceMode } = language
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
        ...pick(language, 'group', 'aliases', 'extensions', 'filenames'),
        tmScope: language.tm_scope,
        aceMode,
        codemirrorMode: language.codemirror_mode,
        codemirrorMimeType: language.codemirror_mime_type,
        linguistLanguageId: language.language_id,
        vscodeLanguageIds: [aceMode === 'sh' ? 'shellscript' : aceMode],
      })
      return acc
    }, [])
    .concat(EXTRA_LANGUAGES)

get(linguistLanguages, res => {
  let rawText = ''
  res.on('data', (data: Buffer) => {
    rawText += data.toString()
  })
  res.on('end', () => {
    const languages = getShLanguages(safeLoad(rawText))
    fs.writeFileSync(
      'src/languages.ts',
      prettier.format(
        `import { SupportLanguage } from 'prettier'

    export const languages = ${JSON.stringify(languages)} as SupportLanguage[]`,
        {
          parser: 'typescript',
        },
      ),
    )
  })
})
