import { NewChangesetWithCommit, ModCompWithPackage } from '@changesets/types';
import { getReleaseLine } from './getReleaseLine';
import { UserOptions } from './options';

/**
 * Duplicated verbatim from Changesets
 */
const getDependencyReleaseLine = async (
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[],
  userOptions: UserOptions,
) => {
  if (dependenciesUpdated.length === 0) return '';

  const changesetLinks = await Promise.all(
    changesets.map(async (changeset) => {
      return await getReleaseLine(
        // @TODO: Make summary configurable
        { ...changeset, summary: 'Updated dependencies' },
        'patch',
        userOptions,
      );
    }),
  );

  const updatedDepenenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`,
  );

  const result = [...changesetLinks, ...updatedDepenenciesList].join('\n');
  return result;
};

export { getDependencyReleaseLine };
