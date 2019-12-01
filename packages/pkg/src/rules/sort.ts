import { ObjectProperty } from '../types'
import { sortObject } from '../utils'

/**
 * reference:
 * npm - https://docs.npmjs.com/files/package.json
 * yarn - https://yarnpkg.com/docs/package-json
 * vscode - https://code.visualstudio.com/api/references/extension-manifest
 */
const primary = [
  // meta
  'name',
  'version',
  'type',
  'flat',
  'displayName',
  'description',
  'categories',
  'repository',
  'homepage',
  'bugs',
  'funding',
  'author',
  'publisher',
  'contributors',
  'license',
  'preview',
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

  // vscode spec
  'icon',
  'galleryBanner',
  'activationEvents',
  'contributes',
  'markdown',
  'qna',
  'extensionPack',
  'extensionDependencies',
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
  others.sort(sortObject)

  return known.concat(others)
}
