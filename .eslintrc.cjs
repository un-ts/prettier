require('ts-node').register()

module.exports = {
  root: true,
  extends: '@1stg',
  rules: {
    'react/react-in-jsx-scope': 0,
  },
}
