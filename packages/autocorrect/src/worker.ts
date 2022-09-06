import { formatFor, loadConfig } from '@huacnlee/autocorrect-node'
import { cosmiconfig } from 'cosmiconfig'
import { runAsWorker } from 'synckit'

import type { FormatResult } from './types.js'

const explorer = cosmiconfig('autocorrect')

runAsWorker(async (source: string, filename: string) => {
  const result = await explorer.search(filename)

  if (result) {
    loadConfig(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      result.config, // type-coverage:ignore-line -- cosmiconfig's typings issue
    )
  }

  return formatFor(source, filename) as Promise<FormatResult>
})
