[tests]: 	https://img.shields.io/circleci/project/github/shellscape/prettier-plugin-package.svg
[tests-url]: https://circleci.com/gh/shellscape/prettier-plugin-package

[cover]: https://codecov.io/gh/shellscape/prettier-plugin-package/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/prettier-plugin-package

[size]: https://packagephobia.now.sh/badge?p=prettier-plugin-package
[size-url]: https://packagephobia.now.sh/result?p=prettier-plugin-package

![banner](https://raw.githubusercontent.com/shellscape/prettier-plugin-package/master/assets/banner.svg?sanitize=true)

# prettier-plugin-package [![tests][tests]][tests-url] [![cover][cover]][cover-url] [![size][size]][size-url] [![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)


An opinionated `package.json` formatter plugin for [Prettier](https://prettier.io)

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for `package.json` files used within NPM modules.

## Requirements

`prettier-plugin-package` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v8.0.0+).

## Install

Using npm:

```console
npm install prettier prettier-plugin-package --save-dev
```

<a href="https://www.patreon.com/shellscape">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

_Please consider donating if you find this project useful._

## Usage

Once installed, [Prettier plugins](https://prettier.io/docs/en/plugins.html) should be automatically recognized by Prettier. To use this plugin, confirm that it's installed and run Prettier using your preferred method. For example:

```console
$ npx prettier --write package.json
```

## Rules

This plugin enforces its own set of opinionated rules:

### Engines

Keys in `engines` are ordered alphabetically.

### Files

Keys in `files` are ordered alphabetically.

To prevent `README.md` from being added to `files`, set this option to `false`.

### Scripts

Keys in `scripts` are ordered alphabetically. Use prefixes wisely to properly order child scripts. e.g. `lint`, `lint:ts`.

### Sorting

Top-level keys are sorted according to a style commonly seen in the packages of [@sindresorhus](https://github.com/sindresorhus). Known keys, and their order are:

```js
[
  // meta
  'name',
  'version',
  'flat',
  'private',
  'publishConfig',
  'description',
  'license',
  'repository',
  'author',
  'homepage',
  'bugs',

  // entry
  'main',
  'bin',

  // constraints
  'engines',
  'cpu',
  'os',

  // content and util
  'scripts',
  'files',
  'keywords',

  // dependencies
  'bundledDependencies',
  'optionalDependencies',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'resolutions'
]
```

Unknown keys, or keys not part of the list above, will be alphabetically sorted and added to the end of the file. Note that this list takes into account both `npm` and `yarn` keys.

### Forthcoming

Forthcoming rules include:

- [ ] Author format
- [ ] Repository format

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
