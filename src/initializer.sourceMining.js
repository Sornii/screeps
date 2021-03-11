import { curry, mapValues } from 'lodash';
import { isBusy } from './isBusy';

export const initializeSourceMining = curry((worldState) => {
  const { creeps, sourceMining } = worldState;

  return {
    ...worldState,
    sourceMining: mapValues(sourceMining, (config) => {
      return {
        ...config,
        isBusy:
          config.isBusy != null
            ? config.isBusy
            : isBusy(config, { attrs: ['miners'] }),
        isWithMule: config.isWithMule != null ? config.isWithMule : null,
        mule: creeps[config.mule] ? config.mule : null,
        miners: config.miners != null ? config.miners : [],
      };
    }),
  };
});
