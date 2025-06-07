---
"prettier-plugin-pkg": minor
---

feat(pkg)!: add option `packageSortOrderPreset`

This option allows you to specify a preset for sorting packages in the `package.json` file.

The available presets are: `npm`, `npm-plus` and `unts`.

- `npm` sorts by <https://docs.npmjs.com/cli/v11/configuring-npm/package-json>
- `npm-plus` sorts by <https://github.com/keithamus/sort-package-json/blob/aa6774ad937feb83178c8bc981f08305e1d22b5c/defaultRules.md> and is compatible to `prettier-plugin-packagejson`
- `unts` was the default preset before this change
