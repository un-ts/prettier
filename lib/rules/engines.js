/*
  Copyright © 2019 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const process = (props, { enginesNode, enginesNpm }) => {
  const enginesIndex = props.findIndex((prop) => prop.key.value === 'engines');

  if (enginesIndex >= 0) {
    const [engines] = props.splice(enginesIndex, 1);
    const { properties } = engines.value;

    properties.sort((a, b) => (a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0));

    if (enginesNode) {
      const nodeIndex = properties.findIndex((prop) => prop.key.value === 'node');

      if (nodeIndex >= 0) {
        properties[nodeIndex].value.value = enginesNode;
      } else {
        properties.push({
          type: 'ObjectProperty',
          key: { type: 'StringLiteral', value: 'node' },
          value: { type: 'StringLiteral', value: enginesNode }
        });
      }
    }

    if (enginesNpm) {
      const npmIndex = properties.findIndex((prop) => prop.key.value === 'npm');

      if (npmIndex >= 0) {
        properties[npmIndex].value.value = enginesNpm;
      } else {
        properties.push({
          type: 'ObjectProperty',
          key: { type: 'StringLiteral', value: 'npm' },
          value: { type: 'StringLiteral', value: enginesNpm }
        });
      }
    }

    engines.value.properties = properties;

    props.splice(enginesIndex, 0, engines);
  }

  return props;
};

module.exports = { engines: process };
