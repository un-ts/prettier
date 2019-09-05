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
  'resolutions'
];

const sort = (pkg) => {
  const result = {};
  const unknown = Object.keys(pkg)
    .filter((key) => !primary.includes(key))
    .sort();

  for (const key of primary.concat(unknown)) {
    if (pkg[key]) {
      result[key] = pkg[key];
    }
  }

  return result;
};

module.exports = { sort };
