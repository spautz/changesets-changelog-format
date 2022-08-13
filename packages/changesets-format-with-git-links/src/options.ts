// @TODO
export type Options = {
  repoHref?: string;
  commitTemplate?: string;
  commitMissingTemplate?: string;
  issueTemplate?: string;
  issueMissingTemplate?: string;
};

const defaultOptions: Options = {
  repoHref: undefined,
  commitTemplate: ' ([$abbrevHash]($repoHref/commit/$hash))',
  commitMissingTemplate: '',
  issueTemplate: ' ([$issueNum]($repoHref/issues/$issueNum))',
  issueMissingTemplate: '',
};

export { defaultOptions };
