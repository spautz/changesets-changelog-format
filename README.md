# Changesets Format with Git Links

A changelog formatter for [Changesets](https://github.com/changesets/changesets) that adds commit and issue/PR links

[![npm version](https://img.shields.io/npm/v/changesets-format-with-git-links.svg)](https://www.npmjs.com/package/changesets-format-with-git-links)
[![build status](https://github.com/spautz/changesets-format-with-git-links/workflows/CI/badge.svg)](https://github.com/spautz/changesets-format-with-git-links/actions)
[![dependencies status](https://img.shields.io/librariesio/release/npm/changesets-format-with-git-links.svg)](https://libraries.io/github/spautz/changesets-format-with-git-links)
[![test coverage](https://img.shields.io/coveralls/github/spautz/changesets-format-with-git-links/main.svg)](https://coveralls.io/github/spautz/changesets-format-with-git-links?branch=main)

## What is this?

[Atlassian Changesets](https://github.com/changesets/changesets) is a changelog management tool. Its default changelog formatter
generates a plain list of changes.

**This package adds links to the git commits, issues, and pull requests where your changesets were added.**

The result is comparable to the output of other common changelog managers, such as [standard-version](https://github.com/conventional-changelog/standard-version/blob/master/CHANGELOG.md)
and [Release Please](https://github.com/googleapis/release-please/blob/main/CHANGELOG.md).

## Setup

If you have already set up Changesets, you only need to install the package and add it to your `.changeset/config.json`.

You do _not_ need to enable the `commit` option in your config.

```shell
npm install --save-dev changesets-format-with-git-links
```

```json lines
// .changeset/config.json
{
  "changelog": [
    "changesets-format-with-git-links",
    {
      /* options here */
    }
  ]
}
```

## Options

#### `repoCommitBaseUrl` (required)

The base url -- including `https` -- which should be used for commit links. Example: `"https://github.com/spautz/changesets-format-with-git-links/commit"`

#### `repoIssueBaseUrl` (required)

The base url -- including `https` -- which should be used for issue links. Example: `"https://github.com/spautz/changesets-format-with-git-links/issues"`

#### `commitTemplate` (default: `" ([$abbrevHash]($repoCommitBaseUrl/$hash))"`)

Text to add to the changeset entry for a commit. See `gitlogOptions` below for information on the available fields.

#### `noCommitTemplate` (default: `""`)

Text to add to the changeset entry when no commit could be found. This should generally be left blank.

#### `issuePattern` (default: `"#(\\d+)\\)"`)

Regular expression (without the leading and trailing `/`) used to identify issues and pull requests in the subject line of a commit message.
The default will match a number immediately followed by a closing parentheses, like `#4)`.

If the commit message matches this pattern, the text inside the capturing group (`()`) will be available as `$issueNum` in the `issueTemplate`, below.

#### `issueTemplate` (default: `" ([#$issueNum]($repoIssueBaseUrl/$issueNum))"`)

Text to add to the changeset entry for an issue or pull request. See `gitlogOptions` below for information on the available fields.

#### `noIssueTemplate` (default: `""`)

Text to add to the changeset entry when no issue or pull request could be found. This should generally be left blank.

#### `gitlogOptions`

Default:

```json
{
  "repo": ".",
  "number": 1,
  "fields": ["hash", "abbrevHash", "subject"],
  "includeMergeCommitFiles": true
}
```

Options passed to [gitlog](https://github.com/domharrington/node-gitlog) ([see docs here](https://github.com/domharrington/node-gitlog#options)).

This can be used to [add additional `fields`](https://github.com/domharrington/node-gitlog#optional-fields) to the template, or to change the
behavior of the git log search.

## How it works

This works by identifying the git commit when a changeset entry was added or updated, looking for an issue number,
and then using templates to append the git links (commit and issue number, if present) to the changelog entry.

## Template variables

Inside `commitTemplate`, `noCommitTemplate`, `issueTemplate`, and `noIssueTemplate`, any token that starts with `$` will be treated
as a variable. Use `\\$` to escape the dollar sign character if you do not want it to be treated as a variable.

All fields from the git commit (such as `$hash`, `$abbrevHash`, and anything you added to `gitlogOptions.fields`) are available
as template variables, along with any other values from the options (such as `$repoCommitBaseUrl`), including custom or unrecognized options.
