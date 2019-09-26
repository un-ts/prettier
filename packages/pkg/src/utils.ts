import { StringLiteral } from '@babel/types'

import { ObjectProperty } from './types'

export const sortObject = (a: ObjectProperty, b: ObjectProperty) =>
  a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0

export const sortStringArray = (a: StringLiteral, b: StringLiteral) =>
  a.value > b.value ? 1 : a.value < b.value ? -1 : 0
