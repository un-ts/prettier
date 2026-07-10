import { format } from 'prettier'
import { LangVariant } from 'sh-syntax'
import { describe, expect, it } from 'vitest'

import * as sh from 'prettier-plugin-sh'

/*
 * Regression test for zsh support, tracking:
 *   - sh-syntax issue:  https://github.com/un-ts/sh-syntax/issues/135
 *   - sh-syntax fix PR: https://github.com/un-ts/sh-syntax/pull/136
 *
 * `${0:A:h:h}` is valid zsh (modifier chain: :A absolute path, :h head/dirname)
 * but is rejected by the bash grammar with "ternary operator missing ? before :".
 * sh-syntax >= 0.6.0 rebuilds the WASM against mvdan/sh v3.13 and exposes a
 * dedicated `LangZsh` variant that parses it correctly.
 *
 * Expected results by installed sh-syntax version:
 *   - 0.5.8 (before): RED - `LangZsh` is undefined and format() throws.
 *   - 0.6.0 (after):  GREEN - the zsh variant parses and prints the input.
 */
describe('zsh support (sh-syntax >= 0.6.0)', () => {
  const ZSH_SOURCE = 'DIR=${0:A:h:h}\n'

  it('exposes the LangZsh variant constant', () => {
    expect(LangVariant.LangZsh).toBeDefined()
  })

  it('formats a zsh modifier chain when using the zsh variant', async () => {
    const output = await format(ZSH_SOURCE, {
      filepath: 'script.zsh',
      plugins: [sh],
      variant: LangVariant.LangZsh,
    })

    expect(output).toContain('${0:A:h:h}')
  })
})
