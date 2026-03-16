import type { ObjectProperty, StringLiteral } from './types.js'

export function alphabetSort(a: number, b: number): number
export function alphabetSort(a: string, b: string): number
export function alphabetSort(a: number | string, b: number | string) {
  // eslint-disable-next-line sonarjs/no-nested-conditional, unicorn-x/no-nested-ternary
  return a > b ? 1 : a < b ? -1 : 0
}

export const sortObject = (a: ObjectProperty, b: ObjectProperty) =>
  alphabetSort(a.key.value, b.key.value)

export const sortStringArray = (a: StringLiteral, b: StringLiteral) =>
  alphabetSort(a.value, b.value)

const getScriptSortMeta = (value: string, scriptNames: string[]) => {
  if (value.length > 3 && value.startsWith('pre')) {
    const base = value.slice(3)

    if (scriptNames.includes(base)) {
      return { base, order: -1 }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  if (value.length > 4 && value.startsWith('post')) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const base = value.slice(4)

    if (scriptNames.includes(base)) {
      return { base, order: 1 }
    }
  }

  return { base: value, order: 0 }
}

export const sortScriptNames = (scriptNames: string[]) => {
  const uniqueScriptNames = [...new Set(scriptNames)]

  return uniqueScriptNames.toSorted((a, b) => {
    const left = getScriptSortMeta(a, uniqueScriptNames)
    const right = getScriptSortMeta(b, uniqueScriptNames)

    if (left.base !== right.base) {
      return alphabetSort(left.base, right.base)
    }

    if (left.order !== right.order) {
      return alphabetSort(left.order, right.order)
    }

    return alphabetSort(a, b)
  })
}

export const sortScripts = (props: ObjectProperty[]) => {
  const scriptOrder = Object.fromEntries(
    sortScriptNames(props.map(prop => prop.key.value)).map((name, index) => [
      name,
      index,
    ]),
  )

  props.sort((a, b) =>
    alphabetSort(scriptOrder[a.key.value], scriptOrder[b.key.value]),
  )
}
