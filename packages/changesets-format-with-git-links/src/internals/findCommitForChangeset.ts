import { NewChangesetWithCommit } from '@changesets/types';
import gitlog from 'gitlog';
import path from 'node:path';

import { Options } from '../options';

const findCommitForChangeset = async (
  changesetEntry: NewChangesetWithCommit,
  options: Options,
): Promise<ReturnType<typeof gitlog> | null> => {
  const { id } = changesetEntry;
  const { gitlogOptions } = options;

  // @TODO: Split between modes: predefined commit, file-add, file-update

  const commits = gitlog({
    ...gitlogOptions,
    file: `.changeset${path.sep}${id}.md`,
  });
  if (!commits || !commits.length) {
    return null;
  }

  return commits[0];
};

export { findCommitForChangeset };
