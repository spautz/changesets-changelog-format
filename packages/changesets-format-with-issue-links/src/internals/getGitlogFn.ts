import gitlogModule from 'gitlog';

type GitlogFn = typeof import('gitlog').default;

const getGitlogFnFromModule = (moduleValue: unknown): GitlogFn => {
  if (typeof moduleValue === 'function') {
    return moduleValue as GitlogFn;
  }

  if (
    moduleValue &&
    typeof moduleValue === 'object' &&
    'default' in moduleValue &&
    typeof moduleValue.default === 'function'
  ) {
    return moduleValue.default as GitlogFn;
  }

  throw new TypeError('Unsupported gitlog export shape');
};

const getGitlogFn = (): GitlogFn => {
  return getGitlogFnFromModule(gitlogModule as unknown);
};

export { getGitlogFn, getGitlogFnFromModule };
