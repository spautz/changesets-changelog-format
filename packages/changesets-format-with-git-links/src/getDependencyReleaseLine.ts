import { NewChangesetWithCommit, ModCompWithPackage } from '@changesets/types';

/**
 * Duplicated verbatim from Changesets
 */
const getDependencyReleaseLine = async (
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[],
) => {
  if (dependenciesUpdated.length === 0) return '';

  const changesetLinks = changesets.map(
    (changeset) => `- Updated dependencies${changeset.commit ? ` [${changeset.commit}]` : ''}`,
  );

  const updatedDepenenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`,
  );

  const result = [...changesetLinks, ...updatedDepenenciesList].join('\n');
  console.log(' => ', JSON.stringify(result));
  return result;
};

export { getDependencyReleaseLine };
