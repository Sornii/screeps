import { runMiner } from './runMiner';
import { createCreep } from './professions';
import { each, countBy } from 'lodash';
import { dies } from "./dies";
import { action } from "./actions";

const roomName = 'E48N13';
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
    mainSpawn: spawn,
  };

  const countByProfession = countBy(creeps, 'memory.profession');

  console.log(`Current population ${JSON.stringify(countByProfession)}`);

  // Seed population
  each(worldState.professionPopulation, (maxPopulation, profession) => {
    const currentPopulation = countByProfession[profession];
    if (currentPopulation == null || currentPopulation < maxPopulation) {
      const [configuration, result] = createCreep(profession, spawn);
      console.log(`Created ${profession} with configuration ${configuration}. The result is ${result}`);
    }
  });

  each(creeps, (creep) => {
    if (creep.ticksToLive === 0) {
      dies(creep, worldState);
    }
  })

  each(creeps, (creep) => {
    if (creep.ticksToLive !== 0) {
      action(creep, worldState);
    }
  })
};
