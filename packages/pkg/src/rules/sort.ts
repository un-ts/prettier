import { StringMapperProperty } from '../types'

// reference: https://docs.npmjs.com/files/package.json#people-fields-author-contributors
const primary = [
  // meta
  'name',
  'version',
  'description',
  'repository',
  'homepage',
  'bugs',
  'author',
  'contributors',
  'license',
  'private',
  'workspaces',

  // constraints
  'engines',
  'cpu',
  'os',

  // entry
  'man',
  'bin',
  'main',
  'module',
  'esnext',
  'es2015',
  'esm',
  'fesm5',
  'fesm2015',
  'browser',
  'umd',
  'jsdelivr',
  'unpkg',
  'types',
  'typings',

  // content and util
  'directories',
  'files',
  'keywords',
  'scripts',
  'config',

  // dependencies
  'bundledDependencies',
  'peerDependencies',
  'dependencies',
  'optionalDependencies',
  'devDependencies',
  'publishConfig',
  'resolutions',
  'sideEffects',
]

export const sort = (props: StringMapperProperty[]) => {
  const others: StringMapperProperty[] = []
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
