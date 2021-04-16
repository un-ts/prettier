import { ObjectProperty, StringLiteral } from './types'

export function alphabetSort(a: number, b: number): number
export function alphabetSort(a: string, b: string): number
export function alphabetSort(a: number | string, b: number | string) {
  return a > b ? 1 : a < b ? -1 : 0
}

export const sortObject = (a: ObjectProperty, b: ObjectProperty) =>
  alphabetSort(a.key.value, b.key.value)

export const sortStringArray = (a: StringLiteral, b: StringLiteral) =>
  alphabetSort(a.value, b.value)
