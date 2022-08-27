import { NewChangesetWithCommit } from '@changesets/types';
import { gitlogPromise } from 'gitlog';
import path from 'node:path';

import { GitlogOptions } from '../options';

const findCommitForChangeset = async (
  changesetEntry: NewChangesetWithCommit,
  gitlogOptions: GitlogOptions,
): Promise<ReturnType<typeof gitlogPromise> | null> => {
  const { id } = changesetEntry;

  // @TODO: Split between modes: predefined commit, file-add, file-update

  const commits = await gitlogPromise({
    ...gitlogOptions,
    file: `.changeset${path.sep}${id}.md`,
  });

  if (!commits || !commits.length) {
    return null;
  }

  return commits.find((commit) => commit.status.includes('A')) || null;
};

export { findCommitForChangeset };
