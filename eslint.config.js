import base from '@1stg/eslint-config'
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  ...base,
  {
    ignores: ['**/src/languages.ts'],
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/multiline-comment-style': ['error', 'starred-block'],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@eslint-react/jsx-uses-react': 'off',
    },
  },
]
