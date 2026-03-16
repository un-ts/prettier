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

const getScriptSortProps = (
  currentScriptName: string,
  allScriptNames: string[],
) => {
  const ranks: number[] = []
  let base = currentScriptName

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    if (base.length > 3 && base.startsWith('pre')) {
      const currentBase = base.slice(3)

      if (allScriptNames.includes(currentBase)) {
        ranks.push(-1)
        base = currentBase
        continue
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (base.length > 4 && base.startsWith('post')) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const currentBase = base.slice(4)

      if (allScriptNames.includes(currentBase)) {
        ranks.push(1)
        base = currentBase
        continue
      }
    }

    break
  }

  return {
    base,
    ranks: ranks.toReversed(),
  }
}

export const sortScriptNames = (scriptNames: string[]) => {
  scriptNames = [...new Set(scriptNames)]

  return scriptNames.toSorted((a, b) => {
    const left = getScriptSortProps(a, scriptNames)
    const right = getScriptSortProps(b, scriptNames)

    /*
     * Attempt to compare resolved base names first. Example: `prebuild`,
     * `build`, and `postbuild` all compare on the base name `build`.
     */
    if (left.base !== right.base) {
      return alphabetSort(left.base, right.base)
    }

    /*
     * For scripts with the same base name, compare rank arrays. Instead of
     * a single comparator value, we compare arrays of ranks in order to
     * properly handle nested prefixes.
     */
    const length = Math.max(left.ranks.length, right.ranks.length)
    let priority = 0

    for (let i = 0; i < length; i++) {
      const leftOrder = left.ranks[i] ?? 0
      const rightOrder = right.ranks[i] ?? 0

      if (leftOrder !== rightOrder) {
        priority = alphabetSort(leftOrder, rightOrder)
        break
      }
    }

    if (priority !== 0) {
      return priority
    }

    /*
     * If both the base name and ranks are equal, fall back to alphabetical
     * comparison of the full script names.
     */
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
