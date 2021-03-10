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

  if (!sourceMining || !Object.keys(sourceMining).length) {
    console.log('Source mining not configured');
    return worldState;
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
      console.log('Miners have not found a source to work on');
      return worldState;
    }
    config = sourceMining[sourceId];
    if (!config || Object.keys(config).length === 0) {
      config = {
        isBusy: false,
        miners: [],
        maxOccupation: 1,
      };
    }
    config.miners.push(creep.name);
    config = {
      ...config,
      isBusy: config.miners.length >= config.maxOccupation,
    };
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
          const flag = Game.flags[sourceId];
          if (flag && mule.pos.isEqualTo(flag)) {
            creep.memory.state = STATES.TRANSFERRING;
          } else if (!flag && creep.pos.isNearTo(mule)) {
            creep.memory.state = STATES.TRANSFERRING;
          } else {
            creep.memory.state = STATES.WAITING_MULE;
          }
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
      if (!mule) {
        if (creep.pos.isNearTo(spawn.pos)) {
          creep.memory.state = STATES.STORING;
        } else {
          creep.memory.state = STATES.MOVING_TO_STORE;
        }
      } else if (creep.pos.isNearTo(mule)) {
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

  return {
    ...worldState,
    sourceMining: {
      ...sourceMining,
      [sourceId]: config,
    },
  };
};

export const minerDeath = (creep, worldState) => {
  const { sourceMining } = worldState;

  const sourceId = creep.memory.sourceId;

  if (!sourceId) {
    return worldState;
  }

  let config = sourceMining[sourceId];
  if (!config || Object.keys(config).length === 0) {
    config = {
      isBusy: false,
      miners: [],
      maxOccupation: 1,
    };
  } else {
    remove(config.miners, (name) => creep.name === name);
  }
  config = {
    ...config,
    isBusy: config.miners.length >= config.maxOccupation,
  };

  return {
    ...worldState,
    sourceMining: {
      ...sourceMining,
      [sourceId]: config,
    },
  };
};
