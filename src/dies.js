import { PROFESSIONS } from './professions';
import { minerDeath } from './miner';
import { muleDeath } from './mule';
import { builderDeath } from './builder';
import { curry, reduce, sortBy } from 'lodash';

export const DEATHS = {
  [PROFESSIONS.MINER]: minerDeath,
  [PROFESSIONS.MULE]: muleDeath,
  [PROFESSIONS.BUILDER]: builderDeath,
};

export const dies = (creep, worldState) => {
  return DEATHS[creep.memory.profession](creep, worldState);
};

export const death = curry(
  /**
   * Creep death
   * @param {WorldState} worldState
   * @return WorldState
   */
  (worldState) => {
    const { creeps } = worldState;
    return reduce(
      sortBy(creeps, 'creep.memory.order'),
      (state, creep) => {
        if (creep.ticksToLive === 1) {
          return dies(creep, state);
        }
        return state;
      },
      worldState
    );
  }
);

death.timedName = 'death';
