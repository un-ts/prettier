# prettier-plugin-sql ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-sql) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-sql)

> An opinionated sql formatter plugin for [Prettier][]

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for a lot of sql files through [sql-formatter][] or [node-sql-parser][].

## Notice

This plugin is still under development, its printer just wraps [sql-formatter][] or [node-sql-parser][]'s default printer.
Of course it should just work, but may not match [prettier][]'s format sometimes.

## Requirements

`prettier-plugin-sql` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v10.0.0+).

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
    | 'mariadb'
    | 'mysql'
    | 'postgresql'
    | 'db2'
    | 'plsql'
    | 'n1ql'
    | 'redshift'
    | 'spark'
    | 'tsql' // default `sql`
  uppercase: boolean // default `false`
  linesBetweenQueries: number // default `2`

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
