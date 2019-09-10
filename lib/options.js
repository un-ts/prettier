/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const options = {
  enginesNode: {
    type: 'path',
    category: 'Prettier Package',
    default: '',
    description: 'Asserts an `engines.node` property value for package.json.'
  },
  enginesNpm: {
    type: 'path',
    category: 'Prettier Package',
    default: '',
    description: 'Asserts an `engines.npm` property value for package.json.'
  },
  filesLicense: {
    type: 'boolean',
    category: 'Prettier Package',
    default: true,
    description:
      'If true, asserts `LICENSE` as an entry in the `files` property value for package.json.'
  },
  filesReadme: {
    type: 'boolean',
    category: 'Prettier Package',
    default: true,
    description:
      'If true, asserts `README.md` as an entry in the `files` property value for package.json.'
  },
  repository: {
    type: 'path',
    category: 'Prettier Package',
    default: '',
    description: 'Enforce a `repository` property value for package.json.'
  }
};

module.exports = { options };
