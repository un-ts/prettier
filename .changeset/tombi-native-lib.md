---
"prettier-plugin-toml": major
---

feat(prettier-plugin-toml)!: migrate from `@tombi-toml/wasm-lib` to [`@tombi-toml/lib`](https://www.npmjs.com/package/@tombi-toml/lib)

Tombi is now loaded through its prebuilt native Node.js binding instead of the
WebAssembly build. The WASM loading shim is gone, so the plugin no longer has to
resolve and read the ~6.6 MB `tombi_wasm_bg.wasm` file on first format, and the
`@dual-bundle/import-meta-resolve` dependency is dropped.

- `@tombi-toml/lib` ships platform specific binaries (Linux, macOS and Windows
  on `x64`/`arm64`, including musl) as optional dependencies.
- Node.js `v20.0.0` or later is required, matching the engine range declared by
  `@tombi-toml/lib`.

The exposed options, the configuration discovery and the formatting behaviour
itself are unchanged.
