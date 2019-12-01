import { ObjectProperty, StringArrayExpression, StringLiteral } from '../types'
import { sortStringArray } from '../utils'

const process = (props: ObjectProperty[]) => {
  const filesIndex = props.findIndex(prop => prop.key.value === 'files')

  if (filesIndex >= 0) {
    const [filesNode] = props.splice(filesIndex, 1)

    let readme: StringLiteral | undefined
    let license: StringLiteral | undefined

    const elements = (filesNode.value as StringArrayExpression).elements
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

    Object.assign(filesNode, { elements })

    props.splice(filesIndex, 0, filesNode)
  }

  return props
}

export { process as files }
