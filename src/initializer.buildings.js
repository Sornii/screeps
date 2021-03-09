import { curry, difference, each, map } from 'lodash';

export const initializeBuildings = curry((constructionSites, worldState) => {
  let { buildings } = worldState;

  if (!buildings) {
    buildings = {};
  }

  const buildingsIds = Object.keys(buildings);

  const ids = map(constructionSites, 'id');
  const idsToInsert = difference(ids, buildingsIds);
  each(idsToInsert, (idToInsert) => {
    buildings[idToInsert] = {
      isBusy: false,
      builders: [],
      maxOccupation: 1,
    };
  });

  return { ...worldState, buildings };
});
