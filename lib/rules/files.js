/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const process = (props) => {
  const filesIndex = props.findIndex((prop) => prop.key.value === 'files');

  if (filesIndex >= 0) {
    const [filesNode] = props.splice(filesIndex, 1);

    let readme;
    let license;
    let { elements } = filesNode.value;

    elements = elements
      .filter((node) => {
        const value = node.value.toLowerCase();

        // remove LICENSE and README and add to the end later on
        if (value === 'license') {
          license = node;
          return false;
        }

        if (value === 'readme' || value === 'readme.md') {
          readme = node;
          return false;
        }

        return true;
      })
      .sort((a, b) => (a.value > b.value ? 1 : a.value < b.value ? -1 : 0));

    if (readme) {
      elements.push(readme);
    }

    if (license) {
      elements.push(license);
    }

    filesNode.value.elements = elements;

    props.splice(filesIndex, 0, filesNode);
  }

  return props;
};

module.exports = { files: process };
