import { difference, each, map } from 'lodash';

import { population } from './population';
import { dies } from './dies';
import { action } from './actions';
import { viewer } from './viewer';
import { hookWithdraw } from './hooks';

const roomName = 'W44N3';
const spawnName = 'Spawn1';

const initializeBuildings = (constructionSites) => {
  let buildings = Memory.buildings;

  if (!buildings) {
    Memory.buildings = {};
    buildings = Memory.buildings;
  }

  const buildingsIds = Object.keys(buildings);

  const ids = map(constructionSites, 'id');
  const idsToInsert = difference(ids, buildingsIds);
  each(idsToInsert, (idToInsert) => {
    buildings[idToInsert] = {
      isBusy: false,
      builders: [],
      maxOccupation: 1,
    };
  });
  return buildings;
};

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  const spawn = Game.spawns[spawnName];
  const room = Game.rooms[roomName];
  const creeps = Game.creeps;

  const constructionSites = room.find(FIND_CONSTRUCTION_SITES);

  const buildings = initializeBuildings(constructionSites);

  const worldState = {
    roomConstructionSites: spawn.room.find(FIND_CONSTRUCTION_SITES),
    professionPopulation: Memory.professionPopulation,
    sourceMining: Memory.sourceMining,
    muleOrders: Memory.muleOrders,
    buildings: buildings,
    creeps: Game.creeps,
    roads: Memory.roads,
    mainSpawn: spawn,
    mainRoom: room,
  };

  worldState.isSpawnWithdrawable =
    population(worldState) !== ERR_NOT_ENOUGH_RESOURCES;

  hookWithdraw(worldState);

  each(creeps, (creep) => {
    if (creep.ticksToLive === 1) {
      dies(creep, worldState);
    }
  });

  each(creeps, (creep) => {
    if (creep.ticksToLive !== 1) {
      action(creep, worldState);
    }
  });

  viewer(worldState);

  for (const i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
};
