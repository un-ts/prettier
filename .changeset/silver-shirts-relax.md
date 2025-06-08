---
"prettier-plugin-pkg": patch
---

feat(pkg): add option `packageSortOrderPreset`

This option allows you to specify a preset for sorting packages in the `package.json` file.

The available presets are: `npm`, `npm-plus`:

- `npm`: sorts by [`npm`'s document](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- `npm-plus`: sorts by [`sort-package-json`](https://github.com/keithamus/sort-package-json/blob/aa6774ad937feb83178c8bc981f08305e1d22b5c/defaultRules.md) and therefore is compatible to [`prettier-plugin-packagejson`](https://github.com/matzkoh/prettier-plugin-packagejson)
