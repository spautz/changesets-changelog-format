import path from 'node:path';
import type { NewChangesetWithCommit } from '@changesets/types';
import gitlog from 'gitlog';

import type { GitlogOptions } from '../options.js';

const findCommitForChangeset = async (
  changesetEntry: NewChangesetWithCommit,
  gitlogOptions: GitlogOptions,
): Promise<ReturnType<typeof gitlog> | null> => {
  const { id } = changesetEntry;

  // @TODO: Split between modes: predefined commit, file-add, file-update

  const commits = await gitlog({
    ...gitlogOptions,
    file: `.changeset${path.sep}${id}.md`,
  });

  if (!commits?.length) {
    return null;
  }

  return commits.find((commit) => commit.status.includes('A')) || null;
};

export { findCommitForChangeset };
