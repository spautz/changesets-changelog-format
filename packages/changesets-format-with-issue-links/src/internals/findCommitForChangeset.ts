import path from 'node:path';
import type { NewChangesetWithCommit } from '@changesets/types';

import type { GitlogOptions } from '../options.js';
import { getGitlogFn } from './getGitlogFn.js';

type GitlogCommit = Awaited<ReturnType<ReturnType<typeof getGitlogFn>>>[number];

const findCommitForChangeset = async (
  changesetEntry: NewChangesetWithCommit,
  gitlogOptions: GitlogOptions,
): Promise<GitlogCommit | null> => {
  const { id } = changesetEntry;
  const gitlog = getGitlogFn();

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
