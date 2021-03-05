import { findKey } from 'lodash';

const STATES = {
  MOVING_TO_MINE: 'movingToMine',
  MOVING_TO_STORE: 'movingToStore',
  STORING: 'storing',
  MINING: 'mining',
  IDLE: 'idle',
};

export const initiateSourceMining = (source) => {
  if (!Memory.sourceMining[source.id].maxOccupation) {
    Memory.sourceMining[source.id] = {
      isBusy: false,
      miners: [],
      maxOccupation: 1,
    };
  }
};

export const checkIsBusy = (source) => {
  const memory = Memory.sourceMining[source.id];
  if (memory.miners.length >= memory.maxOccupation) {
    memory.isBusy = true;
  }
};

export const pushMiner = (source, creep) => {
  Memory.sourceMining[source.id].miners.push(creep.id);
};

export const minerAction = (creep, worldState) => {
  let source = Game.getObjectById(creep.memory.sourceId);

  const spawn = worldState.mainSpawn;

  if (!worldState.sourceMining) {
    console.log(new Error('Source mining not configured'));
    return;
  }

  if (!source) {
    const sourceId = findKey(
      worldState.sourceMining,
      (sourceMining, key) => !sourceMining.isBusy && key !== 'undefined'
    );
    source = Game.getObjectById(sourceId);
    console.log(JSON.stringify(source));
    console.log(source.toString());
    initiateSourceMining(source);
    pushMiner(source, creep);
    checkIsBusy(source);
    creep.memory.sourceId = source.id;
  }

  if (!creep.memory.state) {
    if (creep.store.getFreeCapacity() > 0) {
      if (creep.pos.isNearTo(source.pos)) {
        creep.memory.state = STATES.MINING;
      } else {
        creep.memory.state = STATES.MOVING_TO_MINE;
      }
    } else {
      if (creep.pos.isNearTo(spawn.pos)) {
        creep.memory.state = STATES.STORING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
    }
  }

  // State-checker
  switch (creep.memory.state) {
    case STATES.MINING:
      if (creep.store.getFreeCapacity() === 0) {
        if (creep.pos.isNearTo(spawn.pos)) {
          creep.memory.state = STATES.STORING;
        } else {
          creep.memory.state = STATES.MOVING_TO_STORE;
        }
      }
      break;
    case STATES.MOVING_TO_MINE:
      if (creep.pos.isNearTo(source.pos)) {
        creep.memory.state = STATES.MINING;
      } else {
        creep.memory.state = STATES.MOVING_TO_MINE;
      }
      break;
    case STATES.MOVING_TO_STORE:
      if (creep.pos.isNearTo(spawn.pos)) {
        creep.memory.state = STATES.STORING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
      break;
    case STATES.STORING:
      if (creep.store.getUsedCapacity() === 0) {
        if (creep.pos.isNearTo(source.pos)) {
          creep.memory.state = STATES.MINING;
        } else {
          creep.memory.state = STATES.MOVING_TO_MINE;
        }
      }
  }

  // State-action
  switch (creep.memory.state) {
    case STATES.MINING:
      creep.harvest(source);
      break;
    case STATES.MOVING_TO_MINE:
      creep.moveTo(source);
      break;
    case STATES.MOVING_TO_STORE:
      creep.moveTo(spawn);
      break;
    case STATES.STORING:
      creep.transfer(spawn, RESOURCE_ENERGY);
  }
};
