---
"prettier-plugin-toml": minor
---

feat(prettier-plugin-toml): load tombi through [`tombit`](https://www.npmjs.com/package/tombit)

`tombit` wraps the same `tombi-lib` crate and keeps configuration discovery and
merging in Rust, so the plugin no longer ships `smol-toml` or a JavaScript
discovery/caching layer. Prettier's resolved options — including its defaults —
are passed as `overrideConfig`; tombi discovers the project's own `tombi.toml`
(or `[tool.tombi]` in `pyproject.toml`) and the user/system configurations.

Precedence change: Prettier's core options (`printWidth`, `tabWidth`, `useTabs`,
`singleQuote`, `bracketSpacing`) always take precedence over a discovered
`tombi.toml`. The plugin's own options no longer declare Prettier defaults, so
when they are not set the discovered configuration (or Tombi's default)
decides; explicitly set options still override it. The discovered
configuration's `[[overrides]]` are applied by Tombi last. `toml-version`
follows the same rule because it decides how the source is parsed. Formatting a string without a `filepath`
now works: configuration discovery starts from the current directory.
Diagnostics now carry a `range`, so syntax errors keep rendering their code
frame.
