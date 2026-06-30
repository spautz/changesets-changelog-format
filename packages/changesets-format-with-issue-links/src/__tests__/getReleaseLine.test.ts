import type { NewChangesetWithCommit, VersionType } from '@changesets/types';
import type gitlog from 'gitlog';
import { has } from 'lodash-es';
import { afterAll, describe, expect, test, vi } from 'vitest';

import { getReleaseLine } from '../getReleaseLine.js';
import type { UserOptions } from '../options.js';

// This is used to mock gitlog
const mockCommitsById: Record<string, ReturnType<typeof gitlog> | null> = {
  'no-commit-found': null,
};

vi.mock('gitlog', () => ({
  default: async ({ file }: { file: string }) => {
    // Reverse-engineer the original changeset id from the filename:
    // this mock is tightly coupled to the implementation in internals/findCommitForChangeset.ts
    const idMatch = file.match(/^\.changeset.([-a-z0-9]+)\.md$/);
    if (!idMatch?.[1]) {
      throw new Error(`Internal test error: could not parse file id from "${file}"`);
    }

    const id = idMatch[1];
    if (!has(mockCommitsById, id)) {
      throw new Error(`Internal test error: could not find mock commit for id "${id}"`);
    }

    return mockCommitsById[id];
  },
}));

const testCases: Array<{
  changeset: NewChangesetWithCommit;
  type: VersionType;
  options: UserOptions;
  expectedOutput: string;
}> = [
  {
    changeset: {
      id: 'no-commit-found',
      summary: 'Untraceable changes',
      releases: [],
    },
    type: 'patch',
    options: null,
    expectedOutput: '- Untraceable changes',
  },
];

describe('getReleaseLine', () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  test.each(testCases)('generates default content (testCases[%#])', async (testCase) => {
    const { changeset, type, options, expectedOutput } = testCase;
    const releaseLine = await getReleaseLine(changeset, type, options);

    expect(releaseLine).toEqual(expectedOutput);
  });
});
