/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { parsers } = require('prettier/parser-babylon')

const { engines } = require('../rules/engines')
const { files } = require('../rules/files')
const { scripts } = require('../rules/scripts')
const { sort } = require('../rules/sort')

const { 'json-stringify': parser } = parsers
const { parse } = parser
const rePkg = /package\.json$/

const format = properties => {
  let props = sort(properties)
  props = engines(props)
  props = files(props)
  props = scripts(props)

  return props
}

module.exports = {
  name: 'prettier-plugin-pkg',
  parsers: {
    'json-stringify': {
      ...parser,
      parse(...args) {
        const [, , options] = args
        const { filepath } = options
        const ast = parse(...args)

        if (rePkg.test(filepath)) {
          const { properties } = ast
          ast.properties = format(properties)
        }

        return ast
      },
    },
  },
}
