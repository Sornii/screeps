import { PROFESSIONS } from './professions';
import { minerAction } from './miner';
import { muleAction } from './mule';
import { builderAction } from './builder';
import { curry, reduce } from 'lodash';

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

export const actions = curry(
  /**
   * Creep action
   * @param {WorldState} worldState
   * @return WorldState
   */
  (worldState) => {
    const { creeps } = worldState;
    return reduce(
      creeps,
      (state, creep) => {
        if (creep.ticksToLive !== 1) {
          return action(creep, state);
        }
        return state;
      },
      worldState
    );
  }
);

actions.timedName = 'actions';
