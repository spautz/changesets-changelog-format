import type { ChangelogFunctions } from '@changesets/types';

import { getDependencyReleaseLine } from './getDependencyReleaseLine.js';
import { getReleaseLine } from './getReleaseLine.js';

/**
 * This is the changelog formatter that Changesets sees.
 * All other exports from this library are for reference only.
 */
const changelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
} as ChangelogFunctions;

export * from './getDependencyReleaseLine.js';
export * from './getReleaseLine.js';
// All of these exports are for convenience only
export * from './internals/findCommitForChangeset.js';
export * from './internals/processTemplate.js';
export * from './options.js';

export default changelogFunctions;
