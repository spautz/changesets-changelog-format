import { NewChangesetWithCommit, VersionType } from '@changesets/types';

import { findCommitForChangeset } from './internals/findCommitForChangeset';
import { processTemplate } from './internals/processTemplate';
import { Options, defaultOptions } from './options';

const getReleaseLine = async (
  changeset: NewChangesetWithCommit,
  _type: VersionType,
  options: Partial<Options> | null,
): Promise<string> => {
  const optionsWithDefaults = options
    ? {
        ...defaultOptions,
        ...options,
      }
    : defaultOptions;
  const { commitTemplate, commitMissingTemplate, issueTemplate, issueMissingTemplate } =
    optionsWithDefaults;

  const commitInfo = await findCommitForChangeset(changeset, optionsWithDefaults);

  const [firstLine, ...futureLines] = changeset.summary.split('\n').map((l) => l.trimEnd());

  const issueMatch = firstLine.match(/\(#\d+\)/);
  if (issueMatch) {
    commitInfo.issueNum = issueMatch[0].substring(1);
  }

  // @TODO: typings
  const templateData = {
    ...optionsWithDefaults,
    ...commitInfo,
  };

  let returnVal = `- ${firstLine}`;
  if (commitInfo) {
    // Append issue, if present
    if (commitInfo.issueNum) {
      returnVal += processTemplate(issueTemplate, templateData);
    } else {
      returnVal += processTemplate(issueMissingTemplate, templateData);
    }

    // Append commit, if present
    returnVal += processTemplate(commitTemplate, templateData);
  } else {
    returnVal += processTemplate(commitMissingTemplate, templateData);
  }

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map((l) => `  ${l}`).join('\n')}`;
  }

  return returnVal;
};

export { getReleaseLine };
