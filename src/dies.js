import { remove } from 'lodash';

import { PROFESSIONS } from './professions';

export const minerDeath = (creep, worldState) => {
  const { sourceMining } = worldState;

  const sourceId = creep.memory.sourceId;
  let config = sourceMining[sourceId];
  if (!config.maxOccupation && !config.miners && config.isBusy == null) {
    sourceMining[sourceId] = {
      isBusy: false,
      miners: [],
      maxOccupation: 1,
    };
  } else {
    remove(config.miners, id => creep.id === id);
  }
  config.isBusy = config.miners.length >= config.maxOccupation;
};

export const muleDeath = (creep) => {};
export const builderDeath = (creep) => {};

export const DEATHS = {
  [PROFESSIONS.MINER]: minerDeath,
  [PROFESSIONS.MULE]: muleDeath,
  [PROFESSIONS.BUILDER]: builderDeath,
};

export const dies = (creep, worldState) => {
  return DEATHS[creep.memory.profession](creep, worldState);
};
