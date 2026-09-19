---
"prettier-plugin-toml": major
---

feat(prettier-plugin-toml)!: replace the unmaintained [`taplo`](https://github.com/tamasfe/taplo) with [`tombi`](https://github.com/tombi-toml/tombi)

The parser/printer is now powered by `@tombi-toml/wasm-lib`, which supports both
TOML `v1.0.0` and `v1.1.0`, fixes the crashes reported in
[#487](https://github.com/un-ts/prettier/issues/487), and is actively
maintained.

Since tombi exposes a different set of format rules, the previous `taplo`
options (`alignEntries`, `alignComments`, `arrayAutoExpand`, `arrayAutoCollapse`,
`compactArrays`, `compactInlineTables`, `compactEntries`, `indentTables`,
`indentEntries`, `reorderKeys` and `allowedBlankLines`) have been replaced with
tombi's own options. Prettier's own core options are now inherited and mapped
to their tombi counterparts: `printWidth` → `line-width`, `tabWidth` →
`indent-width`, `useTabs` → `indent-style`, `singleQuote` →
`string-quote-style` and `bracketSpacing` → `inline-table-brace-space-width`.
`endOfLine` keeps being handled by Prettier itself.

This release requires Node.js `v18.0.0` or later, matching the package's
`engines` field, because the Tombi WASM module is resolved and loaded with
`@dual-bundle/import-meta-resolve`.

Tombi's own configuration is now picked up as well: `.tombi.toml`, `tombi.toml`,
`.config/tombi.toml` and `[tool.tombi]` in `pyproject.toml` are searched from
the formatted file's directory up to the filesystem root (plus the user and
system level locations), following
[Tombi's search priority](https://github.com/tombi-toml/tombi/blob/main/docs/src/routes/docs/configuration.mdx).
The discovered `[format.rules]` take precedence over the corresponding Prettier
options.

See the `prettier-plugin-toml` README for the full list of supported options.
