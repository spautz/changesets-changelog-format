import { NewChangesetWithCommit, VersionType } from '@changesets/types';

import { findCommitForChangeset } from './findCommitForChangeset';
import { Options, defaultOptions } from './options';

const getReleaseLine = async (
  changeset: NewChangesetWithCommit,
  _type: VersionType,
  options: Options | null,
) => {
  const optionsWithDefaults = options
    ? {
        ...defaultOptions,
        ...options,
      }
    : defaultOptions;
  const commitInfo = findCommitForChangeset(changeset, optionsWithDefaults);

  const [firstLine, ...futureLines] = changeset.summary.split('\n').map((l) => l.trimEnd());

  let returnVal = `- ${commitInfo ? `[${commitInfo.abbrevHash}]: ` : ''}${firstLine}`;

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
  }

  console.log(' => ', JSON.stringify(returnVal));
  return returnVal;
};

export { getReleaseLine };
