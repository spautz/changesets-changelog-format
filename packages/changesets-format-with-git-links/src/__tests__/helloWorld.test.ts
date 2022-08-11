import { describe, expect, test } from 'vitest';

import { helloWorld } from '../index';

describe('helloWorld', () => {
  test.skip('exists', () => {
    expect(helloWorld).toEqual('Hello World!');
  });
});
