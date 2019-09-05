/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { parsers } = require('prettier/parser-babylon');

const { scripts } = require('./scripts');
const { sort } = require('./sort');

const { 'json-stringify': parser } = parsers;
const rePkg = /package\.json$/;

const format = (input) => {
  let pkg = JSON.parse(input);
  pkg = sort(pkg);
  pkg = scripts(pkg);

  const result = JSON.stringify(pkg, null, 2);
  return result;
};

exports.parsers = {
  'json-stringify': {
    ...parser,
    preprocess(input, options) {
      const { filepath } = options;
      const text = parser.preprocess ? parser.preprocess(input, options) : input;

      if (rePkg.test(filepath)) {
        const result = format(text);
        return result;
      }

      return text;
    }
  }
};
