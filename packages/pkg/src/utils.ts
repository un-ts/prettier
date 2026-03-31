import type { ObjectProperty, StringLiteral } from './types.js'

/**
 * The list of default lifecycle scripts defined by `npm`.
 * @see https://docs.npmjs.com/cli/v11/using-npm/scripts
 */
const DEFAULT_LIFECYCLE_SCRIPTS = new Set([
  'dependencies',
  'install',
  'pack',
  'prepare',
  'publish',
  'restart',
  'shrinkwrap',
  'start',
  'stop',
  'test',
  'version',
])

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

const getScriptSortProps = (
  scriptName: string,
  allScriptNames: Set<string>,
) => {
  if (DEFAULT_LIFECYCLE_SCRIPTS.has(scriptName)) {
    return {
      base: scriptName,
      order: 0,
    }
  }

  if (scriptName.length > 3 && scriptName.startsWith('pre')) {
    const base = scriptName.slice(3)

    if (allScriptNames.has(base) || DEFAULT_LIFECYCLE_SCRIPTS.has(base)) {
      return {
        base,
        order: -1,
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  if (scriptName.length > 4 && scriptName.startsWith('post')) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const base = scriptName.slice(4)

    if (allScriptNames.has(base) || DEFAULT_LIFECYCLE_SCRIPTS.has(base)) {
      return {
        base,
        order: 1,
      }
    }
  }

  return {
    base: scriptName,
    order: 0,
  }
}

export const sortScriptNames = (scriptNames: string[]) => {
  const scriptNameSet = new Set(scriptNames)
  scriptNames = [...scriptNameSet]

  return scriptNames.sort((a, b) => {
    const left = getScriptSortProps(a, scriptNameSet)
    const right = getScriptSortProps(b, scriptNameSet)

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
