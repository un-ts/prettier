import fs from 'node:fs'

import { tryFile } from '@pkgr/utils'
import prettier from 'prettier'

import pkgPlugin from 'prettier-plugin-pkg'
import shPlugin from 'prettier-plugin-sh'

await Promise.all(
  process.argv.slice(2).map(async filepath => {
    filepath = tryFile(filepath)

    if (!filepath) {
      return
    }

    const input = await fs.promises.readFile(filepath, 'utf8')

    const output = await prettier.format(input, {
      ...(await prettier.resolveConfig(filepath)),
      plugins: [pkgPlugin, shPlugin],
      filepath,
    })

    return fs.promises.writeFile(filepath, output)
  }),
)
