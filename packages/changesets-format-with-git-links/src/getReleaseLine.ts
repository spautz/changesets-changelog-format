import { NewChangesetWithCommit, VersionType } from '@changesets/types';

import { findCommitForChangeset } from './internals/findCommitForChangeset';
import { processTemplate } from './internals/processTemplate';
import { UserOptions, processOptions } from './options';

const getReleaseLine = async (
  changeset: NewChangesetWithCommit,
  type: VersionType,
  userOptions: UserOptions,
): Promise<string> => {
  const systemOptions = processOptions(userOptions);

  // Process changeset info

  const [firstLine, ...futureLines] = changeset.summary.split('\n').map((l) => l.trimEnd());
  const linesAfterFirst = `\n${futureLines.map((l) => `  ${l}`).join('\n')}`;

  const changesetInfo = {
    ...changeset,
    changesetTitle: firstLine,
    changesetBody: linesAfterFirst,
    changesetRawBody: changeset.summary,
    versionType: type,
  };

  // Process options

  const {
    changesetTemplate,
    commitTemplate,
    commitMissingTemplate,
    gitlogOptions,
    issuePattern,
    issueTemplate,
    issueMissingTemplate,
    ...otherOptions
  } = systemOptions;

  const commitInfo = await findCommitForChangeset(changeset, gitlogOptions);

  const templateData = {
    ...changesetInfo,
    ...commitInfo,
    ...otherOptions,
    changesetInfo,
    commitInfo,
  };

  // Process commitTemplate
  templateData.commit = commitMissingTemplate;
  if (commitInfo && commitTemplate) {
    templateData.commit = processTemplate(commitTemplate, {
      ...templateData,
      commit: commitInfo.hash,
    });
  }

  // Process issueTemplate
  templateData.issue = issueMissingTemplate;
  templateData.issueMatch = null;
  if (issuePattern && issueTemplate) {
    const issueRegex = new RegExp(issuePattern);
    const issueMatch = commitInfo.subject.match(issueRegex);
    if (issueMatch) {
      templateData.issueMatch = issueMatch;
      templateData.issue = processTemplate(issueTemplate, {
        ...templateData,
        issue: issueMatch[1],
      });
    }
  }

  console.log('templateData = ', templateData);

  return processTemplate(changesetTemplate, templateData);

  /*
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

   */
};

export { getReleaseLine };
