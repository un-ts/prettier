import base from '@1stg/eslint-config'
import stylistic from '@stylistic/eslint-plugin'
import tsdoc from 'eslint-plugin-tsdoc'

export default [
  ...base,
  {
    ignores: [
      '**/src/languages.ts',
      // Intentionally invalid TOML used to test error reporting.
      'packages/toml/test/fixtures/invalid.toml',
    ],
  },
  {
    plugins: {
      '@stylistic': stylistic,
      tsdoc,
    },
    rules: {
      '@stylistic/multiline-comment-style': ['error', 'starred-block'],
      'tsdoc/syntax': 'error',
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@eslint-react/jsx-uses-react': 'off',
    },
  },
]
