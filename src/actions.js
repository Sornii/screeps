import { PROFESSIONS } from './professions';
import { filter } from 'lodash';
import { minerAction } from "./miner";

export const muleAction = (creep) => {};
export const builderAction = (creep) => {};

export const ACTIONS = {
  [PROFESSIONS.MINER]: minerAction,
  [PROFESSIONS.MULE]: muleAction,
  [PROFESSIONS.BUILDER]: builderAction,
};

export const action = (creep, worldState) => {
  return ACTIONS[creep.memory.profession](creep, worldState);
};
