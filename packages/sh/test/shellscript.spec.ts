import prettier from 'prettier'
import ShPlugin from 'prettier-plugin-sh'

test('parsing a simple program', () => {
  const output = prettier.format(`echo      'foo'`, {
    // @ts-ignore
    parser: 'sh-parse',
    plugins: [ShPlugin],
  })

  expect(output).toMatchSnapshot()
})

test('fatal parse error', () => {
  expect(() =>
    prettier.format(`echo )`, {
      filepath: 'broken.sh',
      // @ts-ignore
      parser: 'sh-parse',
      plugins: [ShPlugin],
    }),
  ).toThrow()
})
