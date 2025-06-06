/**
 * Copyright © 2019 Andrew Powell This Source Code Form is subject to the terms
 * of the Mozilla Public License, v. 2.0. If a copy of the MPL was not
 * distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/. The above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of this Source
 * Code Form.
 */

import type { Plugin } from 'prettier'
import babelParser from 'prettier/plugins/babel.js'

import { files } from './rules/files.js'
import { object } from './rules/object.js'
import { dependencyNames, sort } from './rules/sort.js'
import type {
  ObjectExpression,
  ObjectProperty,
  FormatOptions,
} from './types.js'

const PKG_REG = /[/\\]?package\.json$/

const {
  json: { parse },
} = babelParser.parsers

const format = (properties: ObjectProperty[], options: FormatOptions) => {
  let props = ['engines', 'devEngines', 'scripts', ...dependencyNames].reduce(
    (acc, item) => object(acc, item, options),
    sort(properties, options),
  )
  props = files(props)
  return props
}

export default {
  name: 'prettier-plugin-pkg',
  parsers: {
    'json-stringify': {
      ...babelParser.parsers['json-stringify'],
      parse(text, options) {
        const { filepath } = options
        const ast = parse(text, options) as { node: ObjectExpression }
        if (PKG_REG.test(filepath)) {
          ast.node.properties = format(
            ast.node.properties,
            options as FormatOptions,
          )
        }
        return ast
      },
    },
  },
  options: {
    packageSortOrder: {
      since: '0.21.0',
      category: 'Package',
      type: 'string',
      array: true,
      default: [{ value: [] }],
      description:
        'An array of property names to sort the package.json properties by.',
    },
    packageIgnoreSort: {
      since: '0.21.0',
      category: 'Package',
      type: 'string',
      array: true,
      default: [{ value: [] }],
      description:
        'An array of property names to ignore when sorting the package.json properties.',
    },
  },
} as Plugin
