/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const sort = (props) => {
  const scriptsIndex = props.findIndex((prop) => prop.key.value === 'scripts');

  if (scriptsIndex >= 0) {
    const scripts = props[scriptsIndex];
    scripts.value.properties.sort((a, b) =>
      a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0
    );
    // eslint-disable-next-line no-param-reassign
    props[scriptsIndex] = scripts;
  }

  return props;
};

module.exports = { scripts: sort };
