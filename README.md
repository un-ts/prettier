[tests]: 	https://img.shields.io/circleci/project/github/shellscape/prettier-plugin-package.svg
[tests-url]: https://circleci.com/gh/shellscape/prettier-plugin-package

[cover]: https://codecov.io/gh/shellscape/prettier-plugin-package/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/prettier-plugin-package

[size]: https://packagephobia.now.sh/badge?p=prettier-plugin-package
[size-url]: https://packagephobia.now.sh/result?p=prettier-plugin-package

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

## Usage

## Rules

This plugin enforces its own set of opinionated rules:

### Sorting

Top-level keys are sorted according to a style commonly seen in the packages of [@sindresorhus](https://github.com/sindresorhus). Known keys, and their order are:

```js
[
  'name',
  'version',
  'publishConfig',
  'description',
  'license',
  'repository',
  'author',
  'homepage',
  'bugs',
  'main',
  'engines',
  'scripts',
  'files',
  'keywords',
  'peerDependencies',
  'optionalDependencies',
  'dependencies',
  'devDependencies'
]
```

Unknown keys, or keys not part of the list above, will be alphabetically sorted and added to the end of the file.

### Forthcoming

Forthcoming rules include:

- [ ] Author format
- [ ] Engines format
- [ ] Files order and content
- [ ] Repository format
- [ ] Scripts order

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
