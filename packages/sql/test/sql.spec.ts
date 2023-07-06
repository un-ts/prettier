import { format } from 'prettier'

import SqlPlugin, { type SqlFormatOptions } from 'prettier-plugin-sql'

test('node-sql-parser', async () => {
  const options: SqlFormatOptions = {
    filepath: 'test.sql',
    parser: 'sql',
    plugins: [SqlPlugin],
    formatter: 'node-sql-parser',
  }
  expect(await format('SELECT * FROM `t`', options)).toMatchSnapshot()

  expect(
    await format(
      'UPDATE a SET id = 1 WHERE name IN (SELECT name FROM b)',
      options,
    ),
  ).toMatchSnapshot()

  expect(
    await format(
      'SELECT * FROM `t`;\nUPDATE a SET id = 1 WHERE name IN (SELECT name FROM b)',
      options,
    ),
  ).toMatchSnapshot()
})
