#!/usr/bin/env bash

# Ensures that the generated changelog includes the appropriate issue and commit links,
# from the pending changes in `./changesets/`.
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

# The Docker image seeds a minimal git repo for Changesets to inspect.
git rev-parse --is-inside-work-tree >/dev/null
git rev-parse --verify main >/dev/null

###################################################################################################
# Main body

pnpm run release:prep;

# Were the changes what we expected?
if ! diff -u ./CHANGELOG-expected.md ./CHANGELOG.md; then
  echo
  echo "### Changelog check failed"
  echo "git status:"
  git status --short
  exit 1
fi

###################################################################################################
# Standard teardown for all external-test scripts

popd
echo "### End external-test ${EXTERNAL_TEST_NAME} ${THIS_SCRIPT_NAME}"
