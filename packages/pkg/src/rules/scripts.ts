import { ObjectProperty, StringMapperExpression } from '../types'

const process = (props: ObjectProperty[]) => {
  const scriptsIndex = props.findIndex(prop => prop.key.value === 'scripts')

  if (scriptsIndex >= 0) {
    const scripts = props[scriptsIndex]
    const value = scripts.value as StringMapperExpression
    value.properties.sort((a, b) =>
      a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0,
    )
  }

  return props
}

export { process as scripts }
