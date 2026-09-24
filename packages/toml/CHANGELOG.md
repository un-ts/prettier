# Change Log

## 3.0.2

### Patch Changes

- [#525](https://github.com/un-ts/prettier/pull/525) [`a5ed072`](https://github.com/un-ts/prettier/commit/a5ed07299e50ce01d2b8458d347f483e1c50a8cf) Thanks [@JounQin](https://github.com/JounQin)! - fix: enable `npmPublishProvenance: true` for changesets v3

## 3.0.1

### Patch Changes

- [#523](https://github.com/un-ts/prettier/pull/523) [`3a41234`](https://github.com/un-ts/prettier/commit/3a41234393f1a1da49f6e9e3be8d34bdce6a0a30) Thanks [@JounQin](https://github.com/JounQin)! - fix: republish with provenance due to changesets v3 changes

## 3.0.0

### Major Changes

- [#519](https://github.com/un-ts/prettier/pull/519) [`e2e5c97`](https://github.com/un-ts/prettier/commit/e2e5c9773c0840d2dcc0458c7d7a0f6a1137d11d) Thanks [@JounQin](https://github.com/JounQin)! - feat(prettier-plugin-toml)!: replace the unmaintained [`taplo`](https://github.com/tamasfe/taplo) with [`tombi`](https://github.com/tombi-toml/tombi)

  The parser/printer is now powered by `@tombi-toml/wasm-lib`, which supports TOML
  `v1.0.0` and `v1.1.0` and fixes the crashes reported in
  [#487](https://github.com/un-ts/prettier/issues/487).

  - Prettier's core options are inherited and mapped to tombi: `printWidth` →
    `line-width`, `tabWidth` → `indent-width`, `useTabs` → `indent-style`,
    `singleQuote` → `string-quote-style` and `bracketSpacing` →
    `inline-table-brace-space-width`. `endOfLine` keeps being handled by Prettier.
  - The previous `taplo` options (`alignEntries`, `alignComments`,
    `arrayAutoExpand`, `arrayAutoCollapse`, `compactArrays`,
    `compactInlineTables`, `compactEntries`, `indentTables`, `indentEntries`,
    `reorderKeys` and `allowedBlankLines`) are replaced by tombi's own options.
  - Tombi's own configuration (`.tombi.toml`, `tombi.toml`, `.config/tombi.toml`
    and `[tool.tombi]` in `pyproject.toml`) is picked up following
    [Tombi's search priority](https://tombi-toml.github.io/tombi/docs/configuration).
    The discovered `[format.rules]` override Prettier's defaults, while explicitly
    set Prettier options override the discovered config.
  - Node.js `v18.0.0` or later is required.

  Tombi's schema lookup is always disabled, and discovered configuration files are
  watched so edits to them are picked up without restarting the process.

  See the `prettier-plugin-toml` README for the full list of supported options.

## 2.0.6

### Patch Changes

- [#485](https://github.com/un-ts/prettier/pull/485) [`9e0233e`](https://github.com/un-ts/prettier/commit/9e0233eb1909e415bf6e6a0c7a24d1de39a8f087) Thanks [@JounQin](https://github.com/JounQin)! - fix: do not use named exports for commonjs

## 2.0.5

### Patch Changes

- [#453](https://github.com/un-ts/prettier/pull/453) [`b44651a`](https://github.com/un-ts/prettier/commit/b44651a38d8f87da584f898fb46db0ec69005725) Thanks [@JounQin](https://github.com/JounQin)! - fix: remove buggy `module-sync` exports field

## 2.0.4

### Patch Changes

- [`facf7ac`](https://github.com/un-ts/prettier/commit/facf7acb0eff0520a74de4f8f710c8bdaeeb40e9) Thanks [@JounQin](https://github.com/JounQin)! - fix: incorrect `require` entry types, add `module-sync` entry

## 2.0.3

### Patch Changes

- [#418](https://github.com/un-ts/prettier/pull/418) [`4716026`](https://github.com/un-ts/prettier/commit/4716026ed1599ef96dd27d842740487ed4db1cb8) Thanks [@esacteksab](https://github.com/esacteksab)! - docs: add `TOML` parser options to README

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
