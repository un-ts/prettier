import { ObjectProperty } from '@babel/types'

const primary = [
  // meta
  'name',
  'version',
  'flat',
  'private',
  'publishConfig',
  'description',
  'license',
  'repository',
  'author',
  'homepage',
  'bugs',

  // entry
  'main',
  'bin',

  // constraints
  'engines',
  'cpu',
  'os',

  // content and util
  'scripts',
  'files',
  'keywords',

  // dependencies
  'bundledDependencies',
  'optionalDependencies',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'resolutions',
]

export const sort = (props: ObjectProperty[]) => {
  const others: ObjectProperty[] = []
  const known = props.filter(prop => {
    if (primary.includes(prop.key.value)) {
      return true
    }
    others.push(prop)
    return false
  })

  known.sort((a, b) => {
    const aIndex = primary.indexOf(a.key.value)
    const bIndex = primary.indexOf(b.key.value)
    return aIndex > bIndex ? 1 : aIndex < bIndex ? -1 : 0
  })
  others.sort((a, b) =>
    a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0,
  )

  return known.concat(others)
}
