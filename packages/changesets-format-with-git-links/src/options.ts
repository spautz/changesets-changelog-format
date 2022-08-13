// @TODO: Docs
export type Options = {
  repoCommitBaseUrl?: string;
  repoIssueBaseUrl?: string;
  commitTemplate?: string;
  commitMissingTemplate?: string;
  issueTemplate?: string;
  issueMissingTemplate?: string;
};

// @TODO: Docs
const defaultOptions: Options = {
  repoCommitBaseUrl: 'https://example.com/commit',
  repoIssueBaseUrl: 'https://example.com/issues',
  // Default: a github-style commit link inside parentheses
  // "([6ecbcfc](https://github.com/spautz/changesets-format-with-git-links/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  // "([6ecbcfc](https://github.com/spautz/changesets-format-with-git-links/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  commitTemplate: ' ([$abbrevHash]($repoCommitBaseUrl/$hash))',
  commitMissingTemplate: '',
  // Default: a github-style issue link inside parentheses
  // "([#1](https://github.com/spautz/changesets-format-with-git-links/issues/1))"
  // "([#1](https://github.com/spautz/changesets-format-with-git-links/issues/1))"
  issueTemplate: ' ([#$issueNum]($repoIssueBaseUrl/\\$/$issueNum))',
  issueMissingTemplate: '',
};

export { defaultOptions };
