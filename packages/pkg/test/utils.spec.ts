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
        'postprepare',
        'prepare',
        'preprepare',
        'test',
      ]),
    ).toEqual([
      /* prettier-ignore */
      'preprepare',
      'prepare',
      'postprepare',
      'test',
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
})
