/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const sortScripts = (pkg) => {
  const { scripts } = pkg;

  if (!scripts) {
    return pkg;
  }

  const result = Object.assign({}, pkg, { scripts: {} });
  const keys = Object.keys(scripts).sort();

  for (const key of keys) {
    if (scripts[key]) {
      result.scripts[key] = scripts[key];
    }
  }

  return result;
};

module.exports = { scripts: sortScripts };
