import { findKey } from 'lodash';

const STATES = {
  MOVING_TO_MINE: 'movingToMine',
  MOVING_TO_STORE: 'movingToStore',
  STORING: 'storing',
  MINING: 'mining',
  IDLE: 'idle',
};

export const minerAction = (creep, worldState) => {
  let source = Game.getObjectById(creep.memory.sourceId);

  const spawn = worldState.mainSpawn;

  const { sourceMining } = worldState;

  if (!sourceMining) {
    console.log(new Error('Source mining not configured'));
    return;
  }

  if (!source) {
    const sourceId = findKey(
      sourceMining,
      (src, key) => !src.isBusy && key !== 'undefined'
    );
    if (!sourceId) {
      return;
    }
    let config = sourceMining[sourceId];
    if (!config.maxOccupation && !config.miners && config.isBusy == null) {
      sourceMining[sourceId] = {
        isBusy: false,
        miners: [],
        maxOccupation: 1,
      };
      config = sourceMining[sourceId];
    }
    config.miners.push(creep.id);
    config.isBusy = config.miners.length >= config.maxOccupation;
    creep.memory.sourceId = sourceId;

    source = Game.getObjectById(sourceId);
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
