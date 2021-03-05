import { createCreep } from './professions';
import { each, countBy } from 'lodash';

const roomName = 'E48N13';
const spawnName = 'Spawn1';

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  const spawn = Game.spawns[spawnName];
  const room = Game.rooms[roomName];
  const creeps = Game.creeps;

  const worldState = {
    roomConstructionSites: spawn.room.find(FIND_CONSTRUCTION_SITES),
    professionPopulation: Memory.creepsControl,
  };

  const countByProfession = countBy(creeps, 'profession');

  each(worldState.professionPopulation, (population, profession) => {
    if (countByProfession[profession] < population) {
      const [configuration, result] = createCreep(profession);
      console.log(`Created ${profession} with configuration ${configuration}. The result is ${result}`);
    }
  });
};
