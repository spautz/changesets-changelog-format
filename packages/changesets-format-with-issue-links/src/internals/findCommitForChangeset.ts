import path from 'node:path';
import type { NewChangesetWithCommit } from '@changesets/types';
import type gitlog from 'gitlog';

import type { GitlogOptions } from '../options.js';

type Gitlog = typeof gitlog;

const loadGitlog = async (): Promise<Gitlog> => {
  const gitlogModule = await import('gitlog');

  return (gitlogModule.default ?? gitlogModule) as Gitlog;
};

const findCommitForChangeset = async (
  changesetEntry: NewChangesetWithCommit,
  gitlogOptions: GitlogOptions,
): Promise<Awaited<ReturnType<Gitlog>> | null> => {
  const { id } = changesetEntry;

  // @TODO: Split between modes: predefined commit, file-add, file-update

  const gitlog = await loadGitlog();
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
