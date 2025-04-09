/* eslint-disable vitest/expect-expect */

import type { ParserOptions } from 'prettier'
import type { Node } from 'sh-syntax'

import { parsers } from 'prettier-plugin-sh'

const { locStart, locEnd } = parsers.sh

const testCase = async (script: string) => {
  const node = await parsers.sh.parse(script, {
    filepath: 'test.sh',
  } as ParserOptions<Node>)

  expect(locStart(node)).toBe(0)
  expect(locEnd(node)).toBe(script.length)
}

describe('Parser location functions', () => {
  it('should handle simple commands', () => {
    const script = 'echo "simple"'
    return testCase(script)
  })

  it('should handle if statements', () => {
    const script = 'if [ "$1" = "test" ]; then\n  echo "test"\nfi'
    return testCase(script)
  })

  it('should handle function definitions', async () => {
    const script = 'function say_hello() {\n  echo "Hello"\n}'
    return testCase(script)
  })

  it('should handle more complex constructs', async () => {
    // Add test for a more complex example, e.g. with loops and nesting
    const script =
      'for i in $(seq 1 3); do\n  if [ "$i" -eq 2 ]; then\n    echo "Found $i"\n  fi\ndone'
    return testCase(script)
  })
})
