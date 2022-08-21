# Changesets Format with Git Links

A changelog formatter for [Changesets](https://github.com/changesets/changesets) that adds commit and issue/PR links

[![npm version](https://img.shields.io/npm/v/changesets-format-with-git-links.svg)](https://www.npmjs.com/package/changesets-format-with-git-links)
[![build status](https://github.com/spautz/changesets-changelog-format/workflows/CI/badge.svg)](https://github.com/spautz/changesets-changelog-format/actions)
[![dependencies status](https://img.shields.io/librariesio/release/npm/changesets-format-with-git-links.svg)](https://libraries.io/github/spautz/changesets-format-with-git-links)
[![test coverage](https://img.shields.io/coveralls/github/spautz/changesets-changelog-format/main.svg)](https://coveralls.io/github/spautz/changesets-changelog-format?branch=main)

## What is this?

[Atlassian Changesets](https://github.com/changesets/changesets) is a changelog management tool. Its default changelog
formatter only generates a plain list of changes.

This package adds links to the git commits, issues, and pull requests where your changesets were added.

The result is similar to the output of other common changelog managers, such as
[standard-version](https://github.com/conventional-changelog/standard-version/blob/master/CHANGELOG.md)
and [Release Please](https://github.com/googleapis/release-please/blob/main/CHANGELOG.md).

## Setup

If you have already set up Changesets, you only need to install the package and add it to your `.changeset/config.json`.

You do _not_ need to enable the `commit` option in your config.

```shell
npm install --save-dev changesets-format-with-git-links
```

```
// .changeset/config.json
{
  "changelog": [
    "changesets-format-with-git-links",
    {
      "repoBaseUrl": "https://github.com/your-username/repo",
      // This will inject issue and commit links to the end of the first line of your changeset message
      "changesetTemplate": "- ${changesetTitle}${issue}${commit}${changesetBody}"
    }
  ]
}
```

## Options

#### `repoBaseUrl` (required)

A base url -- including `https` -- which can be used to build links in `commitTemplate` and `issueTemplate`.
Example: `"https://github.com/spautz/changesets-changelog-format"`

#### `changesetTemplate` (default: `"- ${changesetTitle}${issue}${commit}${changesetBody}"`)

Content that will be added to your changelog.

With the deafult value, issue and commit links will be inserted at the end of the first line of your changeset message.

See `commitTemplate` for the `$commit` variable, `issueTemplate` for the `$issue` variable, and [Template Variables](#template-variables)
for other available values.

#### `commitTemplate` (default: `" ([$abbrevHash]($repoBaseUrl/commit/$hash))"`)

Content for the `$commit` variable, based on the commit when the changeset was created.
See `gitlogOptions` below for information on the available fields from the commit.

#### `commitMissingTemplate` (default: `""`)

Content for the `$commit` variable when no commit could be found. This should generally be left blank.

#### `issuePattern` (default: `"#(\\d+)\\)"`)

Regular expression (without the leading and trailing `/`) used to identify issues and pull requests in the subject line
of a commit message. The default will match a number immediately followed by a closing parentheses, like `#4)`.

If the commit message matches this pattern, the Regex result will be available as `$issueMatch` and the text inside the
capturing group (`(\d+)` in the default) will be available as `$issue` in the `issueTemplate`, below.

#### `issueTemplate` (default: `" ([#$issue]($repoBaseUrl/issues/$issue))"`)

Content for the `$issue` variable, based on the value matched by `issuePattern`.

#### `issueMissingTemplate` (default: `""`)

Content for the `$issue` variable when no issue or pull request could be found. This should generally be left blank.

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

This can be used to [add additional `fields`](https://github.com/domharrington/node-gitlog#user-content-optional-fields) to the template, or to change the
behavior of the git log search.

## How it works

This works by identifying the git commit when a changeset entry was added or updated, looking for an issue number,
and then using templates to append the git links (commit and issue number, if present) to the changelog entry.

## Template variables

Inside any of the templates (`changesetTemplate`, `commitTemplate`, `commitMissingTemplate`, `issueTemplate`, or `issueMissingTemplate`),
any token that starts with `$` or which is wrapped within `${...}` will be treated as a variable.

Use `\\$` to escape the dollar sign character if you do not want it to be treated as a variable.

### Available variables

Information from the changeset entry:

- `$changesetTitle`
- `$changesetBody`
- `$changesetRawBody`
- `$versionType`
- `$changesetInfo` contains all of the above, and any other [information from Changesets](https://github.com/changesets/changesets/blob/main/packages/types/src/index.ts#L28-L31)
  (e.g., `${changesetInfo.changesetTitle}`, `${changesetInfo.versionType}`).

Information from the git commit when the changeset was added or modified:

- `$hash`
- `$abbrevHash`
- `$summary`
- Anything you requested via [`gitlogOptions.fields`](#gitlogoptions)
- `$commit` is generated from `commitTemplate` (or `commitMissingTemplate` if the commit was not found)
- `$commitInfo` contains all of the above (e.g., `${commitInfo.abbrevHash}`, `${commitInfo.hash}`).

Information from the matched issue pattern, if any:

- `$issue` is generated from `issueTemplate` (or `issueMissingTemplate` if no issue not found)
- `$issueMatch` contains all of the results from the match against `issuePattern` (e.g., `${issueMatch[1]}`})

And also any additional values you added to the options in your `.changeset/config.json` (such as `$repoBaseUrl`)
