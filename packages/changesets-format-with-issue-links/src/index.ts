import type { ChangelogFunctions } from '@changesets/types';
import { getDependencyReleaseLine } from './getDependencyReleaseLine';
import { getReleaseLine } from './getReleaseLine';

/**
 * This is the changelog formatter that Changesets sees.
 * All other exports from this library are for reference only.
 */
const changelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
} as ChangelogFunctions;

export * from './getDependencyReleaseLine';
export * from './getReleaseLine';
// All of these exports are for convenience only
export * from './internals/findCommitForChangeset';
export * from './internals/processTemplate';
export * from './options';

export default changelogFunctions;
