import { NewChangesetWithCommit, VersionType } from '@changesets/types';

import { findCommitForChangeset } from './findCommitForChangeset';
import { Options, defaultOptions } from './options';

// @TODO: typings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processTemplate = (template: string | undefined, _data: any): string => {
  if (!template) {
    return '';
  } else if (!template.includes('$')) {
    return template;
  } else {
    // Replace any vars (excluding `\$`) with their data
    return template.replace(/(!?\\\$)\$/g, (...args) => {
      console.log('replacer', ...args);
      return args[0];
    });
  }
};

const getReleaseLine = async (
  changeset: NewChangesetWithCommit,
  _type: VersionType,
  options: Options | null,
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

  // @TODO: typings
  const templateData = {
    ...optionsWithDefaults,
    ...commitInfo,
  };

  let returnVal = `- ${firstLine}  ${commitInfo ? `[${commitInfo.abbrevHash}]: ` : ''}`;
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

  console.log(' => ', JSON.stringify(returnVal));
  return returnVal;
};

export { getReleaseLine };
