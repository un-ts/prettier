/**
 * Copyright © 2019 Andrew Powell This Source Code Form is subject to the terms
 * of the Mozilla Public License, v. 2.0. If a copy of the MPL was not
 * distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/. The above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of this Source
 * Code Form.
 */

import type { FormatOptions, ObjectProperty } from '../types.js'
import { alphabetSort, sortObject } from '../utils.js'

export const dependencyNames = [
  'bundledDependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'dependencies',
  'dependenciesMeta',
  'optionalDependencies',
  'devDependencies',
  'overrides',
  'resolutions',
]

/**
 * Reference: npm - https://docs.npmjs.com/files/package.json yarn -
 * https://yarnpkg.com/configuration/manifest vscode -
 * https://code.visualstudio.com/api/references/extension-manifest
 */
const primary: readonly string[] = [
  // schema definition
  '$schema',

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
  'author',
  'publisher',
  'maintainers',
  'contributors',
  'donate',
  'funding',
  'sponsor',
  'license',
  'preview',
  'private',
  'workspaces',

  // constraints
  'languageName',
  'packageManager',
  'engines',
  'cpu',
  'os',
  'libc',
  'devEngines',

  // entries
  'man',
  'bin',
  'main',
  'types',
  'typings',
  'typesVersions',
  'module',
  'imports',
  'exports',
  'esnext',
  'es2020',
  'esm2020',
  'fesm2020',
  'es2015',
  'esm2015',
  'fesm2015',
  'es5',
  'esm5',
  'fesm5',
  'browser',
  'umd',
  'jsdelivr',
  'unpkg',

  // contents and utils
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
  'badges',
  'galleryBanner',
  'activationEvents',
  'contributes',
  'markdown',
  'qna',
  'extensionPack',
  'extensionDependencies',
  'extensionKind',
]

const uniqueArray = <T>(arr: readonly T[]) => {
  return [...new Set(arr)]
}

export const sort = (props: ObjectProperty[], options: FormatOptions) => {
  let { packageSortOrder } = options

  packageSortOrder = uniqueArray([...(packageSortOrder ?? []), ...primary])

  const others: ObjectProperty[] = []
  const known = props.filter(prop => {
    if (packageSortOrder.includes(prop.key.value)) {
      return true
    }
    others.push(prop)
    return false
  })

  known.sort((a, b) =>
    alphabetSort(
      packageSortOrder.indexOf(a.key.value),
      packageSortOrder.indexOf(b.key.value),
    ),
  )
  others.sort(sortObject)

  return [...known, ...others]
}
