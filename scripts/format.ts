import fs from 'fs'

import { tryFile } from '@pkgr/utils'
import prettier from 'prettier'
import pkgPlugin from 'prettier-plugin-pkg'
import shPlugin from 'prettier-plugin-sh'

Promise.all(
  process.argv.slice(2).map(async filepath => {
    filepath = tryFile(filepath)

    if (!filepath) {
      return
    }

    const input = await fs.promises.readFile(filepath, 'utf-8')

    const output = prettier.format(input, {
      plugins: [pkgPlugin, shPlugin],
      filepath,
    })

    return fs.promises.writeFile(filepath, output)
  }),
).catch(console.error)
