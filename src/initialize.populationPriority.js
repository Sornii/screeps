import { curry } from 'lodash';
import { PROFESSIONS } from './professions';

export const initializePopulationPriority = curry(
  /**
   * Initialize the buildings
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { countByProfession, professionPopulation } = worldState;

    if (
      countByProfession[PROFESSIONS.MULE] <
      professionPopulation[PROFESSIONS.MULE]
    ) {
      return {
        ...worldState,
        professionPopulation: {
          mule: 1,
        },
      };
    }

    return worldState;
  }
);

initializePopulationPriority.name = 'initializePopulationPriority';
