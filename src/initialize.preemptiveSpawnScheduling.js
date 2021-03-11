import { countBy, curry } from 'lodash';

export const initializePreemptiveSpawnScheduling = curry(
  /**
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { creeps, countByProfession } = worldState;

    return {
      ...worldState,
      countByProfession,
    };
  }
);
