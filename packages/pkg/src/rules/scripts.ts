import { ObjectExpression, ObjectProperty } from '@babel/types'

const process = (props: ObjectProperty[]) => {
  const scriptsIndex = props.findIndex(prop => prop.key.value === 'scripts')

  if (scriptsIndex >= 0) {
    const scripts = props[scriptsIndex]
    ;((scripts.value as ObjectExpression).properties as ObjectProperty[]).sort(
      (a, b) =>
        a.key.value > b.key.value ? 1 : a.key.value < b.key.value ? -1 : 0,
    )
    // eslint-disable-next-line no-param-reassign
    props[scriptsIndex] = scripts
  }

  return props
}

export { process as scripts }
