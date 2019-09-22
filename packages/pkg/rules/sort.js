/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
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

const sort = props => {
  const unknown = []
  const known = props.filter(prop => {
    if (primary.includes(prop.key.value)) {
      return true
    }
    unknown.push(prop)
    return false
  })

  known.sort((a, b) => {
    const aIndex = primary.indexOf(a.key.value)
    const bIndex = primary.indexOf(b.key.value)

    return aIndex > bIndex ? 1 : aIndex < bIndex ? -1 : 0
  })
  unknown.sort((a, b) =>
    a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0,
  )

  return known.concat(unknown)
}

module.exports = { sort }
