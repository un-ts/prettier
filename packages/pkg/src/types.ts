/* eslint-disable @typescript-eslint/no-type-alias, sonarjs/no-duplicate-string */
type _ArrayExpression = import('@babel/types').ArrayExpression
type _ObjectExpression = import('@babel/types').ObjectExpression
type _ObjectProperty = import('@babel/types').ObjectProperty

export type StringLiteral = import('@babel/types').StringLiteral

export type ObjectProperty = _ObjectProperty & {
  key: {
    value: string
  }
  value: ArrayExpression | ObjectExpression
}

export interface ObjectExpression extends _ObjectExpression {
  properties: ObjectProperty[]
}

export interface ArrayExpression extends _ArrayExpression {
  elements: Array<ArrayExpression | ObjectExpression | StringLiteral>
}

export type StringMapProperty = ObjectProperty & {
  key: {
    value: string
  }
  value: StringMapExpression
}

export interface StringMapExpression extends ObjectExpression {
  properties: StringMapProperty[]
}

export type StringArrayProperty = ObjectProperty & {
  key: {
    value: string
  }
  value: StringArrayExpression
}

export interface StringArrayExpression extends ArrayExpression {
  elements: StringLiteral[]
}
