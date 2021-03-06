import { PROFESSIONS } from './professions';
import { minerDeath } from './miner';

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
