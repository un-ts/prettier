import { Plugin } from 'prettier'
import { parsers } from 'prettier/parser-babylon'

import { engines } from './rules/engines'
import { files } from './rules/files'
import { scripts } from './rules/scripts'
import { sort } from './rules/sort'
import { StringMapperProperty, StringMapperPropertyValue } from './types'

const PKG_REG = /[\\/]?package\.json$/

const {
  json: { parse },
} = parsers

const format = (properties: StringMapperProperty[]) => {
  let props = sort(properties)
  props = engines(props)
  props = files(props)
  props = scripts(props)
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
        const ast: StringMapperPropertyValue = parse(...args)

        if (PKG_REG.test(filepath)) {
          ast.properties = format(ast.properties)
        }

        return ast
      },
    },
  },
} as Plugin
