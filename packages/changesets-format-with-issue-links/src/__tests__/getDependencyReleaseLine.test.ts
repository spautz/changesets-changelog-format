import type { ModCompWithPackage, NewChangesetWithCommit } from '@changesets/types';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const { getReleaseLineMock } = vi.hoisted(() => ({
  getReleaseLineMock: vi.fn(),
}));

vi.mock('../getReleaseLine.js', () => ({
  getReleaseLine: getReleaseLineMock,
}));

import { getDependencyReleaseLine } from '../getDependencyReleaseLine.js';

describe('getDependencyReleaseLine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns empty string when no dependencies were updated', async () => {
    const result = await getDependencyReleaseLine([], [], null);

    expect(result).toBe('');
    expect(getReleaseLineMock).not.toHaveBeenCalled();
  });

  test('formats dependency release lines from linked changesets and updated packages', async () => {
    const changesets: NewChangesetWithCommit[] = [
      { id: 'first', summary: 'ignored summary', releases: [] },
      { id: 'second', summary: 'ignored summary', releases: [] },
    ];
    const dependenciesUpdated: ModCompWithPackage[] = [
      { name: 'alpha', newVersion: '1.2.3', type: 'patch' },
      { name: 'beta', newVersion: '4.5.6', type: 'minor' },
    ] as ModCompWithPackage[];

    getReleaseLineMock.mockResolvedValueOnce('- Updated dependencies (first)');
    getReleaseLineMock.mockResolvedValueOnce('- Updated dependencies (second)');

    const userOptions = { repoBaseUrl: 'https://repo.example' };
    const result = await getDependencyReleaseLine(changesets, dependenciesUpdated, userOptions);

    expect(result).toBe(
      '- Updated dependencies (first)\n- Updated dependencies (second)\n  - alpha@1.2.3\n  - beta@4.5.6',
    );
  });
});
