import base from '@1stg/eslint-config'
import stylisticJs from '@stylistic/eslint-plugin-js'
import tsdoc from 'eslint-plugin-tsdoc'

export default [
  ...base,
  {
    ignores: ['**/src/languages.ts'],
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs,
      tsdoc,
    },
    rules: {
      '@stylistic/js/multiline-comment-style': ['error', 'starred-block'],
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
