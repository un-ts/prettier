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

  test('handles nested pre/post prefixes', () => {
    expect(
      sortScriptNames([
        'format',
        'postformat',
        'postposttest',
        'posttest',
        'preformat',
        'preposttest',
        'prepreformat',
        'pretest',
        'test',
      ]),
    ).toEqual([
      'prepreformat',
      'preformat',
      'format',
      'postformat',
      'pretest',
      'test',
      'preposttest',
      'posttest',
      'postposttest',
    ])

    expect(
      sortScriptNames([
        /* prettier-ignore */
        'prepare',
        'postprepare',
        'preprepare',
      ]),
    ).toEqual([
      /* prettier-ignore */
      'preprepare',
      'prepare',
      'postprepare',
    ])
  })
})
