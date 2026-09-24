import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

import { resolve } from '@dual-bundle/import-meta-resolve'

const PACKAGE_NAME = '@tombi-toml/wasm-lib'
const WASM_FILENAME = 'tombi_wasm_bg.wasm'

/**
 * The absolute URL of the current module, which works in both the ESM and
 * CommonJS builds.
 */
const getParentUrl = () =>
  typeof __filename === 'string'
    ? pathToFileURL(__filename).href
    : import.meta.url

/**
 * `@tombi-toml/wasm-lib` is a `--target web` build: its `init()` downloads
 * `tombi_wasm_bg.wasm` relative to its own module via `fetch()`, which Node
 * does not support for `file:` URLs. The wasm bytes therefore have to be loaded
 * manually and passed to `initSync`. Its `exports` map does not expose the wasm
 * file (nor even `./package.json`), so resolve the JS entry and look next to it.
 */
function resolveWasmUrl(): URL {
  return new URL(WASM_FILENAME, resolve(PACKAGE_NAME, getParentUrl()))
}

/**
 * Load the raw `tombi_wasm_bg.wasm` bytes, from the file system when available
 * and through `fetch` otherwise.
 */
export async function loadWasm(): Promise<BufferSource> {
  const wasmUrl = resolveWasmUrl()
  if (wasmUrl.protocol === 'file:') {
    return readFile(wasmUrl)
  }

  const response = await fetch(wasmUrl)
  return response.arrayBuffer()
}
