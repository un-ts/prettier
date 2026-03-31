import { sortScriptNames } from '../src/utils.js'

describe('sortScriptNames', () => {
  test('sorts pre/post hooks around base script names', () => {
    expect(
      sortScriptNames([
        'format',
        'postformat',
        'posttest',
        'preformat',
        'pretest',
        'test',
        'watch', // control
        'patch', // control
        'migrate', // control
        'ignore', // control
        'build', // control
      ]),
    ).toEqual([
      'build', // control
      'preformat',
      'format',
      'postformat',
      'ignore', // control
      'migrate', // control
      'patch', // control
      'pretest',
      'test',
      'posttest',
      'watch', // control
    ])
  })

  test('ignores unmatched pre/post hooks', () => {
    expect(
      sortScriptNames([
        'postformat', // (unmatched)
        'posttest',
        'prelint', // (unmatched)
        'pretest',
        'test',
        'watch', // control
        'patch', // control
        'migrate', // control
        'ignore', // control
        'build', // control
      ]),
    ).toEqual([
      'build', // control
      'ignore', // control
      'migrate', // control
      'patch', // control
      'postformat', // (unmatched)
      'prelint', // (unmatched)
      'pretest',
      'test',
      'posttest',
      'watch', // control
    ])

    expect(
      sortScriptNames([
        'test',
        'pre',
        'post',
        'watch', // control
        'patch', // control
        'migrate', // control
        'ignore', // control
        'build', // control
      ]),
    ).toEqual([
      'build', // control
      'ignore', // control
      'migrate', // control
      'patch', // control
      'post',
      'pre',
      'test',
      'watch', // control
    ])
  })

  test('respects default lifecycle scripts', () => {
    // `pare` isn’t grouped with `prepare`
    expect(
      sortScriptNames([
        'postprepare',
        'prepare',
        'preprepare',
        'test',
        'postpare',
        'pare',
        'watch', // control
        'patch', // control
        'migrate', // control
        'ignore', // control
        'build', // control
      ]),
    ).toEqual([
      'build', // control
      'ignore', // control
      'migrate', // control
      'pare',
      'postpare',
      'patch', // control
      'preprepare',
      'prepare',
      'postprepare',
      'test',
      'watch', // control
    ])

    // DLS hooks are grouped together even though their base is missing
    expect(
      sortScriptNames([
        'test',
        'postversion', // (single DLS hook)
        'postinstall',
        'postmerge', // (not a DLS)
        'postpack',
        'posttest',
        'preinstall',
        'premerge', // (not a DLS)
        'prepack',
        'pretest',
        'watch', // control
        'patch', // control
        'migrate', // control
        'ignore', // control
        'build', // control
      ]),
    ).toEqual([
      'build', // control
      'ignore', // control
      'preinstall',
      'postinstall',
      'migrate', // control
      'prepack',
      'postpack',
      'patch', // control
      'postmerge', // (not a DLS)
      'premerge', // (not a DLS)
      'pretest',
      'test',
      'posttest',
      'postversion', // (single DLS hook)
      'watch', // control
    ])
  })
})
