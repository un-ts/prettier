import { sortScriptNames } from '../src/utils.js'

describe('sortScriptNames', () => {
  test('sorts pre/post hooks around base script names', () => {
    expect(
      sortScriptNames([
        /* prettier-ignore */
        'format',
        'postformat',
        'posttest',
        'preformat',
        'pretest',
        'test',
      ]),
    ).toEqual([
      /* prettier-ignore */
      'preformat',
      'format',
      'postformat',
      'pretest',
      'test',
      'posttest',
    ])

    expect(
      sortScriptNames([
        /* prettier-ignore */
        'test',
        'postinstall',
        'postpack',
        'posttest',
        'preinstall',
        'prepack',
        'pretest',
      ]),
    ).toEqual([
      /* prettier-ignore */
      'preinstall',
      'postinstall',
      'prepack',
      'postpack',
      'pretest',
      'test',
      'posttest',
    ])
  })

  test('ignores unmatched pre/post hooks', () => {
    expect(
      sortScriptNames([
        /* prettier-ignore */
        'postformat',
        'posttest',
        'prelint',
        'pretest',
        'test',
      ]),
    ).toEqual([
      /* prettier-ignore */
      'postformat',
      'prelint',
      'pretest',
      'test',
      'posttest',
    ])

    expect(
      sortScriptNames([
        /* prettier-ignore */
        'test',
        'pre',
        'post',
      ]),
    ).toEqual([
      /* prettier-ignore */
      'post',
      'pre',
      'test',
    ])
  })

  test('respects default lifecycle scripts', () => {
    expect(
      sortScriptNames([
        /* prettier-ignore */
        'postprepare',
        'prepare',
        'preprepare',
        'test',
        'postpare',
        'pare',
      ]),
    ).toEqual([
      /* prettier-ignore */
      'pare',
      'postpare',
      'preprepare',
      'prepare',
      'postprepare',
      'test',
    ])
  })
})
