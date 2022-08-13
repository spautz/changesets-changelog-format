const { hasOwnProperty } = Object.prototype;

const processTemplate = (template: string | null, data: Record<string, unknown>): string => {
  if (!template) {
    return '';
  } else if (!template.includes('$')) {
    return template;
  } else {
    // Replace any vars (excluding `\$`) with their data
    return template.replace(/(?!\\\$)\$(\w+)/g, (_matchedText, varName) => {
      if (!hasOwnProperty.call(data, varName)) {
        throw new Error(
          `Invalid template variable: ${JSON.stringify(
            varName,
          )}. Please use \\$ if this is not a variable.`,
        );
      }

      return '' + data[varName];
    });
  }
};

export { processTemplate };
