# prettier-plugin-autocorrect ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-autocorrect) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-autocorrect)

> An opinionated copywriting formatter plugin for [Prettier][]

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for a lot of files through [autocorrect][].

## Notice

This plugin is still under development, its printer just wraps [autocorrect][]'s default printer.
Of course it should just work, but may not match [prettier][]'s format sometimes.

## Requirements

`prettier-plugin-autocorrect` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v14.0.0+).

## Install

Using npm:

```sh
# npm
npm i -D prettier prettier-plugin-autocorrect

# yarn
yarn add -D prettier prettier-plugin-autocorrect
```

## Usage

Once installed, [Prettier plugins](https://prettier.io/docs/en/plugins.html) must be added to `.prettierrc`:

```json
{
  "plugins": ["prettier-plugin-autocorrect"]
}
```

Then:
```sh
# npx
npx prettier --write writing.md

# yarn
yarn prettier --write writing.md
```

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
[autocorrect]: https://github.com/huacnlee/autocorrect
[prettier]: https://prettier.io
