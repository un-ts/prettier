import { ObjectProperty } from '../types'
import { sortObject } from '../utils'

export const dependencyNames = [
  'bundledDependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'dependencies',
  'optionalDependencies',
  'devDependencies',
  'resolutions',
]

/**
 * reference:
 * npm - https://docs.npmjs.com/files/package.json
 * yarn - https://yarnpkg.com/configuration/manifest
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
  'languageName',
  'engines',
  'cpu',
  'os',

  // entry
  'man',
  'bin',
  'main',
  'module',
  'exports',
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
  'typesVersions',

  // content and util
  'directories',
  'files',
  'keywords',
  'scripts',
  'config',

  // dependencies
  ...dependencyNames,
  'publishConfig',
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
    return aIndex > bIndex
      ? 1
      : aIndex < bIndex
      ? -1
      : /* istanbul ignore next */ 0
  })
  others.sort(sortObject)

  return known.concat(others)
}
