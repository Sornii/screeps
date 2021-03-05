import { roll } from './dice';

const name = 'Miner';

const STATES = {
  MOVING_TO_MINE: 'movingToMine',
  MOVING_TO_STORE: 'movingToStore',
  STORING: 'storing',
  MINING: 'mining',
  IDLE: 'idle',
};

/**
 * Give birth to a miner and put it to work
 * @param {StructureSpawn} spawn
 * @param {string} surname
 */
export const runMiner = (spawn, surname = '') => {
  const fullName = surname ? `${name} ${surname}` : name;

  const miner = Game.creeps[fullName];

  if (!miner) {
    spawn.spawnCreep([WORK, WORK, MOVE, CARRY], fullName, {
      memory: {
        profession: 'miner',
      },
    });
    return;
  }

  if (miner.spawning) {
    return;
  }

  if (miner.memory.state === STATES.IDLE) {
    return;
  }

  let mine = Game.getObjectById(miner.memory.mine);

  if (!mine) {
    const activeSources = spawn.room.find(FIND_SOURCES_ACTIVE);
    mine = activeSources[roll(activeSources.length)];
    miner.memory.mine = mine.id;
  }


};
