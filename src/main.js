import { reduce, curry, difference, each, map } from 'lodash';

import { population } from './population';
import { dies } from './dies';
import { action } from './actions';
import { viewer } from './viewer';
import { hookWithdraw } from './hooks';
import { initializeState } from './initializers/state';
import { initializeBuildings } from './initializers/buildings';
import { pipe } from './pipe';
import { writeMemory } from "./write";

const roomName = 'W8N26';
const spawnName = 'Spawn1';

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  pipe(
    initializeState([
      'professionPopulation',
      'sourceMining',
      'muleOrders',
      'roads',
      'buildings'
    ]),
    (worldState) => {
      const { room } = worldState;
      const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
      return initializeBuildings(constructionSites)(worldState);
    },
    population,
    hookWithdraw,
    (worldState) => {
      const { creeps } = worldState;
      return reduce(
        creeps,
        (state, creep) => {
          if (creep.ticksToLive === 1) {
            return dies(creep, state);
          }
          return state;
        },
        worldState
      );
    },
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
    },
    viewer,
    writeMemory([
      'professionPopulation',
      'sourceMining',
      'muleOrders',
      'roads',
      'buildings'
    ])
  )({
    creeps: Game.creeps,
    mainSpawn: Game.spawns[spawnName],
    mainRoom: Game.rooms[roomName],
  });

  for (const i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
};
