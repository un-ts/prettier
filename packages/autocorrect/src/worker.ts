import { runAsWorker } from 'synckit'

import type { FormatResult } from './types.js'

let autocorrect: typeof import('@huacnlee/autocorrect/autocorrect.js')
let loadedConfig: unknown

runAsWorker(async (source: string, filename: string) => {
  autocorrect = await import('@huacnlee/autocorrect/autocorrect.js')

  if (!loadedConfig) {
    loadedConfig = autocorrect.loadConfig(
      JSON.stringify({
        spellcheck: {
          mode: 1,
          words: [],
        },
      }),
    )
  }

  return autocorrect.formatFor(source, filename) as Promise<FormatResult>
})
