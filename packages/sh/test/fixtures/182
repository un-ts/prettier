#!/usr/bin/env bash
set -euo pipefail

monorepo_path="$("$(dirname "$(realpath -s "$0")")/../functions/monorepo_path")"

if [[ "$(pwd)" != "$monorepo_path" ]]; then
    cd "$monorepo_path"
fi

# name-only https://stackoverflow.com/a/1552353
# staged https://stackoverflow.com/a/1587877
# filter https://stackoverflow.com/a/41730200
# no-pager https://stackoverflow.com/a/2183920
# ignore path https://stackoverflow.com/questions/5685007/making-git-log-ignore-changes-for-certain-paths/21079437#21079437
echo ""
read -r -a en_translation_files < <(
    # cspell:disable-next-line
    git --no-pager diff --cached --name-only --diff-filter='ACMRTUXB' -- 'packages/translations/en'
    echo
)
declare -p en_translation_files

echo ""
read -r -a other_translation_files < <(
    # cspell:disable-next-line
    git --no-pager diff --cached --name-only --diff-filter='ACMRTUXB' -- ':!packages/translations/en' 'packages/translations'
    echo
)
declare -p other_translation_files

echo ""
default_locale="$(node -p "require('@configs/locales').defaultLocale;")"
read -r -a other_translation_folders < <(find "packages/translations" -not -name "$default_locale" -mindepth 1 -maxdepth 1 -type d)
declare -p other_translation_folders

# sanity check
en_translation_files_length="${#en_translation_files[@]}"
other_translation_files_length="${#other_translation_files[@]}"
other_translation_folders_length="${#other_translation_folders[@]}"

# math https://unix.stackexchange.com/a/299326
if [[ "$((en_translation_files_length * other_translation_folders_length))" -gt $other_translation_files_length ]]; then
    echo "[check]: unequal number of translation files" >&2
    exit 1
fi

# declare -A folder_changed_file_counts
# for translation_folder in "${other_translation_folders[@]}"; do
#     echo "$translation_folder"
#     locale="${translation_folder##*/}"
#     echo "$locale"
# done
