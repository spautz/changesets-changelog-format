import { CommitField, GitlogOptions as DefaultGitlogOptions } from 'gitlog';
import merge from 'lodash/merge';
import uniq from 'lodash/uniq';

// the default GitlogOptions typing only allows the default field names: this one supports all valid ones
export type GitlogOptions = DefaultGitlogOptions<CommitField>;

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

// A fake recursive partial of UserOptions, allowing arbitrary keys at the root.
// And sometimes `null` because options aren't mandatory.
export type UserOptions = Partial<
  Omit<SystemOptions, 'gitlogOptions'> & {
    gitlogOptions?: Partial<SystemOptions['gitlogOptions']>;
    [newKey: string]: unknown;
  }
> | null;

// @TODO: Docs
const defaultOptions: SystemOptions = {
  repoBaseUrl: 'https://example.com',

  changesetTemplate: '- ${changesetTitle}${issue}${commit}${changesetBody}',

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
  //   template: ' ([#$pullRequest]($repoBaseUrl/pull/$pullRequest))',
  //   nullTemplate: '',
  // },

  gitlogOptions: {
    repo: '.',
    // https://github.com/domharrington/node-gitlog#user-content-optional-fields
    fields: ['hash', 'abbrevHash', 'authorName', 'authorEmail', 'authorDate', 'subject'],
    includeMergeCommitFiles: true,
  },
};

const processOptions = (overrides: UserOptions): SystemOptions => {
  // Merge options, then dedupe any gitlog fields
  const optionsWithDefaults: SystemOptions = merge({}, defaultOptions, overrides);
  optionsWithDefaults.gitlogOptions.fields = uniq(optionsWithDefaults.gitlogOptions.fields);

  return optionsWithDefaults;
};

export { defaultOptions, processOptions };
