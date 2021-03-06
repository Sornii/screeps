import { PROFESSIONS } from './professions';
import { minerAction } from "./miner";
import { muleAction } from "./mule";

export const builderAction = (creep) => {};

export const ACTIONS = {
  [PROFESSIONS.MINER]: minerAction,
  [PROFESSIONS.MULE]: muleAction,
  [PROFESSIONS.BUILDER]: builderAction,
};

export const action = (creep, worldState) => {
  if (!Object.values(PROFESSIONS).includes(creep.memory.profession)) {
    console.log(`Profession ${creep.memory.profession} not found for ${creep.name}`);
    return;
  }
  return ACTIONS[creep.memory.profession](creep, worldState);
};
