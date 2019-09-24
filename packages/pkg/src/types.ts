import { ObjectExpression, ObjectProperty, StringLiteral } from '@babel/types'

export interface StringMapperProperty extends ObjectProperty {
  key: {
    value: string
  }
  value: StringMapperPropertyValue
}

export interface StringMapperPropertyValue extends ObjectExpression {
  properties: StringMapperProperty[]
}

export interface StringArrayProperty extends ObjectProperty {
  key: {
    value: string
  }
  elements: StringLiteral[]
}
