<p align="center">
  <img src="https://raw.githubusercontent.com/un-ts/prettier/master/assets/sh.png" height="100" />
</p>

# prettier-plugin-sh ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-sh) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-sh)

> An opinionated `shellscript` formatter plugin for [Prettier][], also support simple format of `Dockerfile`, `properties`, `gitignore`, `dotenv`, `hosts`, `jvmoptions`...

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for a lot of files through [mvdan-sh][].

## Notice

This plugin is still under development, its printer just wraps [mvdan-sh][]'s default printer.
Of course it should just work, but may not match [prettier][]'s format sometimes.

## Requirements

`prettier-plugin-sh` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v16.0.0+).

## Install

Using npm:

```sh
# npm
npm i -D prettier prettier-plugin-sh

# yarn
yarn add -D prettier prettier-plugin-sh
```

## Usage

Once installed, [Prettier plugins](https://prettier.io/docs/en/plugins.html) must be added to `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-sh"]
}
```

Then:

```sh
# npx
npx prettier --write script.sh

# yarn
yarn prettier --write script.sh
```

## Parser Options

```ts
interface ShOptions {
  // parser
  keepComments: boolean // default `true`
  stopAt: string
  variant: LangVariant

  // printer
  indent: number
  binaryNextLine: boolean // default `true`
  switchCaseIndent: boolean
  spaceRedirects: boolean
  keepPadding: boolean
  minify: boolean
  functionNextLine: boolean

  // use `sh-syntax` instead
  experimentalWasm: boolean
}
```

More details on [godoc](https://godoc.org/mvdan.cc/sh/syntax#NewParser)

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
[mvdan-sh]: https://github.com/mvdan/sh
[prettier]: https://prettier.io
