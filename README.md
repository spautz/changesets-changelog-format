# Changesets Format with Git Links

A changelog formatter for [Changesets](https://github.com/changesets/changesets) that adds commit and issue/PR links

## IN ACTIVE DEVELOPMENT

**This package has not yet been published.**

[![npm version](https://img.shields.io/npm/v/changesets-format-with-git-links.svg)](https://www.npmjs.com/package/changesets-format-with-git-links)
[![build status](https://github.com/spautz/changesets-format-with-git-links/workflows/CI/badge.svg)](https://github.com/spautz/changesets-format-with-git-links/actions)
[![dependencies status](https://img.shields.io/librariesio/release/npm/changesets-format-with-git-links.svg)](https://libraries.io/github/spautz/changesets-format-with-git-links)
[![test coverage](https://img.shields.io/coveralls/github/spautz/changesets-format-with-git-links/main.svg)](https://coveralls.io/github/spautz/changesets-format-with-git-links?branch=main)

## What is this?

[Atlassian Changesets](https://github.com/changesets/changesets) is a changelog management tool. Its default changelog
format lacks some of the features of other changelog tools, however, such as [standard-version](https://github.com/conventional-changelog/standard-version/blob/master/CHANGELOG.md)
and [Release Please](https://github.com/googleapis/release-please/blob/main/CHANGELOG.md).

This package uses the content from your Changesets changelog entries, but adds links to the git commits, issues, and pull requests
which are associated with those entries. The result is similar to other changelog tools.

## Setup

If you have already set up Changesets, you only need to install the package and add it to your `.changeset/config.json`.

You do _not_ need to enable the `commit` option in your config.

```shell
npm install --save-dev changesets-format-with-git-links
```

```json lines
// .changeset/config.json
{
  "changelog": "changesets-format-with-git-links"
}
```

## Options

(Docs pending)

```json lines
// .changeset/config.json
{
  "changelog": [
    "changesets-format-with-git-links",
    {
      // options go here
    }
  ]
}
```

## How it works

(Docs pending)
