import path from 'node:path'

import autoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^prettier-plugin-(.*)$/,
        replacement: path.resolve('packages/$1/src/index.ts'),
      },
    ],
  },
  plugins: [
    // TODO: report the TypeScript issue
    (
      autoImport as unknown as typeof import('unplugin-auto-import/vite')['default']
    )({
      imports: 'vitest',
    }),
  ],
  test: {
    coverage: {
      reporter: ['lcov', 'json', 'text'],
    },
    env: {
      SYNCKIT_TS_RUNNER: process.env.SYNCKIT_TS_RUNNER || 'tsx',
    },
  },
})
