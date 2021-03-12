import { curry, mapValues, difference } from 'lodash';
import { isBusy as calculateIsBusy } from './isBusy';

export const initializeSourceMining = curry((worldState) => {
  const { creeps, sourceMining } = worldState;

  return {
    ...worldState,
    sourceMining: mapValues(sourceMining, (config) => {
      if (
        difference(
          ['isBusy', 'miners', 'maxOccupation'],
          Object.keys(config || {})
        ).length
      ) {
        const miners = config.miners != null ? config.miners : [];
        const maxOccupation =
          config.maxOccupation != null ? config.maxOccupation : 1;
        const mule = creeps[config.mule] ? config.mule : null;
        const isWithMule = config.isWithMule != null ? config.isWithMule : null;
        const isBusy =
          config.isBusy != null
            ? config.isBusy
            : calculateIsBusy({ miners, maxOccupation }, { attrs: ['miners'] });
        return {
          ...config,
          isBusy,
          isWithMule,
          mule,
          miners,
          maxOccupation,
        };
      }
      return config;
    }),
  };
});
