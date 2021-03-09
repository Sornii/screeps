import { without, take, curry, difference, each, map, filter } from 'lodash';
import { PROFESSIONS } from './professions';

export const initializeBuildings = curry((constructionSites, worldState) => {
  let { creepsByProfession, creeps, buildings } = worldState;

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

  each(buildings, (building, buildingId) => {
    if (building.builders.length) {
      building.builders = filter(
        building.builders,
        (builder) => !!creeps[builder]
      );
      building.builders = take(building.builders, building.maxOccupation);
      building.isBusy = building.builders >= building.maxOccupation;

      each(creepsByProfession[PROFESSIONS.BUILDER], (builder) => {
        if (
          !building.builders.includes(builder.name) &&
          builder.memory.buildingId === buildingId
        ) {
          builder.memory.buildingId = null;
          builder.memory.state = null;
        }
      });
    }
  });

  each(creepsByProfession[PROFESSIONS.BUILDER], (builder) => {
    const trueBuildingId = builder.memory.buildingId;
    const falseBuildings = filter(
      buildings,
      (building, buildingId) =>
        building.builders.includes(builder.name) &&
        buildingId !== trueBuildingId
    );
    each(falseBuildings, (building) => {
      building.builders = without(building.builders, builder.name);
      building.isBusy = building.builders >= building.maxOccupation;
    });
  });

  return { ...worldState, buildings };
});
