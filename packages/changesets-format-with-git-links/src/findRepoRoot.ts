import path from 'node:path';
import { findUp, pathExists } from 'find-up';

/**
 * Starting from the current directory, hronously walks up until it finds the `.git` directory.
 */
const findRepoRoot = async (): Promise<string> => {
  const repoRoot = await findUp(
    async (directory) => {
      const hasGitDir = await pathExists(path.join(directory, '.git'));
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

  return repoRoot;
};

export { findRepoRoot };
