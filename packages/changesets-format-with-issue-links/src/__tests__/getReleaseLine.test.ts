import type { NewChangesetWithCommit } from '@changesets/types';
import type gitlog from 'gitlog';
import { has } from 'lodash-es';
import { afterAll, describe, expect, test, vi } from 'vitest';

import { getReleaseLine } from '../getReleaseLine.js';

// This is used to mock gitlog
const mockCommitsById: Record<string, Awaited<ReturnType<typeof gitlog>> | null> = {
  'no-commit-found': null,
  'commit-with-issue': [
    {
      status: 'A',
      hash: '1234567890abcdef1234567890abcdef12345678',
      abbrevHash: '1234567',
      subject: 'feat: improve changelog output (#42)',
    },
  ],
  'commit-without-issue': [
    {
      status: 'A',
      hash: 'abcdef1234567890abcdef1234567890abcdef12',
      abbrevHash: 'abcdef1',
      subject: 'feat: improve changelog output',
    },
  ],
  'commit-without-subject': [
    {
      status: 'A',
      hash: 'fedcba9876543210fedcba9876543210fedcba98',
      abbrevHash: 'fedcba9',
    },
  ],
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

describe('getReleaseLine', () => {
  afterAll(() => {
    vi.resetAllMocks();
  });

  test('generates default content when no commit is found', async () => {
    const releaseLine = await getReleaseLine(
      {
        id: 'no-commit-found',
        summary: 'Untraceable changes',
        releases: [],
      },
      'patch',
      null,
    );

    expect(releaseLine).toEqual('- Untraceable changes');
  });

  test('renders multi-line summaries with issue and commit links', async () => {
    const releaseLine = await getReleaseLine(
      {
        id: 'commit-with-issue',
        summary: 'Improve changelog output\nwith extra detail\nand final note',
        releases: [],
      },
      'minor',
      null,
    );

    expect(releaseLine).toEqual(
      '- Improve changelog output ([#42](https://example.com/issues/42)) ([1234567](https://example.com/commit/1234567890abcdef1234567890abcdef12345678))\n  with extra detail\n  and final note',
    );
  });

  test('uses missing issue template when subject does not match issue pattern', async () => {
    const releaseLine = await getReleaseLine(
      {
        id: 'commit-without-issue',
        summary: 'Improve changelog output',
        releases: [],
      },
      'patch',
      {
        issueMissingTemplate: ' [missing issue]',
      },
    );

    expect(releaseLine).toEqual(
      '- Improve changelog output [missing issue] ([abcdef1](https://example.com/commit/abcdef1234567890abcdef1234567890abcdef12))',
    );
  });

  test('uses missing commit template when commit template is disabled', async () => {
    const releaseLine = await getReleaseLine(
      {
        id: 'commit-with-issue',
        summary: 'Improve changelog output',
        releases: [],
      },
      'patch',
      {
        commitTemplate: null,
        commitMissingTemplate: ' [missing commit]',
      },
    );

    expect(releaseLine).toEqual(
      '- Improve changelog output ([#42](https://example.com/issues/42)) [missing commit]',
    );
  });

  test('uses missing issue template when commit subject is missing', async () => {
    const releaseLine = await getReleaseLine(
      {
        id: 'commit-without-subject',
        summary: 'Improve changelog output',
        releases: [],
      },
      'patch',
      {
        issueMissingTemplate: ' [missing issue]',
      },
    );

    expect(releaseLine).toEqual(
      '- Improve changelog output [missing issue] ([fedcba9](https://example.com/commit/fedcba9876543210fedcba9876543210fedcba98))',
    );
  });

  test('uses missing issue template when issue matching is disabled', async () => {
    const baseChangeset: NewChangesetWithCommit = {
      id: 'commit-with-issue',
      summary: 'Improve changelog output',
      releases: [],
    };

    const releaseLineWithoutPattern = await getReleaseLine(baseChangeset, 'patch', {
      issuePattern: null,
      issueMissingTemplate: ' [missing issue]',
    });

    expect(releaseLineWithoutPattern).toEqual(
      '- Improve changelog output [missing issue] ([1234567](https://example.com/commit/1234567890abcdef1234567890abcdef12345678))',
    );

    const releaseLineWithoutTemplate = await getReleaseLine(baseChangeset, 'patch', {
      issueTemplate: null,
      issueMissingTemplate: ' [missing issue]',
    });

    expect(releaseLineWithoutTemplate).toEqual(
      '- Improve changelog output [missing issue] ([1234567](https://example.com/commit/1234567890abcdef1234567890abcdef12345678))',
    );
  });
});
