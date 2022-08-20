// @TODO: Docs
import { GitlogOptions } from 'gitlog';

export type UserOptions = {
  repoBaseUrl: string;

  changesetTemplate: string;

  commitTemplate: string | null;
  commitMissingTemplate: string | null;

  issuePattern: string | null;
  issueTemplate: string | null;
  issueMissingTemplate: string | null;

  gitlogOptions: GitlogOptions;
};

export type SystemOptions = UserOptions & {
  issueRegex: RegExp;
};

// @TODO: Docs
const defaultOptions: UserOptions = {
  repoBaseUrl: 'https://example.com',

  changesetTemplate: '- $firstLine$issueContent$commitContent$rest',

  // Default: a github-style commit link inside parentheses
  // "([6ecbcfc](https://example.com/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  // "([6ecbcfc](https://github.com/spautz/changesets-changelog-format/commit/6ecbcfca21152a929393a7c5fc7184b34122bbe5))"
  commitTemplate: ' ([$abbrevHash]($repoBaseUrl/commit/$hash))',
  commitMissingTemplate: '',

  // Number with closing parens, like `#4)`
  issuePattern: '#(\\d+)\\)',
  // Default: a github-style issue link inside parentheses
  // "([#1](https://example.com/issues/1))"
  // "([#1](https://github.com/spautz/changesets-changelog-format/issues/1))"
  issueTemplate: ' ([#$issueNum]($repoBaseUrl/issues/$issueNum))',
  issueMissingTemplate: '',

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
  if (optionsWithDefaults.issuePattern) {
    optionsWithDefaults.issueRegex = new RegExp(optionsWithDefaults.issuePattern);
  }

  return optionsWithDefaults;
};

export { defaultOptions, processOptions };
