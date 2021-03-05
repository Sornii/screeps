import { PROFESSIONS } from './professions';
import { minerAction } from "./miner";

export const muleAction = (creep) => {};
export const builderAction = (creep) => {};

export const ACTIONS = {
  [PROFESSIONS.MINER]: minerAction,
  [PROFESSIONS.MULE]: muleAction,
  [PROFESSIONS.BUILDER]: builderAction,
};

export const action = (creep, worldState) => {
  if (!PROFESSIONS.keys().includes(creep.memory.profession)) {
    console.log(`Profession ${creep.memory.profession} not found for ${creep.name}`);
  }
  return ACTIONS[creep.memory.profession](creep, worldState);
};
