import { getReleaseLine } from './getReleaseLine';
import { getDependencyReleaseLine } from './getDependencyReleaseLine';
import { ChangelogFunctions } from '@changesets/types';

/**
 * This is the changelog formatter that Changesets sees.
 * All other exports from this library are for reference only.
 */
const changelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
} as ChangelogFunctions;

// All of these exports are for convenience only
export * from './internals/findCommitForChangeset';
export * from './internals/processTemplate';
export * from './getReleaseLine';
export * from './getDependencyReleaseLine';
export * from './options';

export default changelogFunctions;
