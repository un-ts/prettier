import {
  ArrayExpression as _ArrayExpression,
  ObjectExpression as _ObjectExpression,
  ObjectProperty as _ObjectProperty,
  StringLiteral,
} from '@babel/types'

export interface StringMapperProperty extends _ObjectProperty {
  key: {
    value: string
  }
  value: StringMapperExpression
}

export interface StringMapperExpression extends _ObjectExpression {
  properties: StringMapperProperty[]
}

export interface StringArrayProperty extends _ObjectProperty {
  key: {
    value: string
  }
  value: StringArrayExpression
}

export interface StringArrayExpression extends _ArrayExpression {
  elements: StringLiteral[]
}

export interface ObjectProperty extends _ObjectProperty {
  key: {
    value: string
  }
  value:
    | ArrayExpression
    | ObjectExpression
    | StringArrayExpression
    | StringMapperExpression
}

export interface ObjectExpression extends _ObjectExpression {
  properties: ObjectProperty[]
}

export interface ArrayExpression extends _ArrayExpression {
  elements: Array<
    | ArrayExpression
    | ObjectExpression
    | StringArrayExpression
    | StringMapperExpression
  >
}
