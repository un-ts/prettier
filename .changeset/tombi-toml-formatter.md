---
"prettier-plugin-toml": major
---

feat(prettier-plugin-toml)!: replace the unmaintained [`taplo`](https://github.com/tamasfe/taplo) with [`tombi`](https://github.com/tombi-toml/tombi)

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
watched so edits are picked up without restarting the process.

See the `prettier-plugin-toml` README for the full list of supported options.
