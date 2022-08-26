import { describe, expect, test } from 'vitest';

import defaultPackageExport from '../index';

describe('package', () => {
  test('exports what Changesets expects', () => {
    expect(defaultPackageExport).toBeTruthy();

    expect(defaultPackageExport.getReleaseLine).toBeTruthy();
    expect(typeof defaultPackageExport.getReleaseLine).toBe('function');
    expect(defaultPackageExport.getDependencyReleaseLine).toBeTruthy();
    expect(typeof defaultPackageExport.getDependencyReleaseLine).toBe('function');
  });
});
