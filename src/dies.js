import { PROFESSIONS } from './professions';

export const minerDeath = (creep) => {};
export const muleDeath = (creep) => {};
export const builderDeath = (creep) => {};

export const DEATHS = {
  [PROFESSIONS.MINER]: minerDeath,
  [PROFESSIONS.MULE]: muleDeath,
  [PROFESSIONS.BUILDER]: builderDeath,
};

export const dies = (creep) => {
  return DEATHS[creep.memory.profession](creep);
};
