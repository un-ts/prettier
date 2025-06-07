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

export const dependencyNames: readonly string[] = [
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

/** Reference: npm - https://docs.npmjs.com/cli/v11/configuring-npm/package-json */
const NPM_SORTS: readonly string[] = [
  '$schema',
  'name',
  'version',
  'description',
  'keywords',
  'homepage',
  'bugs',
  'license',
  'author',
  'contributors',
  'funding',
  'files',
  'exports',
  'main',
  'browser',
  'bin',
  'man',
  'directories',
  'repository',
  'scripts',
  'config',
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'peerDependenciesMeta',
  'bundleDependencies',
  'optionalDependencies',
  'overrides',
  'engines',
  'os',
  'cpu',
  'libc',
  'devEngines',
  'private',
  'publishConfig',
  'workspaces',
]

/**
 * Reference: npm -
 * https://github.com/keithamus/sort-package-json/blob/aa6774ad937feb83178c8bc981f08305e1d22b5c/defaultRules.md
 */
const NPM_PLUS_SORTS: readonly string[] = [
  '$schema',
  'name',
  'displayName',
  'version',
  'private',
  'description',
  'categories',
  'keywords',
  'homepage',
  'bugs',
  'repository',
  'funding',
  'license',
  'qna',
  'author',
  'maintainers',
  'contributors',
  'publisher',
  'sideEffects',
  'type',
  'imports',
  'exports',
  'main',
  'svelte',
  'umd:main',
  'jsdelivr',
  'unpkg',
  'module',
  'source',
  'jsnext:main',
  'browser',
  'react-native',
  'types',
  'typesVersions',
  'typings',
  'style',
  'example',
  'examplestyle',
  'assets',
  'bin',
  'man',
  'directories',
  'files',
  'workspaces',
  'binary',
  'scripts',
  'betterScripts',
  'contributes',
  'activationEvents',
  'husky',
  'simple-git-hooks',
  'pre-commit',
  'commitlint',
  'lint-staged',
  'nano-staged',
  'config',
  'nodemonConfig',
  'browserify',
  'babel',
  'browserslist',
  'xo',
  'prettier',
  'eslintConfig',
  'eslintIgnore',
  'npmpackagejsonlint',
  'release',
  'remarkConfig',
  'stylelint',
  'ava',
  'jest',
  'mocha',
  'nyc',
  'tap',
  'oclif',
  'resolutions',
  'dependencies',
  'devDependencies',
  'dependenciesMeta',
  'peerDependencies',
  'peerDependenciesMeta',
  'optionalDependencies',
  'bundledDependencies',
  'bundleDependencies',
  'extensionPack',
  'extensionDependencies',
  'flat',
  'packageManager',
  'engines',
  'engineStrict',
  'volta',
  'languageName',
  'os',
  'cpu',
  'preferGlobal',
  'publishConfig',
  'icon',
  'badges',
  'galleryBanner',
  'preview',
  'markdown',
  'pnpm',
]

/**
 * Reference: npm - https://docs.npmjs.com/files/package.json yarn -
 * https://yarnpkg.com/configuration/manifest vscode -
 * https://code.visualstudio.com/api/references/extension-manifest
 */
const UNTS_SORT: readonly string[] = [
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
  let { packageSortOrder, packageSortOrderPreset } = options

  const defaultSortOrder = {
    npm: NPM_SORTS,
    'npm-plus': NPM_PLUS_SORTS,
    unts: UNTS_SORT,
  }[packageSortOrderPreset || 'npm']

  packageSortOrder = uniqueArray([
    ...(packageSortOrder ?? []),
    ...defaultSortOrder,
  ])

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
