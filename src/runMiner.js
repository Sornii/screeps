import { roll } from './dice';

const name = 'Miner';

const STATES = {
  MOVING_TO_MINE: 'movingToMine',
  MOVING_TO_STORE: 'movingToStore',
  STORING: 'storing',
  MINING: 'mining',
};

/**
 * Give birth to a miner and put it to work
 * @param {StructureSpawn} spawn
 */
export const runMiner = (spawn) => {
  const miner = Game.creeps[name];

  if (!miner) {
    spawn.spawnCreep([WORK, MOVE, CARRY], name);
    return;
  }

  if (miner.spawning) {
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

  if (!miner.memory.state) {
    if (miner.store.getFreeCapacity() > 0) {
      if (miner.pos.isNearTo(mine.pos)) {
        miner.memory.state = STATES.MINING;
      } else {
        miner.memory.state = STATES.MOVING_TO_MINE;
      }
    } else {
      if (miner.pos.isNearTo(spawn.pos)) {
        miner.memory.state = STATES.STORING;
      } else {
        miner.memory.state = STATES.MOVING_TO_STORE;
      }
    }
  }

  // State-checker
  switch (miner.memory.state) {
    case STATES.MINING:
      if (miner.store.getFreeCapacity() === 0) {
        if (miner.pos.isNearTo(spawn.pos)) {
          miner.memory.state = STATES.STORING;
        } else {
          miner.memory.state = STATES.MOVING_TO_STORE;
        }
      }
      break;
    case STATES.MOVING_TO_MINE:
      if (miner.pos.isNearTo(mine.pos)) {
        miner.memory.state = STATES.MINING;
      } else {
        miner.memory.state = STATES.MOVING_TO_MINE;
      }
      break;
    case STATES.MOVING_TO_STORE:
      if (miner.pos.isNearTo(spawn.pos)) {
        miner.memory.state = STATES.STORING;
      } else {
        miner.memory.state = STATES.MOVING_TO_STORE;
      }
      break;
    case STATES.STORING:
      if (miner.store.getUsedCapacity() === 0) {
        if (miner.pos.isNearTo(mine.pos)) {
          miner.memory.state = STATES.MINING;
        } else {
          miner.memory.state = STATES.MOVING_TO_MINE;
        }
      }
  }

  // State-action
  switch (miner.memory.state) {
    case STATES.MINING:
      miner.harvest(mine);
      break;
    case STATES.MOVING_TO_MINE:
      miner.moveTo(mine);
      break;
    case STATES.MOVING_TO_STORE:
      miner.moveTo(spawn);
      break;
    case STATES.STORING:
      miner.transfer(spawn, RESOURCE_ENERGY);
  }
};
