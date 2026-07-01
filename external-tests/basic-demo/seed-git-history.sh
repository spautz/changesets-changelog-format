#!/usr/bin/env bash

# Seed a tiny git history so Changesets can resolve `main` and the formatter can
# find the commit that introduced each changeset entry, even though the demo runs
# in an isolated Docker container. The commit dates are fixed so the generated
# hashes stay stable across image rebuilds.

###################################################################################################
# Standard setup for all external-test scripts

SCRIPT_PATH=${BASH_SOURCE[0]:-$0}
SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
THIS_SCRIPT_NAME=$(basename "$SCRIPT_PATH")

echo "### Begin ${THIS_SCRIPT_NAME}"

# Fail if anything in here fails
set -euo pipefail

# Always run from the script dir
pushd "$SCRIPT_DIR"

###################################################################################################
# Main body

git init
git config user.email "changesets-demo@example.com"
git config user.name "Changesets Demo"
git config commit.gpgsign false

mv .changeset/neat-books-poke.md /tmp/neat-books-poke.md
git add -A
GIT_AUTHOR_DATE="2000-01-01T00:00:00Z" GIT_COMMITTER_DATE="2000-01-01T00:00:00Z" git commit -m "Initial demo state"

if [ "$(git branch --show-current)" != "main" ]; then
  git branch main
fi

git checkout -b demo-release
mv /tmp/neat-books-poke.md .changeset/neat-books-poke.md
printf '\n// Demo-only source change for the pending release.\n' >> src/index.ts
git add .changeset/neat-books-poke.md
git add src/index.ts
GIT_AUTHOR_DATE="2000-01-01T00:00:01Z" GIT_COMMITTER_DATE="2000-01-01T00:00:01Z" git commit -m "Add minor changes (#123)"

###################################################################################################
# Standard teardown for all scripts

popd
echo "### End ${THIS_SCRIPT_NAME}"
