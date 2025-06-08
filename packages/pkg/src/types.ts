import type {
  ArrayExpression as _ArrayExpression,
  ObjectExpression as _ObjectExpression,
  ObjectProperty as _ObjectProperty,
  StringLiteral,
} from '@babel/types'

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

export type { StringLiteral } from '@babel/types'

export interface FormatOptions {
  packageSortOrder?: string[]
  packageIgnoreSort?: string[]
  packageSortOrderPreset?: 'npm-plus' | 'npm'
}
