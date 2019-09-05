/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { 'json-stringify': parser } = require('prettier/parser-babylon');

const { sort } = require('./sort');

const rePkg = /package\.json$/;

const format = (input) => {
  const result = sort(input);
  return result;
};

exports.parsers = {
  'json-stringify': {
    ...parser,
    preprocess(input, options) {
      const { filepath } = options;
      const text = parser.preprocess(input, options);

      if (rePkg.test(filepath)) {
        return format(text);
      }

      return text;
    }
  }
};
