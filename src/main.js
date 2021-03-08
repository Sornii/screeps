import { each } from 'lodash';

import { population } from './population';
import { dies } from './dies';
import { action } from './actions';

const roomName = 'E38N53';
const spawnName = 'Spawn1';

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  const spawn = Game.spawns[spawnName];
  const room = Game.rooms[roomName];
  const creeps = Game.creeps;

  const worldState = {
    roomConstructionSites: spawn.room.find(FIND_CONSTRUCTION_SITES),
    professionPopulation: Memory.professionPopulation,
    sourceMining: Memory.sourceMining,
    muleOrders: Memory.muleOrders,
    buildings: Memory.buildings,
    creeps: Game.creeps,
    mainSpawn: spawn,
    mainRoom: room,
  };

  population(worldState);

  each(creeps, (creep) => {
    if (creep.ticksToLive === 1) {
      dies(creep, worldState);
    }
  });

  each(creeps, (creep) => {
    if (creep.ticksToLive !== 0) {
      action(creep, worldState);
    }
  });

  for (const i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
};
