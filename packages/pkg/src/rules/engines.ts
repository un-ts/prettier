import { StringMapperProperty } from '../types'

const process = (props: StringMapperProperty[]) => {
  const enginesIndex = props.findIndex(prop => prop.key.value === 'engines')

  if (enginesIndex >= 0) {
    const [engines] = props.splice(enginesIndex, 1)
    const { value } = engines
    const { properties } = value

    properties.sort((a, b) =>
      a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0,
    )

    value.properties = properties

    props.splice(enginesIndex, 0, engines)
  }

  return props
}

export { process as engines }
