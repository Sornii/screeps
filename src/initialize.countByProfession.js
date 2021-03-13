import { countBy, curry } from 'lodash';

export const initializeCountByProfession = curry(
  /**
   * Initialize the buildings
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { creeps } = worldState;
    const countByProfession = countBy(creeps, 'memory.profession');

    console.log(`Current population ${JSON.stringify(countByProfession)}`);

    return {
      ...worldState,
      countByProfession,
    };
  }
);

initializeCountByProfession.name = 'initializeCountByProfession';
