import { ObjectExpression, ObjectProperty } from '@babel/types'

const process = (props: ObjectProperty[]) => {
  const enginesIndex = props.findIndex(prop => prop.key.value === 'engines')

  if (enginesIndex >= 0) {
    const [engines] = props.splice(enginesIndex, 1)
    const value = engines.value as ObjectExpression
    const properties = value.properties as ObjectProperty[]

    properties.sort((a, b) =>
      a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0,
    )

    value.properties = properties

    props.splice(enginesIndex, 0, engines)
  }

  return props
}

export { process as engines }
