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
  local package_name="@private/external-test--demo-changesets-2.x"
  local changeset_file=".changeset/$(date +%s%N)-minor-change.md"

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

  # Changesets 2.x CLI predates `--minor`, so this test writes file by hand.
  cat > "$changeset_file" <<EOF
---
"$package_name": minor
---

$changelog_summary
EOF

  # Commit and fast-forward
  git add src/index.ts "$changeset_file"
  git status
  git commit -m "$commit_message"

  git checkout "$BASE_BRANCH"
  git merge --ff-only "$FEATURE_BRANCH"
  LAST_COMMIT_HASH=$(git rev-parse HEAD)
  git branch -D $FEATURE_BRANCH
}

assert_diff_contains() {
  local pattern="$1"
  if ! grep -Eq "$pattern" ./CHANGELOG-diff.diff; then
    echo
    echo "### Changelog check failed"
    echo "CHANGELOG.md diff:"
    git diff CHANGELOG.md
    echo "Missing diff pattern: $pattern"
    echo "git status:"
    git status --short
    exit 1
  fi
}

###################################################################################################
# Main body

create_minor_change "Add first demo change (#101)" "First demo minor change"
FIRST_COMMIT_HASH="$LAST_COMMIT_HASH"
create_minor_change "Add second demo change (#102)" "Second demo minor change"
SECOND_COMMIT_HASH="$LAST_COMMIT_HASH"

# Update CHANGELOG.md
pnpm run release:prep

# Now validate the changes that were made
git diff ./CHANGELOG.md > ./CHANGELOG-diff.diff
cat ./CHANGELOG-diff.diff
assert_diff_contains '^\+## 0\.[0-9]+\.0$'
assert_diff_contains '^\+### Minor Changes$'
assert_diff_contains "^\\+.*https://example.com/commit/${FIRST_COMMIT_HASH}"
assert_diff_contains "^\\+.*https://example.com/commit/${SECOND_COMMIT_HASH}"
echo "✅️ Changelog-diff checks passed"

###################################################################################################
# Standard teardown for all external-test scripts

popd
echo "### End external-test ${EXTERNAL_TEST_NAME} ${THIS_SCRIPT_NAME}"
