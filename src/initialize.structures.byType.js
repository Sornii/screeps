import { curry, groupBy } from 'lodash';

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
