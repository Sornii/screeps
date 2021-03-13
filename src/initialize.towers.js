import { curry, sortBy } from 'lodash';
import { initializeStructures } from "./initialize.structures";

export const initializeTowers = curry(
  /**
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { structures } = worldState;

    /**
     * @type {StructureTower[]}
     */
    const towers = structures.filter(
      (structure) => structure.structureType === STRUCTURE_TOWER
    );

    const otherStructures = structures.filter(
      (structure) => structure.structureType !== STRUCTURE_TOWER
    );

    /** @type {AnyStructure[]} */
    const otherStructuresSortedByHits = sortBy(otherStructures, 'hits');

    towers.forEach((tower) => {
      const hostileCreeps = tower.room.find(FIND_HOSTILE_CREEPS);

      if (hostileCreeps?.length) {
        tower.attack(hostileCreeps[0]);
        return;
      }

      const structure = otherStructuresSortedByHits.find(
        (structure) =>
          structure.hits < 50000 && structure.hits / structure.hitsMax < 0.5
      );

      if (!structure) {
        return;
      }

      if (tower.repair(structure) < 0) {
        console.log(`Tower tried to repair ${structure.id} but no success.`);
      }
    });

    return {
      ...worldState,
      towers,
    };
  }
);

initializeTowers.timedName = 'initializeTowers';
