import get from 'lodash/get';
import has from 'lodash/has';

/**
 * Match simple variables, like `$foo`
 */
const simpleVariableRegex = /(?!\\\$)\$(\w+)/g;

/**
 * Match wrapped variables, like `${foo.bar}`
 */
const wrappedVariableRegex = /(?!\\\$)\${([^}]+)}/g;

const processVariable = (
  data: Record<string, unknown>,
  _matchedText: string,
  varName: string,
): string => {
  if (has(data, varName)) {
    return '' + get(data, varName);
  } else {
    throw new Error(
      `Invalid template variable: ${JSON.stringify(
        varName,
      )}. Please use \\$ if this is not a variable.`,
    );
  }
};

const processTemplate = (template: string | null, data: Record<string, unknown>): string => {
  if (!template) {
    return '';
  } else if (!template.includes('$')) {
    return template;
  } else {
    // Replace any vars (excluding `\$`) with their data
    const replacerFn = processVariable.bind(null, data);
    return template
      .replace(simpleVariableRegex, replacerFn)
      .replace(wrappedVariableRegex, replacerFn);
  }
};

export { processTemplate };
