import { curry, mapValues } from 'lodash';

export const initializeSourceMining = curry((worldState) => {
  const { creeps, sourceMining } = worldState;

  return {
    ...worldState,
    sourceMining: mapValues(sourceMining, (config) => {
      return {
        ...config,
        mule: creeps[config.mule] ? config.mule : null,
      };
    }),
  };
});
