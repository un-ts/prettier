# prettier-plugin-sql ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-sql) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-sql)

> An opinionated sql formatter plugin for [Prettier][]

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for a lot of sql files through [sql-formatter][] or [node-sql-parser][].

## Notice

This plugin is still under development, its printer just wraps [sql-formatter][] or [node-sql-parser][]'s default printer.
Of course it should just work, but may not match [prettier][]'s format sometimes.

## Requirements

`prettier-plugin-sql` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v14.18.0+).

## Install

Using npm:

```sh
# npm
npm i -D prettier prettier-plugin-sql

# yarn
yarn add -D prettier prettier-plugin-sql
```

## Usage

Once installed, [Prettier plugins](https://prettier.io/docs/en/plugins.html) must be added to `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-sql"]
}
```

Then:

```sh
# npx
npx prettier --write db.sql

# yarn
yarn prettier --write db.sql
```

### SQL-in-JS with `prettier-plugin-embed`

Format SQL-in-JS tagged template literals by installing [`prettier-plugin-embed`](https://github.com/Sec-ant/prettier-plugin-embed) and configuring as follows:

`prettier.config.mjs`

```js
/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: ['prettier-plugin-embed', 'prettier-plugin-sql'],
}

/** @type {import('prettier-plugin-embed').PrettierPluginEmbedOptions} */
const prettierPluginEmbedConfig = {
  embeddedSqlTags: ['sql'],
}

/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
const prettierPluginSqlConfig = {
  language: 'postgresql',
  keywordCase: 'upper',
}

const config = {
  ...prettierConfig,
  ...prettierPluginEmbedConfig,
  ...prettierPluginSqlConfig,
}

export default config
```

Before formatting:

```ts
const animals = await sql`
  sELect  first_name,    species froM
   animals
         WhERE
 id = ${id}
`
```

After formatting:

```ts
const animals = await sql`
  SELECT
    first_name,
    species
  FROM
    animals
  WHERE
    id = ${id}
`
```

## Parser Options

```ts
interface SqlOptions {
  formatter: 'sql-formatter' | 'node-sql-parser' // default `sql-formatter`

  // sql-formatter
  language:
    | 'sql'
    | 'bigquery'
    | 'db2'
    | 'db2i' // (experimental)
    | 'hive'
    | 'mariadb'
    | 'mysql'
    | 'n1ql'
    | 'postgresql'
    | 'plsql'
    | 'redshift'
    | 'singlestoredb'
    | 'snowflake'
    | 'spark'
    | 'sqlite'
    | 'transactsql'
    | 'tsql'
    | 'trino'
  // default `sql`
  dialect: string // `JSOX` **stringified**, please refer https://github.com/sql-formatter-org/sql-formatter/blob/master/docs/dialect.md for more details
  keywordCase: 'preserve' | 'upper' | 'lower' // default `preserve`
  dataTypeCase: 'preserve' | 'upper' | 'lower' // default `preserve`
  functionCase: 'preserve' | 'upper' | 'lower' // default `preserve`
  identifierCase: 'preserve' | 'upper' | 'lower' // default `preserve`, experimental
  indentStyle: 'standard' | 'tabularLeft' | 'tabularRight' // default `standard`
  logicalOperatorNewline: 'before' | 'after' // default `before`
  expressionWidth: number // default `50`
  linesBetweenQueries: number // default `1`
  denseOperators: boolean // default `false`
  newlineBeforeSemicolon: boolean // default `false`
  params: string // `JSOX` **stringified**, please refer https://github.com/sql-formatter-org/sql-formatter/blob/master/docs/params.md for more details
  paramTypes: string // `JSOX` **stringified**, please refer https://github.com/sql-formatter-org/sql-formatter/blob/master/docs/paramTypes.md for more details

  // node-sql-parser
  type: 'table' | 'column' // default `table`
  database:
    | 'bigquery'
    | 'db2'
    | 'hive'
    | 'mariadb'
    | 'mysql'
    | 'postgresql'
    | 'transactsql'
    | 'flinksql'
    | 'snowflake' // (alpha)
  // default `mysql`
}
```

More details on [sql-formatter][] and [node-sql-parser][].

## Sponsors

| 1stG                                                                                                                               | RxTS                                                                                                                               | UnTS                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective backers and sponsors](https://opencollective.com/1stG/organizations.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective backers and sponsors](https://opencollective.com/rxts/organizations.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective backers and sponsors](https://opencollective.com/unts/organizations.svg)](https://opencollective.com/unts) |

## Backers

[![Backers](https://raw.githubusercontent.com/1stG/static/master/sponsors.svg)](https://github.com/sponsors/JounQin)

| 1stG                                                                                                                             | RxTS                                                                                                                             | UnTS                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective backers and sponsors](https://opencollective.com/1stG/individuals.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective backers and sponsors](https://opencollective.com/rxts/individuals.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective backers and sponsors](https://opencollective.com/unts/individuals.svg)](https://opencollective.com/unts) |

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT][] © [JounQin][]@[1stG.me][]

[1stg.me]: https://www.1stg.me
[jounqin]: https://GitHub.com/JounQin
[mit]: http://opensource.org/licenses/MIT
[node-sql-parser]: https://github.com/taozhi8833998/node-sql-parser
[prettier]: https://prettier.io
[sql-formatter]: https://github.com/zeroturnaround/sql-formatter
