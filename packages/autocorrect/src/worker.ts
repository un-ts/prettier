import { formatFor } from '@huacnlee/autocorrect'
import { runAsWorker } from 'synckit'

import type { FormatResult } from './types.js'

runAsWorker(
  (source: string, filename: string) =>
    formatFor(source, filename) as Promise<FormatResult>,
)
