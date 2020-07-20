import prettier from 'prettier'
import ShPlugin from 'prettier-plugin-sh'

test('fatal parse error', () => {
  expect(() =>
    prettier.format(`echo )`, {
      filepath: 'broken.sh',
      // @ts-ignore
      parser: 'sh',
      plugins: [ShPlugin],
    }),
  ).toThrow()
})
