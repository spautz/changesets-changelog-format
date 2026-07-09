# Demo: `changesets-format-with-issue-links` with Changesets 3.x

[![build status](https://github.com/spautz/changesets-changelog-format/actions/workflows/ci.yml/badge.svg)](https://github.com/spautz/changesets-changelog-format/actions)
[![test coverage](https://img.shields.io/coveralls/github/spautz/changesets-changelog-format/main.svg)](https://coveralls.io/github/spautz/changesets-changelog-format?branch=main)
[![repo vulnerabilities](https://snyk.io/test/github/spautz/changesets-changelog-format/badge.svg)](https://snyk.io/test/github/spautz/changesets-changelog-format)

This is a small demo package that exercises `changesets-format-with-issue-links` against Changesets 3.x.
It's primarily used for CI checks, but it's also a full working demo that you can run locally.

It runs in its own Docker container:

1. The Docker sets up a clean, empty git repo
2. `external-test-checks.sh` makes some code changes and commits them, along with semver-minor changelog entries
3. `pnpm run release:prep` applies the pending changelog entries, updating `CHANGELOG.md`
4. `external-test-checks.sh` then checks `CHANGELOG.md`'s diff to ensure the right content was added

To run locally:
```bash
scripts/run-external-test.sh  demo-changesets-3.x
```

or, to get a shell and play around on your own:
```bash
scripts/run-external-test-interactive.sh  demo-changesets-3.x
```
