import { ObjectExpression, ObjectProperty } from '../types'
import { sortObject } from '../utils'

const process = (props: ObjectProperty[], key: string) => {
  const item = props.find(prop => prop.key.value === key)

  if (item) {
    ;(item.value as ObjectExpression).properties.sort(sortObject)
  }

  return props
}

export { process as object }
