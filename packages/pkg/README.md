![banner](https://raw.githubusercontent.com/un-ts/prettier/master/assets/pkg.svg?sanitize=true)

# prettier-plugin-pkg ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-pkg) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-pkg)

An opinionated `package.json` formatter plugin for [Prettier](https://prettier.io), based on [prettier-plugin-package][].

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for `package.json` files used within NPM modules, [npm][], [yarn][] and [VSCode][] is supported out of box.

## Requirements

`prettier-plugin-pkg` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v12.0.0+).

## Install

```sh
# npm
npm i -D prettier prettier-plugin-pkg

# yarn
yarn add -D prettier prettier-plugin-pkg
```

## Usage

Once installed, [Prettier plugins](https://prettier.io/docs/en/plugins.html) should be automatically recognized by Prettier. To use this plugin, confirm that it's installed and run Prettier using your preferred method. For example:

```sh
# npx
npx prettier --write package.json

# yarn
yarn prettier --write package.json
```

## Rules

This plugin enforces its own set of opinionated rules:

### Engines

Keys in `engines` are ordered alphabetically.

### Files

Keys in `files` are ordered alphabetically (keeping the negations below), followed by `README.md` and `LICENSE` if they exist in the array.

### Scripts

Keys in `scripts` are ordered alphabetically. Use prefixes wisely to properly order child scripts. e.g. `lint`, `lint:ts`.

### Sorting

Top-level keys are sorted according to a style commonly seen in the packages of [@JounQin](https://github.com/JounQin), [@1stG](https://github.com/1stG) and [@unts](https://github.com/un-ts). Known keys, and their order are

```jsonc
[
  // meta
  "name",
  "version",
  "preview",
  "type",
  "flat",
  "displayName",
  "description",
  "categories",
  "repository",
  "homepage",
  "bugs",
  "funding",
  "author",
  "publisher",
  "contributors",
  "license",
  "preview",
  "private",
  "workspaces",

  // constraints
  "languageName",
  "packageManager",
  "engines",
  "cpu",
  "os",

  // entry
  "man",
  "bin",
  "main",
  "module",
  "imports",
  "exports",
  "esnext",
  "es2020",
  "esm2020",
  "fesm2020",
  "es2015",
  "esm2015",
  "fesm2015",
  "es5",
  "esm5",
  "fesm5",
  "browser",
  "umd",
  "jsdelivr",
  "unpkg",
  "types",
  "typings",
  "typesVersions",

  // content and util
  "directories",
  "files",
  "keywords",
  "scripts",
  "config",

  // dependencies
  "bundledDependencies",
  "peerDependencies",
  "peerDependenciesMeta",
  "dependencies",
  "dependenciesMeta",
  "optionalDependencies",
  "devDependencies",
  "overrides",
  "resolutions",
  "publishConfig",
  "sideEffects",

  // vscode spec
  "icon",
  "badges",
  "galleryBanner",
  "activationEvents",
  "contributes",
  "markdown",
  "qna",
  "extensionPack",
  "extensionDependencies",
  "extensionKind"
]
```

Unknown keys, or keys not part of the list above, will be alphabetically sorted and added to the end of the file. Note that this list takes into account both `npm` and `yarn` keys.

### Forthcoming

Forthcoming rules include:

- [ ] Author format
- [ ] Repository format

## Acknowledgements

Thanks for [@shellscape](https://github.com/shellscape)'s original great work of [prettier-plugin-package][] again.

## Sponsors

| 1stG                                                                                                                               | RxTS                                                                                                                               | UnTS                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective backers and sponsors](https://opencollective.com/1stG/organizations.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective backers and sponsors](https://opencollective.com/rxts/organizations.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective backers and sponsors](https://opencollective.com/unts/organizations.svg)](https://opencollective.com/unts) |

## Backers

| 1stG                                                                                                                             | RxTS                                                                                                                             | UnTS                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective backers and sponsors](https://opencollective.com/1stG/individuals.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective backers and sponsors](https://opencollective.com/rxts/individuals.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective backers and sponsors](https://opencollective.com/unts/individuals.svg)](https://opencollective.com/unts) |

## Meta

[LICENSE (Mozilla Public License)](./LICENSE)

[npm]: https://docs.npmjs.com/files/package.json
[prettier-plugin-package]: https://github.com/shellscape/prettier-plugin-package
[yarn]: https://yarnpkg.com/docs/package-j
[vscode]: https://code.visualstudio.com/api/references/extension-manifest
