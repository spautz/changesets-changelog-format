import path from 'node:path';

/**
 * Starting from the current directory, hronously walks up until it finds the `.git` directory.
 */
const findRepoRoot = async (): Promise<string> => {
  const { findUp, pathExists } = await import('find-up');

  const repoRoot = await findUp(
    async (directory) => {
      const hasGitDir = await pathExists(path.join(directory, '.changeset'));
      if (hasGitDir) {
        return directory;
      }
      return undefined;
    },
    { type: 'directory' },
  );

  if (!repoRoot) {
    throw new Error('Unable to find repo root');
  }

  // return repoRoot;
  return __dirname;
};

export { findRepoRoot };
