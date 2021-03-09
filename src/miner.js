import { findKey, remove } from 'lodash';

export const STATES = {
  MOVING_TO_MINE: 'movingToMine',
  MOVING_TO_STORE: 'movingToStore',
  WAITING_MULE: 'waitingMule',
  STORING: 'storing',
  TRANSFERRING: 'transferring',
  MINING: 'mining',
  IDLING: 'idling',
};

export const minerAction = (creep, worldState) => {
  const { creeps, sourceMining } = worldState;

  if (!sourceMining) {
    console.log(new Error('Source mining not configured'));
    return;
  }

  let sourceId = creep.memory.sourceId;
  let source = Game.getObjectById(sourceId);
  let config = sourceMining[sourceId];

  if (!source) {
    sourceId = findKey(
      sourceMining,
      (src, key) => !src.isBusy && key !== 'undefined'
    );
    if (!sourceId) {
      return;
    }
    config = sourceMining[sourceId];
    if (Object.keys(config).length === 0) {
      sourceMining[sourceId] = {
        isBusy: false,
        miners: [],
        maxOccupation: 1,
      };
      config = sourceMining[sourceId];
    }
    config.miners.push(creep.name);
    config.isBusy = config.miners.length >= config.maxOccupation;
    creep.memory.sourceId = sourceId;

    source = Game.getObjectById(sourceId);
  }

  const spawn = worldState.mainSpawn;
  const mule = creeps[config.mule];

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
        } else if (mule) {
          creep.memory.state = STATES.WAITING_MULE;
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
      break;
    case STATES.WAITING_MULE:
      if (creep.pos.isNearTo(mule)) {
        creep.memory.state = STATES.TRANSFERRING;
      }
      break;
    case STATES.TRANSFERRING:
      if (creep.store.getUsedCapacity() === 0) {
        creep.memory.state = STATES.MINING;
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
      break;
    case STATES.TRANSFERRING:
      creep.transfer(mule, RESOURCE_ENERGY);
  }
};

export const minerDeath = (creep, worldState) => {
  const { sourceMining } = worldState;

  const sourceId = creep.memory.sourceId;
  let config = sourceMining[sourceId];
  if (!config.maxOccupation && !config.miners && config.isBusy == null) {
    sourceMining[sourceId] = {
      isBusy: false,
      miners: [],
      maxOccupation: 1,
    };
  } else {
    remove(config.miners, (name) => creep.name === name);
  }
  config.isBusy = config.miners.length >= config.maxOccupation;
};
