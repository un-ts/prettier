const { allowModules } = require('@1stg/eslint-config/_util')

module.exports = {
  root: true,
  extends: '@1stg/eslint-config/recommended',
  settings: {
    node: {
      allowModules: allowModules.concat('@babel/types'),
    },
  },
  rules: {
    '@typescript-eslint/unbound-method': 0,
    '@typescript-eslint/no-unnecessary-condition': 0,
  },
}
