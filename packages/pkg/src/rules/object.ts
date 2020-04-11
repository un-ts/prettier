import { ObjectExpression, ObjectProperty } from '../types'
import { sortObject } from '../utils'

const process = (props: ObjectProperty[], key: string) => {
  const keyIndex = props.findIndex(prop => prop.key.value === key)

  if (keyIndex >= 0) {
    const object = props[keyIndex]
    const value = object.value as ObjectExpression
    value.properties.sort(sortObject)
  }

  return props
}

export { process as object }
