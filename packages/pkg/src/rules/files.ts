/*
  Copyright © 2019 Andrew Powell
  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

import type {
  ObjectProperty,
  StringArrayExpression,
  StringLiteral,
} from '../types.js'
import { sortStringArray } from '../utils.js'

const process = (props: ObjectProperty[]) => {
  const filesNode = props.find(prop => prop.key.value === 'files')

  if (!filesNode) {
    return props
  }

  let readme: StringLiteral | undefined
  let license: StringLiteral | undefined

  const filesNodeValue = filesNode.value as StringArrayExpression

  const [normals, negations] = filesNodeValue.elements.reduce<
    [StringLiteral[], StringLiteral[]]
  >(
    (acc, node) => {
      const value = node.value.toLowerCase()

      // remove LICENSE and README and add to the end later on
      if (value === 'license') {
        license = node
        return acc
      }

      if (value === 'readme' || value === 'readme.md') {
        readme = node
        return acc
      }

      acc[+value.startsWith('!')].push(node)

      return acc
    },
    [[], []],
  )

  normals.sort(sortStringArray)
  negations.sort(sortStringArray)

  if (readme) {
    normals.push(readme)
  }

  if (license) {
    normals.push(license)
  }

  filesNodeValue.elements = [...normals, ...negations]

  return props
}

export { process as files }
