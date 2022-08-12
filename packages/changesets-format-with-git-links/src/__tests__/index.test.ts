import { describe, expect, test } from 'vitest';

import * as AllPackageExports from '../index';

describe('package', () => {
  test('has a fake test', () => {
    expect(AllPackageExports).toBeTruthy();
  });
});
