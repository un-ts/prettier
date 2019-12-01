import prettier from 'prettier'
import ShPlugin from 'prettier-plugin-sh'

test('parsing a simple program', () => {
  const output = prettier.format(
    `echo      'foo'`,
    // @ts-ignore
    {
      filepath: 'pass.sh',
      parser: 'sh',
      plugins: [ShPlugin],
    },
  )

  expect(output).toMatchSnapshot()
})

test('fatal parse error', () => {
  expect(() =>
    prettier.format(
      `echo )`,
      // @ts-ignore
      {
        filepath: 'broken.sh',
        parser: 'sh',
        plugins: [ShPlugin],
      },
    ),
  ).toThrow()
})
