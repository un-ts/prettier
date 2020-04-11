import { ObjectProperty, StringArrayExpression, StringLiteral } from '../types'
import { sortStringArray } from '../utils'

const process = (props: ObjectProperty[]) => {
  const filesNode = props.find(prop => prop.key.value === 'files')

  if (filesNode) {
    let readme: StringLiteral | undefined
    let license: StringLiteral | undefined

    const filesNodeValue = filesNode.value as StringArrayExpression

    const elements = filesNodeValue.elements
      .filter(node => {
        const value = node.value.toLowerCase()

        // remove LICENSE and README and add to the end later on
        if (value === 'license') {
          license = node
          return false
        }

        if (value === 'readme' || value === 'readme.md') {
          readme = node
          return false
        }

        return true
      })
      .sort(sortStringArray)

    if (readme) {
      elements.push(readme)
    }

    if (license) {
      elements.push(license)
    }

    filesNodeValue.elements = elements
  }

  return props
}

export { process as files }
