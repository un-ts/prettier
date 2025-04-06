import base from '@1stg/eslint-config'

export default [
  ...base,
  {
    ignores: ['**/src/languages.ts'],
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@eslint-react/jsx-uses-react': 'off',
    },
  },
]
