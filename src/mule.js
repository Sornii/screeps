import { first, findKey } from 'lodash';

export const STATES = {
  MOVING_TO_MINE: 'movingToMine',
  MOVING_TO_STORE: 'movingToStore',
  WAITING_TRANSFER: 'waitingTransfer',
  STORING: 'storing',
  TRANSFERRING: 'transferring',
  IDLING: 'idling',
};

export const muleAction = (creep, worldState) => {
  const { mainSpawn: spawn, creeps, muleOrders, sourceMining } = worldState;

  if (!muleOrders) {
    console.log(`Mule unable to work, there's not muleOrders in worldState`);
    return;
  }

  if (!sourceMining) {
    console.log(`Mule unable to work, there's not sourceMining in worldState`);
    return;
  }

  const sourceId = findKey(sourceMining, src => !src.muleId && src.isWithMule);

  if (!sourceId) {
    console.log(`Mule unable to work, there's not a sourceMining requesting a mule`);
    return;
  }

  const sourceConfiguration = sourceMining[sourceId];
  const miner = creeps[first(sourceConfiguration.miners)];

  if (!miner) {
    console.log(`There's not a miner in the source`);
    return;
  }

  if (!creep.memory.state) {
    if (creep.store.getFreeCapacity() > 0) {
      if (creep.pos.isNearTo(miner.pos)) {
        creep.memory.state = STATES.MINING;
      } else {
        creep.memory.state = STATES.MOVING_TO_MINE;
      }
    } else {
      if (creep.pos.isNearTo(miner.pos)) {
        creep.memory.state = STATES.STORING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
    }
  }

  switch (creep.memory.state) {
    case STATES.WAITING_TRANSFER:
      if (miner.store.getUsedCapacity() === 0) {
        if (creep.pos.isNearTo(spawn.pos)) {
          creep.memory.state = STATES.STORING;
        } else {
          creep.memory.state = STATES.MOVING_TO_STORE;
        }
      }
      break;
    case STATES.MOVING_TO_MINE:
      if (creep.pos.isNearTo(miner.pos)) {
        creep.memory.state = STATES.MINING;
      } else {
        creep.memory.state = STATES.MOVING_TO_MINE;
      }
      break;
    case STATES.MOVING_TO_STORE:
      if (creep.pos.isNearTo(miner.pos)) {
        creep.memory.state = STATES.STORING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
      break;
    case STATES.STORING:
      if (creep.store.getUsedCapacity() === 0) {
        if (creep.pos.isNearTo(miner.pos)) {
          creep.memory.state = STATES.WAITING_TRANSFER;
        } else {
          creep.memory.state = STATES.MOVING_TO_MINE;
        }
      }
      break;
  }

  // State-action
  switch (creep.memory.state) {
    case STATES.WAITING_TRANSFER:
      creep.say(`Common, let's go!`)
      break;
    case STATES.MOVING_TO_MINE:
      creep.moveTo(miner);
      break;
    case STATES.MOVING_TO_STORE:
      creep.moveTo(spawn);
      break;
    case STATES.STORING:
      creep.transfer(spawn, RESOURCE_ENERGY);
      break;
  }
};

export const muleDeath = () => {};
