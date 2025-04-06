import { stripIndent } from 'common-tags'
import { describe, it, assert, expect } from 'vitest'

import ShPlugin from 'prettier-plugin-sh'

describe('parser', () => {
  const hasPragma = ShPlugin.parsers?.sh.hasPragma
  assert(hasPragma != null)

  describe('should detect pragmas', () => {
    it('at the top of the file', () => {
      expect(
        hasPragma(stripIndent`
        # @prettier
        FOO="bar"
      `),
      ).toBeTruthy()
    })

    it('with extra leading spaces', () => {
      expect(
        hasPragma(stripIndent`
        #   @prettier
        FOO="bar"
      `),
      ).toBeTruthy()
    })

    it('with no leading space', () => {
      expect(
        hasPragma(stripIndent`
        #@prettier
        FOO="bar"
      `),
      ).toBeTruthy()
    })

    it('with "format" pragma instead', () => {
      expect(
        hasPragma(stripIndent`
        # @format
        FOO="bar"
      `),
      ).toBeTruthy()
    })

    it('after leading whitespace', () => {
      expect(
        hasPragma(stripIndent`


        # @prettier
        FOO="bar"
      `),
      ).toBeTruthy()
    })

    it('after leading comments', () => {
      expect(
        hasPragma(stripIndent`
        # Testing!

        #
        #
        # @prettier
        FOO="bar"
      `),
      ).toBeTruthy()
    })

    it('after a shebang', () => {
      expect(
        hasPragma(stripIndent`
        #!/bin/bash
        #

        # @prettier
        FOO="bar"
      `),
      ).toBeTruthy()
    })

    it('unless none exist', () => {
      expect(
        hasPragma(stripIndent`
        FOO="bar"
      `),
      ).toBeFalsy()
    })

    it('unless the file is empty', () => {
      expect(hasPragma('')).toBeFalsy()
    })

    it('unless it comes after real content', () => {
      expect(
        hasPragma(stripIndent`
        FOO="bar"
        # @prettier
      `),
      ).toBeFalsy()
    })

    it('unless it comes after real content and comments', () => {
      expect(
        hasPragma(stripIndent`

        # Test
        #!
        FOO="bar"
        # @prettier
      `),
      ).toBeFalsy()
    })
  })
})
