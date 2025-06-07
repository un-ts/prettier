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
  FormatOptions,
  ObjectExpression,
  ObjectProperty,
} from './types.js'

const PKG_REG = /[/\\]?package\.json$/

const {
  json: { parse },
} = babelParser.parsers

const DEFAULT_SORTS = ['engines', 'devEngines', 'scripts', ...dependencyNames]

const format = (properties: ObjectProperty[], options: FormatOptions) => {
  const { packageIgnoreSort } = options
  let props = (
    packageIgnoreSort?.length
      ? DEFAULT_SORTS.filter(item => !packageIgnoreSort.includes(item))
      : DEFAULT_SORTS
  ).reduce((acc, item) => object(acc, item), sort(properties, options))
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
    packageSortOrderPreset: {
      since: '0.22.0',
      category: 'Package',
      type: 'choice',
      choices: [
        {
          value: 'npm',
          description:
            'Sorted according to https://docs.npmjs.com/cli/v11/configuring-npm/package-json.',
        },
        {
          value: 'npm-plus',
          description:
            'Sorted according to https://github.com/keithamus/sort-package-json/blob/aa6774ad937feb83178c8bc981f08305e1d22b5c/defaultRules.md.',
        },
        {
          value: 'unts',
          description:
            'Sorted according to a style commonly seen in the packages of @JounQin, @1stG and @unts.',
        },
      ],
      default: 'npm',
      description: 'A preset for the package.json sort order.',
    },
  },
  defaultOptions: {
    packageSortOrder: [],
    packageIgnoreSort: [],
    packageSortOrderPreset: 'npm',
  },
} as Plugin
