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

const cases: Array<[description: string, script: string]> = [
  ['simple commands', 'echo "simple"'],
  ['if statements', 'if [ "$1" = "test" ]; then\n  echo "test"\nfi'],
  ['function definitions', 'function say_hello() {\n  echo "Hello"\n}'],
  [
    'more complex constructs',
    'for i in $(seq 1 3); do\n  if [ "$i" -eq 2 ]; then\n    echo "Found $i"\n  fi\ndone',
  ],
]

describe('Parser location functions', () => {
  it.each(cases)('should handle %s', (_description, script) => testCase(script))
})
