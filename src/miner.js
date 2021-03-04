import { roll } from "./dice";

const name = 'Miner';

/**
 * Give birth to a miner and put it to work
 * @param {StructureSpawn} spawn
 */
export const miner = (spawn) => {
  const miner = Game.creeps[name];

  if (!miner) {
    spawn.spawnCreep([WORK, MOVE, CARRY], name);
    return;
  }

  /**
   * Mining location
   * @type {Source}
   */
  let mine = Game.getObjectById(miner.memory.mine);

  if (!mine) {
    const activeSources = spawn.room.find(FIND_SOURCES_ACTIVE);
    mine = activeSources[roll(activeSources.length)];
    miner.memory.mine = mine.id;
  }

  if (!miner.store.getFreeCapacity()) {
    if (miner.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      miner.moveTo(spawn);
    }
  }

  if (mine) {
    if (miner.harvest(mine) === ERR_NOT_IN_RANGE) {
      miner.moveTo(mine);
    }
  }
};
