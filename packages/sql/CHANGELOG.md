# Change Log

## 0.10.0

### Minor Changes

- [#207](https://github.com/un-ts/prettier/pull/207) [`6ca7374`](https://github.com/un-ts/prettier/commit/6ca7374f3bbeb2af9c685dd00b31d91262a4e8f7) Thanks [@frozenbonito](https://github.com/frozenbonito)! - feat!: respect `endOfLine` option from `prettier` core

### Patch Changes

- [#205](https://github.com/un-ts/prettier/pull/205) [`2c1f8c8`](https://github.com/un-ts/prettier/commit/2c1f8c8d9de6702557bdc6273b7ea4f771e5c64e) Thanks [@frozenbonito](https://github.com/frozenbonito)! - docs: align parser options

## 0.9.0

### Minor Changes

- [#201](https://github.com/un-ts/prettier/pull/201) [`81c856f`](https://github.com/un-ts/prettier/commit/81c856ff2a2fc6426a4774cdc0d7e172117c953f) Thanks [@JounQin](https://github.com/JounQin)! - feat!: upgrade sql-formatter v8, remove deprecated options

  - Removed `multilineLists` config option
  - Removed `newlineBeforeOpenParen` config option
  - Removed `newlineBeforeCloseParen` config option

## 0.8.3

### Patch Changes

- [#197](https://github.com/un-ts/prettier/pull/197) [`591f812`](https://github.com/un-ts/prettier/commit/591f812cc3a1669fa7874cf0e14c73ac4acbf47a) Thanks [@JounQin](https://github.com/JounQin)! - feat!: add donate field support

## 0.8.2

### Patch Changes

- [#195](https://github.com/un-ts/prettier/pull/195) [`4414264`](https://github.com/un-ts/prettier/commit/4414264eef7577ebcd02feee2c29ed8a37bc9de6) Thanks [@JounQin](https://github.com/JounQin)! - docs: add Sponsors and Backers sections

## 0.8.1

### Patch Changes

- [#180](https://github.com/un-ts/prettier/pull/180) [`702f44a`](https://github.com/un-ts/prettier/commit/702f44a70af261fda02341a8ea90d6973f31f3e6) Thanks [@JounQin](https://github.com/JounQin)! - chore: update node engine setting

## 0.8.0

### Minor Changes

- [`3da1ac4`](https://github.com/un-ts/prettier/commit/3da1ac466b6594fc12f60c0ea9fa64f3e085396b) Thanks [@JounQin](https://github.com/JounQin)! - feat(sql): bump sql-formatter to v7

## 0.7.0

### Minor Changes

- [`2ae5317`](https://github.com/un-ts/prettier/commit/2ae53176fdd545aa93957a19f778d107adadf242) Thanks [@JounQin](https://github.com/JounQin)! - feat!: upgrade `sql-formatter` and related usage

  The default `linesBetweenQueries` option value has changed to be `1`.

## 0.6.1

### Patch Changes

- [#168](https://github.com/un-ts/prettier/pull/168) [`f686714`](https://github.com/un-ts/prettier/commit/f686714f35b45c467d612afd763fafa34a6eeac2) Thanks [@JounQin](https://github.com/JounQin)! - fix: `types` should always come first in `exports`

## 0.6.0

### Minor Changes

- [#159](https://github.com/un-ts/prettier/pull/159) [`c1b25e5`](https://github.com/un-ts/prettier/commit/c1b25e5cf9797d7b9a718466e919fbcd42823ecf) Thanks [@JounQin](https://github.com/JounQin)! - feat: migrate whole project to native ESM with cjs fallback

## 0.5.0

### Minor Changes

- [#154](https://github.com/un-ts/prettier/pull/154) [`fd19f3a`](https://github.com/un-ts/prettier/commit/fd19f3a069f73279f3e98f1b1edac47588548c8c) Thanks [@JounQin](https://github.com/JounQin)! - feat: drop umd format support

## 0.4.2

### Patch Changes

- [`3cadfe7`](https://github.com/un-ts/prettier/commit/3cadfe77e8bf5605634e5fdc7874187719911bf6) Thanks [@JounQin](https://github.com/JounQin)! - fix: correct module path with .js extension for ESM

## 0.4.1

### Patch Changes

- [#138](https://github.com/un-ts/prettier/pull/138) [`184ff13`](https://github.com/un-ts/prettier/commit/184ff13d014ad063c8b644fd27f17aca46bc2235) Thanks [@JounQin](https://github.com/JounQin)! - fix: cjs outputs via rollup

## 0.4.0

### Minor Changes

- [`96626a2`](https://github.com/un-ts/prettier/commit/96626a2293dc044d7f159aab9d2b1436246cb5cd) Thanks [@JounQin](https://github.com/JounQin)! - feat: support native esm with exports field

## 0.3.0

### Minor Changes

- [#116](https://github.com/un-ts/prettier/pull/116) [`8af1142`](https://github.com/un-ts/prettier/commit/8af11429e08178200d4a8468ee93784408e413e6) Thanks [@JounQin](https://github.com/JounQin)! - feat(sql): add support of languages property for plugin-sql

## 0.2.0

### Minor Changes

- [#112](https://github.com/un-ts/prettier/pull/112) [`1ddae89`](https://github.com/un-ts/prettier/commit/1ddae89d407e0e728e9b58e4df0f43e2ad02fb92) Thanks [@JounQin](https://github.com/JounQin)! - chore: rebuild via esbuild, update node lts version

# 0.1.0 (2021-04-16)

### Features

- **prettier-plugin-sql:** first blood, support format sql files ([a85c7bb](https://github.com/un-ts/prettier/commit/a85c7bbf1d696f5c1d020ff0a687497e4464fdfb))
