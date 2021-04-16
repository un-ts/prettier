import { ObjectProperty, StringArrayExpression, StringLiteral } from '../types'
import { sortStringArray } from '../utils'

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
