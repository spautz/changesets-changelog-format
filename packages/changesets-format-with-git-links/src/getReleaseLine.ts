import { NewChangesetWithCommit, VersionType } from '@changesets/types';

import { findCommitForChangeset } from './internals/findCommitForChangeset';
import { processTemplate } from './internals/processTemplate';
import { UserOptions, processOptions } from './options';

const getReleaseLine = async (
  changeset: NewChangesetWithCommit,
  _type: VersionType,
  userOptions: UserOptions,
): Promise<string> => {
  const systemOptions = processOptions(userOptions);

  const {
    // @TODO: changesetTemplate,
    commitTemplate,
    commitMissingTemplate,
    gitlogOptions,
    issuePattern,
    issueTemplate,
    issueMissingTemplate,
    ...otherOptions
  } = systemOptions;

  const commitInfo = await findCommitForChangeset(changeset, gitlogOptions);
  const { subject } = commitInfo;

  // Transform pattern strings into real Regexes
  if (issuePattern) {
    const issueRegex = new RegExp(issuePattern);
    const issueMatch = subject.match(issueRegex);
    if (issueMatch) {
      commitInfo.issue = issueMatch[1];
    }
  }

  const [firstLine, ...futureLines] = changeset.summary.split('\n').map((l) => l.trimEnd());

  // @TODO: typings
  const templateData = {
    ...otherOptions,
    ...commitInfo,
  };

  // @TODO: make this overrideable
  let returnVal = `- ${firstLine}`;
  if (commitInfo) {
    // Append issue, if present
    if (commitInfo.issue) {
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
