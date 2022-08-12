import { ChangelogFunctions } from '@changesets/types';

import { getReleaseLine } from './getReleaseLine';
import { getDependencyReleaseLine } from './getDependencyReleaseLine';

/**
 * This is the changelog formatter that Changesets sees.
 * All other exports from this library are for reference only.
 */
const changelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
} as ChangelogFunctions;

export { changelogFunctions };
