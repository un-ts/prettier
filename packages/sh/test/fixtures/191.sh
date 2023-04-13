#!/bin/sh

set -eu

readonly DEBUG="${DEBUG:-unset}"
if [ "${DEBUG}" != unset ]; then
  set -x
fi

_fail() {
  printf "\033[0;31m==> %s\033[0m\n\n" "$1"
}

_success() {
  printf "\033[0;32m==> %s\033[0m\n\n" "$1"
}

_info() {
  printf "\033[1;33m==> %s\033[0m\n\n" "$1"
}

_user() {
  printf "\033[0;33m%s\033[0m" "$1"
}

_find_placeholder_strings() {
  grep -rlZ 'typescript-vite-application-template' --exclude-dir=.git --exclude-dir=node_modules --exclude=run.sh .
}

_setup_repo() {
  if _find_placeholder_strings > /dev/null; then
    defaultname="$(basename "$(git rev-parse --show-toplevel)")"
    _user "Name of the repository? ($defaultname) "
    read -r name
    newname=$name
    if [ -z "$newname" ]; then
      newname=$defaultname
    fi
    _find_placeholder_strings | xargs sed -i '' 's/typescript-vite-application-template/'"$newname"'/g'
    _info "Renamed, please commit the changes!"
  fi
}

_setup_git_hooks() {
  _user "Do you want to install the Git hooks? (y/n) "
  read -r answer
  if [ "$answer" = "y" ]; then
    if ! command -v lefthook > /dev/null 2>&1; then
      _fail "Setup requires Lefthook, please install first: \`brew install lefthook\`"
      exit 1
    fi
    if ! command -v talisman > /dev/null 2>&1; then
      _fail "Setup requires Talisman, please install first: \`brew install talisman\`"
      exit 1
    fi
    lefthook install
    _info "Git hooks installed.."
  fi
}

_init() {
  _setup_repo
  _setup_git_hooks
}

_help() {
  echo "Usage: ./run.sh [command]"
  echo ""
  echo "Available commands:"
  echo "init                Set up repository for development"
}

case "$@" in
  "init") _init ;;
  *) _help ;;
esac
