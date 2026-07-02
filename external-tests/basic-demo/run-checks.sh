#!/usr/bin/env bash

# Ensures that the generated changelog has the right release shape and commit links.
#
# This script assumes the environment has already been set up (node, pnpm install, etc)

###################################################################################################
# Standard setup for all external-test scripts

SCRIPT_PATH=${BASH_SOURCE[0]:-$0}
EXTERNAL_TEST_DIR=$(cd "$(dirname "$SCRIPT_PATH")" && pwd)
EXTERNAL_TEST_NAME=$(basename "$EXTERNAL_TEST_DIR")
THIS_SCRIPT_NAME=$(basename "$SCRIPT_PATH")

echo "### Begin external-test ${EXTERNAL_TEST_NAME} ${THIS_SCRIPT_NAME}"

# Fail if anything in here fails
set -euo pipefail

# Always run from the external-test dir
pushd "$EXTERNAL_TEST_DIR"

###################################################################################################
# Helpers

create_minor_change() {
  local commit_message="$1"
  local changelog_summary="$2"

  # Work in a feature branch
  local BASE_BRANCH="$(git branch --show-current)"
  local FEATURE_BRANCH="$BASE_BRANCH-temp"
  git checkout -b $FEATURE_BRANCH

  # Touch src/index.ts and add a changelog entry
  sed "s/{CURRENT_TIMESTAMP}/$(date +%s%N)/" src/index.ts.template > src/index.ts
  if ! grep -Eq '^const lastTimestamp = [0-9]+;$' src/index.ts; then
    echo
    echo "### Changelog check failed"
    echo "src/index.ts did not get a rendered timestamp"
    echo "git status:"
    git status --short
    exit 1
  fi

  # `--minor` flag is blocked by https://github.com/changesets/changesets/issues/2134
  #                          and https://github.com/changesets/changesets/pull/2135
  pnpm run changelog:add --minor "@private/external-test--basic-demo" --message "$changelog_summary"

  # Commit and fast-forward
  git add src/index.ts .changeset/*.md
  git status
  git commit -m "$commit_message"

  git checkout $BASE_BRANCH
  git merge $FEATURE_BRANCH --squash
}

assert_diff_contains() {
  local pattern="$1"
  if ! grep -Eq "$pattern" ./CHANGELOG-diff.diff; then
    echo
    echo "### Changelog check failed"
    echo "Missing diff pattern: $pattern"
    echo "git status:"
    git status --short
    exit 1
  fi
}

###################################################################################################
# Main body

create_minor_change "Add first demo change (#101)" "First demo minor change"
FIRST_COMMIT_HASH=$(git rev-parse HEAD)
create_minor_change "Add second demo change (#102)" "Second demo minor change"
SECOND_COMMIT_HASH=$(git rev-parse HEAD)

# Update CHANGELOG.md
pnpm run release:prep

# Now validate the changes that were made
git diff ./CHANGELOG.md > ./CHANGELOG-diff.diff
assert_diff_contains '^\+## 0\.\d+\.0$'
assert_diff_contains '^\+### Minor Changes$'
assert_diff_contains "^\\+.*https://example.com/commit/${FIRST_COMMIT_HASH}"
assert_diff_contains "^\\+.*https://example.com/commit/${SECOND_COMMIT_HASH}"

###################################################################################################
# Standard teardown for all external-test scripts

popd
echo "### End external-test ${EXTERNAL_TEST_NAME} ${THIS_SCRIPT_NAME}"
