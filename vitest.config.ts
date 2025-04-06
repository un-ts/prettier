import path from 'node:path'

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
  test: {
    globals: true,
    coverage: {
      enabled: true,
      include: ['packages/*/src/**/*.ts'],
      provider: 'istanbul',
      reporter: ['lcov', 'json', 'text'],
    },
    env: {
      SYNCKIT_TS_RUNNER: process.env.SYNCKIT_TS_RUNNER || 'tsx',
    },
  },
})
