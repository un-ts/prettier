# prettier-plugin-sql ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-sql) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-sql)

> An opinionated sql formatter plugin for [Prettier][]

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for a lot of sql files through [sql-formatter][] or [node-sql-parser][].

## Notice

This plugin is still under development, its printer just wraps [sql-formatter][] or [node-sql-parser][]'s default printer.
Of course it should just work, but may not match [prettier][]'s format sometimes.

## Requirements

`prettier-plugin-sql` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v12.0.0+).

## Install

Using npm:

```sh
# npm
npm i -D prettier prettier-plugin-sql

# yarn
yarn add -D prettier prettier-plugin-sql
```

## Usage

Once installed, [Prettier plugins](https://prettier.io/docs/en/plugins.html) should be automatically recognized by Prettier. To use this plugin, confirm that it's installed and run Prettier using your preferred method. For example:

```sh
# npx
npx prettier --write db.sql

# yarn
yarn prettier --write db.sql
```

## Parser Options

```ts
interface SqlOptions {
  formatter: 'sql-formatter' | 'node-sql-parser' // default `sql-formatter`

  // sql-formatter
  language:
    | 'sql'
    | 'bigquery'
    | 'hive'
    | 'mariadb'
    | 'mysql'
    | 'postgresql'
    | 'db2'
    | 'plsql'
    | 'n1ql'
    | 'redshift'
    | 'singlestoredb'
    | 'spark'
    | 'sqlite'
    | 'tsql'
    | 'trino' // default `sql`
  keywordCase: 'preserve' | 'upper' | 'lower' // default `preserve`
  indentStyle: 'standard' | 'tabularLeft' | 'tabularRight' // default `standard`
  logicalOperatorNewline: 'before' | 'after' // default `before`
  tabulateAlias: boolean // default `false`
  commaPosition: 'after' | 'before' | 'tabular' // default `after`
  expressionWidth: number // default `50`
  linesBetweenQueries: number // default `1`
  denseOperators: boolean // default `false`
  newlineBeforeSemicolon: boolean // default `false`
  params: Array | Object

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
    | 'flinksql' // default `mysql`
}
```

More details on [sql-formatter][] and [node-sql-parser][].

## Sponsors

| 1stG                                                                                                                               | RxTS                                                                                                                               | UnTS                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective backers and sponsors](https://opencollective.com/1stG/organizations.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective backers and sponsors](https://opencollective.com/rxts/organizations.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective backers and sponsors](https://opencollective.com/unts/organizations.svg)](https://opencollective.com/unts) |

## Backers

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
