import { curry } from 'lodash';

export const initializeTowers = curry(
  /**
   * Initialize the buildings
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

    otherStructures.sort((a, b) => {
      return a.hits - b.hits;
    });

    towers.forEach((tower) => {
      otherStructures.forEach((structure) => {
        if (structure.hits < 5_000) {
          if (tower.repair(structure) < 0) {
            console.log(
              `Tower tried to repair ${structure.name} but no success.`
            );
          }
        }
      });
    });

    return {
      ...worldState,
      towers,
    };
  }
);
