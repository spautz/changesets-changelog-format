// @TODO: Docs
import { GitlogOptions } from 'gitlog';

export type SystemOptions = {
  repoBaseUrl: string;

  changesetTemplate: string;

  commitTemplate: string | null;
  commitMissingTemplate: string | null;

  issuePattern: string | null;
  issueTemplate: string | null;
  issueMissingTemplate: string | null;

  gitlogOptions: GitlogOptions;
};

export type UserOptions = Partial<SystemOptions> | null;

// @TODO: Docs
const defaultOptions: SystemOptions = {
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
  issueTemplate: ' ([#$issue]($repoBaseUrl/issues/$issue))',
  issueMissingTemplate: '',

  // @TODO
  // pullRequest: {
  //   pattern: '#(\\d+)\\)',
  //   template: ' ([#$issue]($repoBaseUrl/issues/$issue))',
  //   nullTemplate: '',
  // },

  gitlogOptions: {
    repo: '.',
    number: 1,
    // https://github.com/domharrington/node-gitlog#user-content-optional-fields
    fields: ['hash', 'abbrevHash', 'subject'],
    includeMergeCommitFiles: true,
  },
};

const processOptions = (overrides: UserOptions): SystemOptions => {
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

  return optionsWithDefaults;
};

export { defaultOptions, processOptions };
