# prettier-plugin-toml ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-toml) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-toml)

> An opinionated `toml` formatter plugin for [Prettier][]

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for `toml` through [tombi][].

## Notice

This plugin is still under development, its printer just wraps [tombi][]'s default printer.
Of course it should just work, but may not match [prettier][]'s format sometimes.

## Requirements

`prettier-plugin-toml` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v20.0.0+).

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

Besides the options below, this plugin reads [tombi][]'s own configuration,
following its [search priority][tombi-config]. Discovery and merging are
delegated to [`tombit`](https://www.npmjs.com/package/tombit), which performs
the search in Rust:

1. **Project** — for each directory from the formatted file's directory up to
   the filesystem root: `.tombi.toml`, `tombi.toml`, `.config/tombi.toml`, then
   `[tool.tombi]` in `pyproject.toml`.
2. **User** — `$XDG_CONFIG_HOME/tombi/config.toml`,
   `~/.config/tombi/config.toml`, plus the platform specific
   `~/Library/Application Support/tombi/config.toml` (macOS) or
   `%APPDATA%\tombi\config.toml` (Windows).
3. **System** — `/etc/tombi/config.toml`.

The rules are resolved in order, each step overriding the previous one:

1. Prettier's core options (`printWidth`, `tabWidth`, `useTabs`, `singleQuote`,
   `bracketSpacing`) and any plugin option the user explicitly sets.
2. The discovered configuration's rules, including the plugin options the user
   did not set.
3. The discovered configuration's per-file `[[overrides]]`, applied by Tombi
   last.

Prettier's core options are always resolved, so they win over `tombi.toml`: a
`tombi.toml` `line-width` that differs from Prettier's `printWidth` does not
change this plugin's output. If you also use the tombi CLI or the VS Code
extension, set `line-width` in `tombi.toml` to the same value as `printWidth`
so both produce the same output — with no configuration at all, Prettier
defaults to `80` while tombi has no line width limit.

The plugin's own options have no defaults: when they are not set, the
discovered configuration (or Tombi's default) decides, except
`stringQuoteStyle` and `inlineTableBraceSpaceWidth`, which derive from
Prettier's `singleQuote`/`bracketSpacing`. `toml-version` follows the same rule
because it decides how the source is parsed.

### Notes

- Tombi's schema lookup is always disabled, so formatting stays offline and
  deterministic.
- Resolved configurations are cached and invalidated when the configuration
  file or its directory changes, so edits apply without restarting the process.

## Parser Options

[prettier][]'s own core options are inherited and mapped to their tombi
counterparts where they exist:

- `printWidth` → `line-width`
- `tabWidth` → `indent-width`
- `useTabs` → `indent-style`
- `singleQuote` → `string-quote-style`
- `bracketSpacing` → `inline-table-brace-space-width`

`endOfLine` is handled by [prettier][] itself. All of tombi's other format
rules are exposed as `toml` options. They have no defaults: setting one
overrides the discovered configuration, while leaving it unset lets
`tombi.toml` (or Tombi's own default) decide — except `stringQuoteStyle` and
`inlineTableBraceSpaceWidth`, which derive from the core options above.

```ts
interface PrettierOptions {
  // The TOML version to use when parsing and formatting; follows the
  // discovered configuration when unset.
  tomlVersion?: 'v1.0.0' | 'v1.1.0-preview' | 'v1.1.0'
  // The number of spaces inside the brackets of a single line array.
  arrayBracketSpaceWidth?: number
  // The number of spaces after the comma in a single line array.
  arrayCommaSpaceWidth?: number
  // The style used to format comments.
  commentStyle?: 'normalize' | 'preserve'
  // The delimiter between date and time.
  dateTimeDelimiter?: 'preserve' | 'space' | 'T'
  // The blank lines limit between groups.
  groupBlankLinesLimit?: number
  // Whether to indent sub-tables.
  indentSubTables?: boolean
  // Whether to indent table key-value pairs.
  indentTableKeyValuePairs?: boolean
  // The number of spaces inside the braces of a single line inline table;
  // derives from `bracketSpacing` (`1` or `0`) when unset.
  inlineTableBraceSpaceWidth?: number
  // The number of spaces after the comma in a single line inline table.
  inlineTableCommaSpaceWidth?: number
  // Whether to align the equals sign in key-value pairs.
  keyValueEqualsSignAlignment?: boolean
  // The preferred quote character for keys; follows `stringQuoteStyle` when
  // unset.
  keyQuoteStyle?: 'double' | 'preserve' | 'single'
  // The preferred quote character for strings; derives from `singleQuote`
  // when unset.
  stringQuoteStyle?: 'double' | 'preserve' | 'single'
  // Whether to align the trailing comments in key-value pairs.
  trailingCommentAlignment?: boolean
  // The number of spaces around the equals sign in a key-value pair.
  keyValueEqualsSignSpaceWidth?: number
  // The number of blank lines between tables.
  tableBlankLines?: number
  // The number of spaces before a trailing comment.
  trailingCommentSpaceWidth?: number
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
[tombi-config]: https://tombi-toml.github.io/tombi/docs/configuration
