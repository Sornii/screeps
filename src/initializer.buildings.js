import {
  pick,
  without,
  take,
  curry,
  difference,
  each,
  map,
  filter,
} from 'lodash';

import { PROFESSIONS } from './professions';

export const initializeBuildings = curry(
  /**
   * Initialize the buildings
   * @param constructionSites
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (constructionSites, worldState) => {
    let { creepsByProfession, creeps, buildings, mainSpawn } = worldState;

    if (!buildings) {
      buildings = {};
    }

    const buildingsIds = Object.keys(buildings);
    const controllerId = mainSpawn.room.controller.id;

    if (!buildingsIds.includes(controllerId)) {
      buildings[controllerId] = {
        isBusy: false,
        builders: [],
        maxOccupation: 2,
      };
    }

    const ids = [...map(constructionSites, 'id'), controllerId];

    const idsToRemove = without(
      difference(buildingsIds, ids),
      controllerId
    );

    buildings = pick(buildings, ids);

    const idsToInsert = difference(ids, buildingsIds);
    each(idsToInsert, (idToInsert) => {
      buildings[idToInsert] = {
        isBusy: false,
        builders: [],
        maxOccupation: 1,
      };
    });

    each(idsToRemove, (idToRemove) => {
      each(creepsByProfession[PROFESSIONS.BUILDER], (builder) => {
        if (builder.memory.buildingId === idToRemove) {
          builder.memory.buildingId = null;
          builder.memory.state = null;
        }
      });
    });

    each(buildings, (building) => {
      building.isBusy = building.builders.length >= building.maxOccupation;
    });

    each(buildings, (building, buildingId) => {
      if (building.builders.length) {
        building.builders = filter(
          building.builders,
          (builder) => !!creeps[builder]
        );
        building.builders = take(building.builders, building.maxOccupation);
        building.isBusy = building.builders.length >= building.maxOccupation;

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
        building.isBusy = building.builders.length >= building.maxOccupation;
      });
    });

    return { ...worldState, buildings };
  }
);
