# Change Log

## 2.0.2

### Patch Changes

- [#392](https://github.com/un-ts/prettier/pull/392) [`11cf08a`](https://github.com/un-ts/prettier/commit/11cf08a0c2ee224b9f02efb4e5732a41a5b34506) Thanks [@ntnyq](https://github.com/ntnyq)! - chore(toml): fix homepage url

## 2.0.1

### Patch Changes

- [#318](https://github.com/un-ts/prettier/pull/318) [`91bdd9f`](https://github.com/un-ts/prettier/commit/91bdd9f7c91a9b2527d752b697abcb2ea02c6725) Thanks [@JounQin](https://github.com/JounQin)! - fix: `@taplo/lib` is commonjs actually, export `options` and `types` for reusing

## 2.0.0

### Major Changes

- [#314](https://github.com/un-ts/prettier/pull/314) [`7db8ba4`](https://github.com/un-ts/prettier/commit/7db8ba4c35746cfc9c40e7de8b476902b876390e) Thanks [@so1ve](https://github.com/so1ve)! - feat!: add `toml` plugin, use `taplo` inside instead

We've migrated our repository from https://github.com/un-ts/toml-tools (v1) to https://github.com/un-ts/prettier/tree/master/packages/toml (v2), v1 has its own parser and printer while v2 just wrapps [`taplo`](https://github.com/tamasfe/taplo) which is faster and efficienter.

### Patch Changes

- [#314](https://github.com/un-ts/prettier/pull/314) [`7db8ba4`](https://github.com/un-ts/prettier/commit/7db8ba4c35746cfc9c40e7de8b476902b876390e) Thanks [@so1ve](https://github.com/so1ve)! - fix: do not remove blank lines after comments - close https://github.com/un-ts/toml-tools/issues/74
