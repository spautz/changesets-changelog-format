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
  const linesAfterFirst = futureLines.length
    ? `\n${futureLines.map((l) => `  ${l}`).join('\n')}`
    : '';

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
    issueMatch: null,
    options: systemOptions,
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
  if (commitInfo?.subject && issuePattern && issueTemplate) {
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

  return processTemplate(changesetTemplate, templateData);
};

export { getReleaseLine };
