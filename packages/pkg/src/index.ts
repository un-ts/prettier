import { ObjectProperty } from '@babel/types'
import { Plugin } from 'prettier'
import _ from 'prettier/parser-babylon'

import { engines } from './rules/engines'
import { files } from './rules/files'
import { scripts } from './rules/scripts'
import { sort } from './rules/sort'

const { 'json-stringify': parser } = _.parsers
const { parse } = parser

const format = (properties: ObjectProperty[]) => {
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
      ...parser,
      parse(...args) {
        const [, , options] = args
        const { filepath } = options
        const ast = parse(...args)

        if (filepath.endsWith('package.json')) {
          const { properties } = ast
          ast.properties = format(properties)
        }

        return ast
      },
    },
  },
} as Plugin
