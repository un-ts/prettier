import { ObjectProperty, StringMapperExpression } from '../types'

const process = (props: ObjectProperty[]) => {
  const enginesIndex = props.findIndex(prop => prop.key.value === 'engines')

  if (enginesIndex >= 0) {
    const engines = props[enginesIndex]
    const value = engines.value as StringMapperExpression
    value.properties.sort((a, b) =>
      a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0,
    )
  }

  return props
}

export { process as engines }
