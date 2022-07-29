import prettier from 'prettier'

import SqlPlugin, { type SqlFormatOptions } from 'prettier-plugin-sql'

test('node-sql-parser', () => {
  const options: SqlFormatOptions = {
    filepath: 'test.sql',
    parser: 'sql',
    plugins: [SqlPlugin],
    pluginSearchDirs: false,
    formatter: 'node-sql-parser',
  }
  expect(prettier.format('SELECT * FROM `t`', options)).toMatchSnapshot()

  expect(
    prettier.format(
      'UPDATE a SET id = 1 WHERE name IN (SELECT name FROM b)',
      options,
    ),
  ).toMatchSnapshot()

  expect(
    prettier.format(
      'SELECT * FROM `t`;\nUPDATE a SET id = 1 WHERE name IN (SELECT name FROM b)',
      options,
    ),
  ).toMatchSnapshot()
})
