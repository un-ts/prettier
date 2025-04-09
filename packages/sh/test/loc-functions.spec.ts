import type { ParserOptions } from 'prettier'
import type { Node } from 'sh-syntax'

import { parsers } from 'prettier-plugin-sh'

describe('Parser location functions', () => {
  const { locStart, locEnd } = parsers.sh

  it('should return correct offsets for simple shell scripts', async () => {
    const script = '#!/bin/sh\necho "Hello, world!"'
    const node = await parsers.sh.parse(script, {
      filepath: 'test.sh',
    } as ParserOptions<Node>)

    // Root node should start at position 0
    expect(locStart(node)).toBe(0)

    // Root node should end at the script length
    expect(locEnd(node)).toBe(script.length)
  })

  it('should handle scripts with various syntax constructs', async () => {
    const scripts = [
      // Simple command
      'echo "simple"',

      // If statement
      'if [ "$1" = "test" ]; then\n  echo "test"\nfi',

      // Function definition
      'function say_hello() {\n  echo "Hello"\n}',
    ]

    for (const script of scripts) {
      const node = await parsers.sh.parse(script, {
        filepath: 'test.sh',
      } as ParserOptions<Node>)

      expect(locStart(node)).toBe(0)
      expect(locEnd(node)).toBe(script.length)
    }
  })
})
