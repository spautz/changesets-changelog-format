import { findUpSync, pathExistsSync } from 'find-up';
import path from 'node:path';

/**
 * Starting from the current directory, synchronously walks up until it finds the `.git` directory.
 */
const findRepoRoot = (): string => {
  const repoRoot = findUpSync(
    (directory) => {
      const hasGitDir = pathExistsSync(path.join(directory, '.git'));
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
