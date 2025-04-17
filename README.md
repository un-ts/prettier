# @unts/prettier

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/un-ts/prettier/ci.yml?branch=master)](https://github.com/un-ts/prettier/actions/workflows/ci.yml?query=branch%3Amaster)
[![Codecov](https://img.shields.io/codecov/c/gh/un-ts/prettier)](https://codecov.io/gh/un-ts/prettier)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fun-ts%2Fprettier%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)
[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/un-ts/pkgr)](https://coderabbit.ai)
[![GitHub release](https://img.shields.io/github/release/un-ts/prettier)](https://github.com/un-ts/prettier/releases)

[![Conventional Commits](https://img.shields.io/badge/conventional%20commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![changesets](https://img.shields.io/badge/maintained%20with-changesets-176de3.svg)](https://github.com/changesets/changesets)

> Opinionated but Incredible Prettier plugins.

## Packages

This repository is a monorepo managed by [changesets][] what means we actually publish several packages to npm from same codebase, including:

| Package                                                | Description                                                                                                                                                           | Version                                                                                                                           |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [`prettier-plugin-autocorrect`](/packages/autocorrect) | An opinionated copywriting formatter plugin for Prettier                                                                                                              | [![npm](https://img.shields.io/npm/v/prettier-plugin-autocorrect.svg)](https://www.npmjs.com/package/prettier-plugin-autocorrect) |
| [`prettier-plugin-pkg`](/packages/pkg)                 | An opinionated package.json formatter plugin for Prettier                                                                                                             | [![npm](https://img.shields.io/npm/v/prettier-plugin-pkg.svg)](https://www.npmjs.com/package/prettier-plugin-pkg)                 |
| [`prettier-plugin-sh`](/packages/sh)                   | An opinionated `shellscript` formatter plugin for Prettier, also support simple format of `Dockerfile`, `properties`, `gitignore`, `dotenv`, `hosts`, `jvmoptions`... | [![npm](https://img.shields.io/npm/v/prettier-plugin-sh.svg)](https://www.npmjs.com/package/prettier-plugin-sh)                   |
| [`prettier-plugin-sql`](/packages/sql)                 | An opinionated sql formatter plugin for Prettier                                                                                                                      | [![npm](https://img.shields.io/npm/v/prettier-plugin-sql.svg)](https://www.npmjs.com/package/prettier-plugin-sql)                 |
| [`prettier-plugin-toml`](/packages/toml)               | An opinionated `toml` formatter plugin for Prettier                                                                                                                   | [![npm](https://img.shields.io/npm/v/prettier-plugin-toml.svg)](https://www.npmjs.com/package/prettier-plugin-toml)               |

## Sponsors and Backers

[![Sponsors and Backers](https://raw.githubusercontent.com/1stG/static/master/sponsors.svg)](https://github.com/sponsors/JounQin)

### Sponsors

| 1stG                                                                                                                   | RxTS                                                                                                                   | UnTS                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective sponsors](https://opencollective.com/1stG/organizations.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective sponsors](https://opencollective.com/rxts/organizations.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective sponsors](https://opencollective.com/unts/organizations.svg)](https://opencollective.com/unts) |

### Backers

| 1stG                                                                                                                | RxTS                                                                                                                | UnTS                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [![1stG Open Collective backers](https://opencollective.com/1stG/individuals.svg)](https://opencollective.com/1stG) | [![RxTS Open Collective backers](https://opencollective.com/rxts/individuals.svg)](https://opencollective.com/rxts) | [![UnTS Open Collective backers](https://opencollective.com/unts/individuals.svg)](https://opencollective.com/unts) |

## Changelog

Detailed changes for each release are documented in [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT][] © [JounQin][]@[1stG.me][]

[1stG.me]: https://www.1stg.me
[changesets]: https://github.com/changesets/changesets
[JounQin]: https://github.com/JounQin
[MIT]: http://opensource.org/licenses/MIT
