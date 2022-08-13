import { NewChangesetWithCommit } from '@changesets/types';
import gitlog, { GitlogOptions } from 'gitlog';
import path from 'node:path';

import { findRepoRoot } from './findRepoRoot';
import { Options } from './options';

type GitlogInfo = {
  // Fields from the commit
  hash: string;
  abbrevHash: string;
  subject: string;
};

export type CommitInfo = GitlogInfo & {
  // Metadata and context
  issueNum: string | null;
};

export type IssueInfo = Record<string, never>;

let defaultGitlogOptions: GitlogOptions<keyof GitlogInfo>;
const getDefaultGitlogOptions = async (): Promise<GitlogOptions<keyof GitlogInfo>> => {
  if (!defaultGitlogOptions) {
    defaultGitlogOptions = {
      repo: await findRepoRoot(),
      number: 1,
      fields: ['hash', 'abbrevHash', 'subject'] as Array<keyof GitlogInfo>,
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
    if (!commits || !commits.length) {
      return null;
    }

    const commitInfo = {
      ...commits[0],
      issueNum: null,
    };

    // @TODO
    // commitInfo.issueNum = null;

    return commitInfo;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export { findCommitForChangeset, getDefaultGitlogOptions };
