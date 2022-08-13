// @TODO: typings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processTemplate = (template: string | undefined, data: any): string => {
  console.log('processTemplate()', template, data);

  if (!template) {
    return '';
  } else if (!template.includes('$')) {
    return template;
  } else {
    // Replace any vars (excluding `\$`) with their data
    return template.replace(/(?!\\\$)\$\w+/g, (token) => {
      const varName = token.substring(1);
      if (!Object.prototype.hasOwnProperty.call(data, varName)) {
        throw new Error(
          `Invalid template variable: ${JSON.stringify(
            token,
          )}. Please use \\$ if this is not a variable.`,
        );
      }

      console.log('replacer', token, data[varName]);

      return data[varName];
    });
  }
};
