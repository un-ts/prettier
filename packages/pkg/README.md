![banner](https://raw.githubusercontent.com/rx-ts/prettier/master/assets/banner.svg?sanitize=true)

# prettier-plugin-pkg ![npm bundle size](https://img.shields.io/bundlephobia/min/prettier-plugin-pkg) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/prettier-plugin-pkg)

An opinionated `package.json` formatter plugin for [Prettier](https://prettier.io)

Prettier is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing, taking various rules into account.

This plugin adds support for `package.json` files used within NPM modules.

## Requirements

`prettier-plugin-pkg` is an evergreen module. 🌲 This module requires an [LTS](https://github.com/nodejs/Release) Node version (v8.0.0+).

## Install

Using npm:

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
yarn prettier --write package.jso
```

## Rules

This plugin enforces its own set of opinionated rules:

### Engines

Keys in `engines` are ordered alphabetically.

### Files

Keys in `files` are ordered alphabetically, followed by `README.md` and `LICENSE` if they exist in the array.

### Scripts

Keys in `scripts` are ordered alphabetically. Use prefixes wisely to properly order child scripts. e.g. `lint`, `lint:ts`.

### Sorting

Top-level keys are sorted according to a style commonly seen in the packages of [@JounQin](https://github.com/JounQin), [@1stG](https://github.com/1stG) and [@RxTS](https://github.com/rx-ts). Known keys, and their order are

```jsonc
[
  // meta
  "name",
  "version",
  "description",
  "repository",
  "homepage",
  "bugs",
  "author",
  "contributors",
  "license",
  "private",
  "workspaces",

  // constraints
  "engines",
  "cpu",
  "os",

  // entry
  "man",
  "bin",
  "main",
  "module",
  "esnext",
  "es2015",
  "esm",
  "fesm5",
  "fesm2015",
  "browser",
  "umd",
  "jsdelivr",
  "unpkg",
  "types",
  "typings",

  // content and util
  "directories",
  "files",
  "keywords",
  "scripts",
  "config",

  // dependencies
  "bundledDependencies",
  "peerDependencies",
  "dependencies",
  "optionalDependencies",
  "devDependencies",
  "publishConfig",
  "resolutions",
  "sideEffects"
]
```

Unknown keys, or keys not part of the list above, will be alphabetically sorted and added to the end of the file. Note that this list takes into account both `npm` and `yarn` keys.

### Forthcoming

Forthcoming rules include:

- [ ] Author format
- [ ] Repository format

## Meta

[LICENSE (Mozilla Public License)](./LICENSE)
