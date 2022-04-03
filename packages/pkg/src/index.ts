import { Plugin } from 'prettier'
import babelParser from 'prettier/parser-babel'

import { files } from './rules/files.js'
import { object } from './rules/object.js'
import { dependencyNames, sort } from './rules/sort.js'
import { ObjectExpression, ObjectProperty } from './types.js'

const PKG_REG = /[/\\]?package\.json$/

const {
  json: { parse },
} = babelParser.parsers

const format = (properties: ObjectProperty[]) => {
  let props = ['engines', 'scripts', ...dependencyNames].reduce(
    (acc, item) => object(acc, item),
    sort(properties),
  )
  props = files(props)
  return props
}

export default {
  name: 'prettier-plugin-pkg',
  parsers: {
    'json-stringify': {
      ...babelParser.parsers['json-stringify'],
      parse(text, parsers, options) {
        const { filepath } = options
        const ast = parse(text, parsers, options) as ObjectExpression

        if (PKG_REG.test(filepath)) {
          ast.properties = format(ast.properties)
        }

        return ast
      },
    },
  },
} as Plugin
