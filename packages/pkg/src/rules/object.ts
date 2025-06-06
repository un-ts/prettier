/**
 * Copyright © 2019 Andrew Powell This Source Code Form is subject to the terms
 * of the Mozilla Public License, v. 2.0. If a copy of the MPL was not
 * distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/. The above copyright notice and this permission
 * notice shall be included in all copies or substantial portions of this Source
 * Code Form.
 */

import type { FormatOptions, ObjectProperty, StringLiteral } from '../types.js'
import { sortObject, sortStringArray } from '../utils.js'

const process = (
  props: ObjectProperty[],
  key: string,
  options: FormatOptions,
) => {
  if (options.packageIgnoreSort?.includes(key)) {
    return props
  }

  const item = props.find(prop => prop.key.value === key)

  if (item) {
    if ('elements' in item.value) {
      ;(item.value.elements as StringLiteral[]).sort(sortStringArray)
    } else if ('properties' in item.value) {
      item.value.properties.sort(sortObject)
    }
  }

  return props
}

export { process as object }
