import { PROFESSIONS } from './professions';
import { minerDeath } from './miner';
import { muleDeath } from './mule';
import { builderDeath } from './builder';

export const DEATHS = {
  [PROFESSIONS.MINER]: minerDeath,
  [PROFESSIONS.MULE]: muleDeath,
  [PROFESSIONS.BUILDER]: builderDeath,
};

export const dies = (creep, worldState) => {
  return DEATHS[creep.memory.profession](creep, worldState);
};
