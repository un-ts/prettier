/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const primary = [
  'name',
  'version',
  'description',
  'license',
  'repository',
  'author',
  'homepage',
  'bugs',
  'engines',
  'scripts',
  'files',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'keywords'
];

const sort = (input) => {
  const pkg = JSON.parse(input);
  const result = {};
  const unknown = Object.keys(pkg)
    .filter((key) => !primary.includes(key))
    .sort();

  for (const key of primary.concat(unknown)) {
    if (pkg[key]) {
      result[key] = pkg[key];
    }
  }
};

module.exports = { sort };
