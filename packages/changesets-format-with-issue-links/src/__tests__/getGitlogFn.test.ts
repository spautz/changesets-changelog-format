import { describe, expect, test } from 'vitest';

import { getGitlogFnFromModule } from '../internals/getGitlogFn.js';

describe('getGitlogFnFromModule', () => {
  test('accepts direct function exports', () => {
    const gitlogFn = async () => [];

    expect(getGitlogFnFromModule(gitlogFn)).toBe(gitlogFn);
  });

  test('accepts default function exports', () => {
    const gitlogFn = async () => [];

    expect(getGitlogFnFromModule({ default: gitlogFn })).toBe(gitlogFn);
  });

  test('rejects unsupported module shapes', () => {
    expect(() => getGitlogFnFromModule({ default: 'nope' })).toThrow(
      'Unsupported gitlog export shape',
    );
  });
});
