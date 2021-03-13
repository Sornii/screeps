import { curry, groupBy } from 'lodash';
import { initializeStructures } from "./initialize.structures";

export const initializeStructuresByType = curry(
  /**
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { structures } = worldState;

    const structuresByType = groupBy(structures, 'structureType');

    return {
      ...worldState,
      structuresByType,
    };
  }
);

initializeStructuresByType.timedName = 'initializeStructuresByType';
