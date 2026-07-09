import { describe, expect, test } from 'vitest';

import { processTemplate } from '../internals/processTemplate.js';

describe('processTemplate', () => {
  test('returns empty string for null templates', () => {
    expect(processTemplate(null, {})).toBe('');
  });

  test('returns template unchanged when it has no variables', () => {
    expect(processTemplate('plain text', { value: 'ignored' })).toBe('plain text');
  });

  test('replaces simple and wrapped variables', () => {
    expect(
      // biome-ignore lint/suspicious/noTemplateCurlyInString: Intentional test case
      processTemplate('hello $name from ${meta.team}', {
        name: 'stone',
        meta: { team: 'cave' },
      }),
    ).toBe('hello stone from cave');
  });

  test('throws on unknown variables', () => {
    expect(() => processTemplate('hello $missing', {})).toThrow(
      'Invalid template variable: "missing". Please use \\$ if this is not a variable.',
    );
  });
});
