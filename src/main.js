import { sortBy, reduce } from 'lodash';
// import { Map } from 'immutable';

import { population } from './population';
import { death } from './dies';
import { actions } from './actions';
// import { viewer } from './viewer';
import { hookWithdraw } from './hooks';
import { initializeState } from './initializer.state';
import { initializeBuildings } from './initializer.buildings';
import { pipe, timedPipe } from './pipe';
import { writeMemory } from './write';
import { initializeDefaultCreepOrder } from './professions';
import { initializeSourceMining } from './initializer.sourceMining';
import { initializeByProfession } from './initializer.byProfession';
import { initializeStructures } from './initialize.structures';
import { initializeTowers } from './initialize.towers';
import { initializePopulationPriority } from './initialize.populationPriority';
import { initializeCountByProfession } from './initialize.countByProfession';
import { ALL_STATES, WORLD_STATE_BUCKET } from "./constants";
import { energyOrders } from './energyOrders';
import { initializeStructuresByType } from './initialize.structures.byType';
import { timed } from './timed';

const roomName = 'W8N26';
const spawnName = 'Spawn1';

// tests immutable
// const myMap = Map({ a: 1 });
// const myNewMap = myMap.set('b', 2);

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  pipe(
    ...timed({
      start: Game.cpu.getUsed,
      end: Game.cpu.getUsed,
      calc: (start, end) => end - start,
      format: (time) => `${time} CPU time`,
    })(
      initializeStructures,
      initializeStructuresByType,
      initializeTowers,
      initializeDefaultCreepOrder,
      initializeByProfession,
      initializeCountByProfession,
      initializeState(ALL_STATES),
      initializeSourceMining,
      initializeBuildings,
      initializePopulationPriority,
      energyOrders,
      population,
      hookWithdraw,
      death,
      actions,
      // viewer,
      writeMemory(ALL_STATES)
    )
  )({
    creeps: Game.creeps,
    mainSpawn: Game.spawns[spawnName],
    mainRoom: Game.rooms[roomName],
    energyOrders: [],
  });

  for (const i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
};
