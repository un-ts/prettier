# prettier-plugin-toml ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-toml) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-toml)

> An opinionated `toml` formatter plugin for [Prettier][]

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for `toml` through [tombi][].

## Notice

This plugin is still under development, its printer just wraps [tombi][]'s default printer.
Of course it should just work, but may not match [prettier][]'s format sometimes.

## Requirements

`prettier-plugin-toml` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v18.0.0+).

## Install

Using npm:

```sh
# npm
npm i -D prettier prettier-plugin-toml

# yarn
yarn add -D prettier prettier-plugin-toml
```

## Usage

Once installed, [Prettier plugins](https://prettier.io/docs/en/plugins.html) must be added to `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-toml"]
}
```

Then:

```sh
# npx
npx prettier --write foo.toml

# yarn
yarn prettier --write foo.toml
```

## Configuration

Besides the Prettier options below, this plugin also reads [tombi][]'s own
configuration following its
[search priority](https://github.com/tombi-toml/tombi/blob/main/docs/src/routes/docs/configuration.mdx):

1. For every directory from the formatted file's directory up to the filesystem
   root: `.tombi.toml`, `tombi.toml`, `.config/tombi.toml`, then `[tool.tombi]`
   in `pyproject.toml`.
2. User level: `$XDG_CONFIG_HOME/tombi/config.toml`,
   `~/.config/tombi/config.toml`, plus the platform specific
   `~/Library/Application Support/tombi/config.toml` (macOS) or
   `%APPDATA%\tombi\config.toml` (Windows).
3. System level: `/etc/tombi/config.toml`.

When a configuration file is found, its `[format.rules]` override Prettier's
defaults, while Prettier options that are explicitly set take precedence over
the configuration. Tombi's schema lookup stays disabled so formatting is
deterministic and never hits the network.

## Parser Options

[prettier][]'s own core options are inherited and mapped to their tombi
counterparts where they exist:

- `printWidth` → `line-width`
- `tabWidth` → `indent-width`
- `useTabs` → `indent-style`
- `singleQuote` → `string-quote-style`
- `bracketSpacing` → `inline-table-brace-space-width`

`endOfLine` is handled by [prettier][] itself. All of tombi's other format rules
are exposed as `toml` options and can be used to override the inherited values:

```ts
interface PrettierOptions {
  // The TOML version to use when parsing and formatting.
  tomlVersion: 'v1.0.0' | 'v1.1.0-preview' | 'v1.1.0' // default `v1.0.0`
  // The number of spaces inside the brackets of a single line array.
  arrayBracketSpaceWidth: number // default `0`
  // The number of spaces after the comma in a single line array.
  arrayCommaSpaceWidth: number // default `1`
  // The style used to format comments.
  commentStyle: 'normalize' | 'preserve' // default `normalize`
  // The delimiter between date and time.
  dateTimeDelimiter: 'preserve' | 'space' | 'T' // default `T`
  // The blank lines limit between groups.
  groupBlankLinesLimit: number // default `1`
  // Whether to indent sub-tables.
  indentSubTables: boolean // default `false`
  // Whether to indent table key-value pairs.
  indentTableKeyValuePairs: boolean // default `false`
  // The number of spaces inside the braces of a single line inline table,
  // defaults to `bracketSpacing` (`1` or `0`).
  inlineTableBraceSpaceWidth: number // default `bracketSpacing`
  // The number of spaces after the comma in a single line inline table.
  inlineTableCommaSpaceWidth: number // default `1`
  // Whether to align the equals sign in key-value pairs.
  keyValueEqualsSignAlignment: boolean // default `false`
  // The preferred quote character for keys, defaults to `stringQuoteStyle`.
  keyQuoteStyle: 'double' | 'preserve' | 'single' // default `undefined`
  // The preferred quote character for strings, defaults to `singleQuote`.
  stringQuoteStyle: 'double' | 'preserve' | 'single' // default `singleQuote`
  // Whether to align the trailing comments in key-value pairs.
  trailingCommentAlignment: boolean // default `false`
  // The number of spaces around the equals sign in a key-value pair.
  keyValueEqualsSignSpaceWidth: number // default `1`
  // The number of blank lines between tables.
  tableBlankLines: number // default `1`
  // The number of spaces before a trailing comment.
  trailingCommentSpaceWidth: number // default `2`
}
```

## Sponsors and Backers

[![Sponsors and Backers](https://raw.githubusercontent.com/1stG/static/master/sponsors.svg)](https://github.com/sponsors/JounQin)

### Sponsors

| 1stG                                                                                                                   | RxTS                                                                                                                   | UnTS                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective sponsors](https://opencollective.com/1stG/organizations.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective sponsors](https://opencollective.com/rxts/organizations.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective sponsors](https://opencollective.com/unts/organizations.svg)](https://opencollective.com/unts) |

### Backers

| 1stG                                                                                                                | RxTS                                                                                                                | UnTS                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective backers](https://opencollective.com/1stG/individuals.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective backers](https://opencollective.com/rxts/individuals.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective backers](https://opencollective.com/unts/individuals.svg)](https://opencollective.com/unts) |

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT][] © [Ray][]@[mk1.io][]

[mk1.io]: https://mk1.io
[mit]: http://opensource.org/licenses/MIT
[prettier]: https://prettier.io
[ray]: https://github.com/so1ve
[tombi]: https://github.com/tombi-toml/tombi
