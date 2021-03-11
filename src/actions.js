import { PROFESSIONS } from './professions';
import { minerAction } from './miner';
import { muleAction } from './mule';
import { builderAction } from './builder';

export const ACTIONS = {
  [PROFESSIONS.MINER]: minerAction,
  [PROFESSIONS.MULE]: muleAction,
  [PROFESSIONS.BUILDER]: builderAction,
};

export const action = (creep, worldState) => {
  if (!Object.values(PROFESSIONS).includes(creep.memory.profession)) {
    console.log(
      `Profession ${creep.memory.profession} not found for ${creep.name}`
    );
    return worldState;
  }
  return ACTIONS[creep.memory.profession](creep, worldState);
};
