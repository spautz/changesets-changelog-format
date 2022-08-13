// @TODO: Docs
import { GitlogOptions } from 'gitlog';

export type Options = {
  repoCommitBaseUrl: string;
  repoIssueBaseUrl: string;

  commitTemplate: string | null;
  commitMissingTemplate: string | null;
  issueTemplate: string | null;
  issueMissingTemplate: string | null;

  gitlogOptions: GitlogOptions;
};

// @TODO: Docs
const defaultOptions: Options = {
  repoCommitBaseUrl: 'https://example.com/commit',
  repoIssueBaseUrl: 'https://example.com/issues',

  // Default: a github-style commit link inside parentheses
  // "([6ecbcfc](https://example.com/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  // "([6ecbcfc](https://github.com/spautz/changesets-format-with-git-links/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  commitTemplate: ' ([$abbrevHash]($repoCommitBaseUrl/$hash))',
  commitMissingTemplate: '',
  // Default: a github-style issue link inside parentheses
  // "([#1](https://example.com/issues/1))"
  // "([#1](https://github.com/spautz/changesets-format-with-git-links/issues/1))"
  issueTemplate: ' ([#$issueNum]($repoIssueBaseUrl/\\$/$issueNum))',
  issueMissingTemplate: '',

  gitlogOptions: {
    repo: '.',
    number: 1,
    fields: ['hash', 'abbrevHash', 'subject'],
    includeMergeCommitFiles: true,
  },
};

export { defaultOptions };
