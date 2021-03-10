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
import { building } from './typedefs';

export const initializeBuildings = curry(
  /**
   * Initialize the buildings
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    let {
      creepsByProfession,
      creeps,
      buildings,
      mainSpawn,
      mainRoom,
    } = worldState;

    const constructionSites = mainRoom.find(FIND_CONSTRUCTION_SITES);

    if (!buildings) {
      buildings = {};
    }

    const buildingsIds = Object.keys(buildings);

    const buildingsToAddFromConstructionSites = constructionSites
      .map((constructionSite) => {
        if (!buildingsIds.includes(constructionSite.id)) {
          return {
            [constructionSite.id]: {
              ...building,
              structureType: constructionSite.structureType,
            },
          };
        }
      })
      .filter(Boolean);

    const buildingToAddFromController = (() => {
      const controllerId = mainSpawn.room.controller.id;
      if (!buildingsIds.includes(controllerId)) {
        return {
          [controllerId]: {
            ...building,
            maxOccupation: 2,
          },
        };
      }
    })();

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

    const newBuildings = [
      ...buildings,
      ...buildingsToAddFromConstructionSites,
      buildingToAddFromController,
    ].filter(Boolean);

    each(idsToRemove, (idToRemove) => {
      each(creepsByProfession[PROFESSIONS.BUILDER], (builder) => {
        if (builder.memory.buildingId === idToRemove) {
          builder.memory.buildingId = null;
          builder.memory.state = null;
        }
      });
    });

    return {
      ...worldState,
      buildings: newBuildings,
    };
  }
);
