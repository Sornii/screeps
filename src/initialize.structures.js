import { curry } from 'lodash';

export const initializeStructures = curry(
  /**
   * Initialize the buildings
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { mainRoom } = worldState;

    const structures = mainRoom.find(FIND_STRUCTURES);

    return {
      ...worldState,
      structures,
    };
  }
);
