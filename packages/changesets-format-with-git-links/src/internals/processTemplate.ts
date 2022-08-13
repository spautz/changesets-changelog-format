const { hasOwnProperty } = Object.prototype;

const processTemplate = (template: string | undefined, data: Record<string, unknown>): string => {
  if (!template) {
    return '';
  } else if (!template.includes('$')) {
    return template;
  } else {
    // Replace any vars (excluding `\$`) with their data
    return template.replace(/(?!\\\$)\$\w+/g, (token) => {
      const varName = token.substring(1);
      if (!hasOwnProperty.call(data, varName)) {
        throw new Error(
          `Invalid template variable: ${JSON.stringify(
            token,
          )}. Please use \\$ if this is not a variable.`,
        );
      }

      return '' + data[varName];
    });
  }
};

export { processTemplate };
