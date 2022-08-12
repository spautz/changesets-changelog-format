import { NewChangesetWithCommit } from '@changesets/types';
import gitlog, { GitlogOptions } from 'gitlog';
import path from 'node:path';

import { findRepoRoot } from './findRepoRoot';
import { Options } from './options';

export type CommitInfo = {
  hash: string;
  abbrevHash: string;
  subject: string;
};

let defaultGitlogOptions: GitlogOptions<keyof CommitInfo>;
const getDefaultGitlogOptions = async (): Promise<GitlogOptions<keyof CommitInfo>> => {
  if (!defaultGitlogOptions) {
    defaultGitlogOptions = {
      repo: await findRepoRoot(),
      number: 1,
      fields: ['hash', 'abbrevHash', 'subject'] as Array<keyof CommitInfo>,
      includeMergeCommitFiles: true,
    };
  }
  return defaultGitlogOptions;
};

const findCommitForChangeset = async (
  changesetEntry: NewChangesetWithCommit,
  _options: Options,
): Promise<CommitInfo | null> => {
  const { id } = changesetEntry;

  try {
    // @TODO: Split between modes: predefined commit, file-add, file-update

    const commits = gitlog({
      ...(await getDefaultGitlogOptions()),
      file: `.changeset${path.sep}${id}.md`,
    });
    return commits.length ? commits[0] : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export { findCommitForChangeset, getDefaultGitlogOptions };
