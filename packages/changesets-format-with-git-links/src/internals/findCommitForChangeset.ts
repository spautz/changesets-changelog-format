import { NewChangesetWithCommit } from '@changesets/types';
import { gitlogPromise } from 'gitlog';
import path from 'node:path';

import { SystemOptions } from '../options';

const findCommitForChangeset = async (
  changesetEntry: NewChangesetWithCommit,
  systemOptions: SystemOptions,
): Promise<ReturnType<typeof gitlogPromise> | null> => {
  const { id } = changesetEntry;
  const { gitlogOptions } = systemOptions;

  // @TODO: Split between modes: predefined commit, file-add, file-update

  const commits = await gitlogPromise({
    ...gitlogOptions,
    file: `.changeset${path.sep}${id}.md`,
  });
  if (!commits || !commits.length) {
    return null;
  }

  return commits[0];
};

export { findCommitForChangeset };
