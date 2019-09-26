import { Plugin } from 'prettier'
import { parsers } from 'prettier/parser-babylon'

import { files } from './rules/files'
import { object } from './rules/object'
import { sort } from './rules/sort'
import { ObjectExpression, ObjectProperty } from './types'

const PKG_REG = /[\\/]?package\.json$/

const {
  json: { parse },
} = parsers

const format = (properties: ObjectProperty[]) => {
  let props = sort(properties)
  props = object(props, 'engines')
  props = object(props, 'scripts')
  props = files(props)
  return props
}

export default {
  name: 'prettier-plugin-pkg',
  parsers: {
    'json-stringify': {
      ...parsers['json-stringify'],
      parse(...args) {
        const [, , options] = args
        const { filepath } = options
        const ast: ObjectExpression = parse(...args)

        if (PKG_REG.test(filepath)) {
          ast.properties = format(ast.properties)
        }

        return ast
      },
    },
  },
} as Plugin
