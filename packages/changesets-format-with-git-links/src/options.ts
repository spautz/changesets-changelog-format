// @TODO: Docs
import { GitlogOptions } from 'gitlog';

export type UserOptions = {
  repoCommitBaseUrl: string;
  repoIssueBaseUrl: string;

  commitTemplate: string | null;
  noCommitTemplate: string | null;

  issuePattern: string;
  issueTemplate: string | null;
  noIssueTemplate: string | null;

  gitlogOptions: GitlogOptions;
};

export type SystemOptions = UserOptions & {
  issueRegex: RegExp;
};

// @TODO: Docs
const defaultOptions: UserOptions = {
  repoCommitBaseUrl: 'https://example.com/commit',
  repoIssueBaseUrl: 'https://example.com/issues',

  // Default: a github-style commit link inside parentheses
  // "([6ecbcfc](https://example.com/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  // "([6ecbcfc](https://github.com/spautz/changesets-format-with-git-links/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  commitTemplate: ' ([$abbrevHash]($repoCommitBaseUrl/$hash))',
  noCommitTemplate: '',

  // Number with closing parens, like `#4)`
  issuePattern: '#(\\d+)\\)',
  // Default: a github-style issue link inside parentheses
  // "([#1](https://example.com/issues/1))"
  // "([#1](https://github.com/spautz/changesets-format-with-git-links/issues/1))"
  issueTemplate: ' ([#$issueNum]($repoIssueBaseUrl/$issueNum))',
  noIssueTemplate: '',

  gitlogOptions: {
    repo: '.',
    number: 1,
    fields: ['hash', 'abbrevHash', 'subject'],
    includeMergeCommitFiles: true,
  },
};

const processOptions = (overrides: Partial<UserOptions> | null): SystemOptions => {
  const optionsWithDefaults: SystemOptions = overrides
    ? ({
        ...defaultOptions,
        ...overrides,
        gitlogOptions: {
          ...defaultOptions.gitlogOptions,
          ...overrides.gitlogOptions,
        },
      } as SystemOptions)
    : ({ ...defaultOptions } as SystemOptions);

  // Transform pattern strings into real Regexes
  optionsWithDefaults.issueRegex = new RegExp(optionsWithDefaults.issuePattern);

  return optionsWithDefaults;
};

export { defaultOptions, processOptions };
