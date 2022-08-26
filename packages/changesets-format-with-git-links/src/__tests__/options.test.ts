import { describe, expect, test } from 'vitest';

import { defaultOptions, processOptions } from '../options';

describe('processOptions', () => {
  test('clones defaults if no overrides are given', () => {
    const mergedOptions = processOptions(null);

    expect(mergedOptions).toEqual(defaultOptions);
    expect(mergedOptions).not.toBe(defaultOptions);
  });
  test('merges options with defaults', () => {
    const mergedOptions = processOptions({
      repoBaseUrl: 'https://github.com/spautz/changesets-changelog-format',
      randomNewOption: 123,
    });

    expect(mergedOptions).toEqual({
      ...defaultOptions,
      repoBaseUrl: 'https://github.com/spautz/changesets-changelog-format',
      randomNewOption: 123,
    });
    expect(mergedOptions).not.toBe(defaultOptions);
  });

  test('deep-merges gitlog options and fields', () => {
    const mergedOptions = processOptions({
      repoBaseUrl: 'https://github.com/spautz/changesets-changelog-format',
      randomNewOption: 123,
      gitlogOptions: {
        fields: ['subject', 'body', 'rawBody'],
      },
    });

    expect(mergedOptions).toEqual({
      ...defaultOptions,
      repoBaseUrl: 'https://github.com/spautz/changesets-changelog-format',
      randomNewOption: 123,
      gitlogOptions: {
        ...defaultOptions.gitlogOptions,
        fields: [
          // Overrides before defaults
          'subject',
          'body',
          'rawBody',
          'authorEmail',
          'authorDate',
        ],
      },
    });
    expect(mergedOptions).not.toBe(defaultOptions);
  });
});
