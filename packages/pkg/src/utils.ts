import { ObjectProperty, StringLiteral } from './types'

export const sortObject = (a: ObjectProperty, b: ObjectProperty) =>
  a.key.value > b.key.value
    ? 1
    : a.key.value < b.key.value
    ? -1
    : /* istanbul ignore next */ 0

export const sortStringArray = (a: StringLiteral, b: StringLiteral) =>
  a.value > b.value ? 1 : a.value < b.value ? -1 : /* istanbul ignore next */ 0
