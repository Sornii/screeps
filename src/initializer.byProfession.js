import { groupBy } from 'lodash';

export const initializeByProfession = curry((worldState) => {
  const { creeps } = worldState;

  const creepsByProfession = groupBy(creeps, 'memory.profession');

  return {
    ...worldState,
    creepsByProfession,
  };
});
