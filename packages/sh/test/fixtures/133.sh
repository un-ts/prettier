#!/usr/bin/env bash

set -euo pipefail

DEBUG=${DEBUG:-}

help() {
    cat <<EOF
Simple monorepo lifecycle/pipeline tool for running one or more commands on one
or more directories that have diffs compared to an ancestor. The primary
use case is for selective CI jobs within a trunk based workflow.

Takes two arguments, <glob> <command>. The command is invoked from each
directory context matching the glob.

Usage:
  lolaus "./tests/* :(top,exclude)**requirements.txt" ls
  lolaus "**" pwd
  lolaus "*/*/package.json" npm test & lolaus "*/*/requirements.txt" "python test.py"
  lolaus "apps/*/index.js"
  lolaus "**" ls target-branch other-branch
EOF
    exit 1
}

# lolaus <glob> [cmd] [target_ref] [source_ref]
function main() {

    [[ $1 == "-h" || $1 == "--help" ]] && help

    local cmd
    cmd="${2:-}"

    local target_ref
    target_ref=$(get_target_ref "${3:-}")
    [ -n "${DEBUG}" ] && echo "target: $target_ref"

    local source_ref
    source_ref=$(get_source_ref "${4:-}")
    [ -n "${DEBUG}" ] && echo "source: $source_ref"

    local concestor
    concestor=$(get_concestor "$target_ref" "$source_ref")
    [ -n "${DEBUG}" ] && echo "concestor: $concestor"

    local diffs
    diffs=$(get_chagned_files "$concestor" "$source_ref")
    [ -n "${DEBUG}" ] && echo "diffs: $diffs"

    local dirs
    dirs=$(files_to_dirs "$diffs")
    [ -n "${DEBUG}" ] && echo "dirs: $dirs"

    [ -z "${cmd}" ] && echo "$dirs" && exit
    cmd_runner "$cmd" "$dirs"

}

# Invokes the provided command in each provided direcotry
# cmd_runner <cmd> "<dirs>"
cmd_runner() {
    : "${1? 'ERROR: cmd_runner *<cmd>* "<dirs>'}"
    : "${2? 'ERROR: cmd_runner <cmd> *"<dirs>*'}"
    local cmd
    cmd="$1"

    declare -a dirs
    mapfile -t dirs <<<"$2"

    for d in "${dirs[@]}"; do
        if [[ ! -d $d ]]; then
            echo "cmd_runner only works on dirs, not: $d"
            exit 1
        fi

        local cmds="cd $d; $cmd"
        output="$(eval "$cmds" 2>&1)"

        [[ -z "$output" ]] && output="$cmd produced no output"

        [[ $d == "$PWD" ]] && d='./'
        relative_path=${d/"$PWD/"//}

        echo -e "$(tput smso)  $relative_path  $(tput sgr0)\n$output\n"
    done
}

# Returns list of sorted and unique containing directories from a list of files.
# files_to_dirs "<files>"
files_to_dirs() {
    : "${1? 'ERROR: files_to_dirs "<files>"'}"
    [[ $# -gt 1 ]] && echo 'ERROR: files_to_dirs takes only one argument'

    declare -a files
    mapfile -t files <<<"$1"

    local path
    path=$(pwd)

    declare -a dirs

    for file in ${files[*]}; do
        if [ -n "${file##*/*}" ]; then
            dirs+=("$path")
        else
            dirs+=("$path/${file%/*}")
        fi
    done

    printf "%s\n" "${dirs[@]}" | sort -bu
}

# exits 1 if the provided named ref is not valid.
# is_ref_valid <git-ref>
is_ref_valid() {
    : "${1? 'Error: verify_ref needs an argument.'}"
    ref=$1

    git rev-parse --quiet --verify "$ref" &>/dev/null && return 0

    echo "ERROR: $ref, is not a valid git ref." && return 1
}

# Determines the closest common ansester from two git refs with a default
# strategy of 'fork-point'
# get_concestor <LEFT_REF> <RIGHT_REF> [STRATEGY]
get_concestor() {
    : "${1? 'ERROR: get_chagned_files *<left_ref>* <right_ref>'}"
    : "${2? 'ERROR: get_chagned_files <left_ref> *<right_ref>*'}"

    local left_ref=$1
    local right_ref=$2
    local strategy=${3:-'fp'}
    local concestor

    is_ref_valid "$left_ref" || echo 'ERROR: left_ref is not a valid git ref.'
    is_ref_valid "$right_ref" || echo 'ERROR: right_ref is not a valid git ref.'
    [[ $strategy == 'fp' ]] && concestor=$(git merge-base --fork-point "$left_ref" "$right_ref")

    echo "$concestor"
}

# Returns a list of files with diffs between two git refs with optional glob.
# get_chagned_files <left_ref> <right_ref> [glob]
get_chagned_files() {
    : "${1? 'ERROR: get_chagned_files *<left_ref>* <right_ref> [glob]'}"
    : "${2? 'ERROR: get_chagned_files <left_ref> *<right_ref>* [glob]'}"

    local left_ref=$1
    local right_ref=$2
    local glob=${3:-':/**'}

    is_ref_valid "$left_ref" || echo "ERROR: left_ref is not a valid git ref."
    is_ref_valid "$right_ref" || echo "ERROR: right_ref is not a valid git ref."

    git diff --name-only "$left_ref".."$right_ref" -- "$glob"
}

# Returns the verified git reference to target. Defaults to current HEAD.
# get_source_ref [branch name]
get_source_ref() {
    local ref=${1:-}

    [[ -z "$ref" ]] && git symbolic-ref --short HEAD && exit

    [[ -n "$ref" ]] && is_ref_valid "$ref" && echo "$ref" && return 0

    echo "ERROR: $ref, is not a valid source git ref." && exit 1
}

# Returns the verified git reference to target. Defaults to next|master|main.
# get_target_ref [branch name]
get_target_ref() {
    local ref=${1:-}
    local defaultTargets=('next' 'master' 'main')

    if [[ -z $ref ]]; then
        for t in "${defaultTargets[@]}"; do
            git rev-parse --quiet --verify "$t" &>/dev/null && echo "$t" && exit
        done
    fi

    ! is_ref_valid "$ref" && echo "ERROR: $ref, is not a valid target git ref." && exit 1

    echo "$ref"
}

main "$@"
