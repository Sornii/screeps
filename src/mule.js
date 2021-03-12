import { find, first, findKey } from 'lodash';
import { STATES as BUILDER_STATES } from './builder';

export const STATES = {
  MOVING_TO_MINE: 'movingToMine',
  MOVING_TO_STORE: 'movingToStore',
  MOVING_TO_BUILDING: 'movingToBuilding',
  MOVING_TO_BUILDER: 'movingToBuilder',
  WAITING_TRANSFER: 'waitingTransfer',
  STORING: 'storing',
  TRANSFERRING: 'transferring',
  WITHDRAWING: 'withdrawing',
  IDLING: 'idling',
};

/**
 *
 * @param {Creep} creep
 * @param {Id<Source>} sourceId
 * @param {WorldState} worldState
 * @return {WorldState}
 */
const sourceMule = (creep, sourceId, worldState) => {
  const { mainSpawn: spawn, creeps, sourceMining, towers, energyOrders, structures } = worldState;

  let config = sourceMining[sourceId];

  const tower = towers[0];

  creep.memory.sourceId = sourceId;

  let store = spawn;
  if (!creep.memory.storeId) {
    creep.memory.storeId = spawn.id;
  } else if (creep.memory.storeId !== spawn.id) {
    store = tower;
  }

  let order = first(creep.memory.orders);

  if (energyOrders.length && !order) {
    order = energyOrders.pop();
    if (order) {
      creep.memory.orders = [...(creep.memory.orders || []), order];
    }
  }

  if (order) {
    store = structures.find(({ id }) => id === order.storeId);
  }

  config = {
    ...config,
    mule: creep.name,
  };

  const miner = creeps[first(config.miners)];
  const miners = config.miners.map((miner) => creeps[miner]);

  if (!miner) {
    console.log(`There's not a miner in the source`);
    return worldState;
  }

  if (!creep.memory.state) {
    if (creep.store.getFreeCapacity() > 0) {
      const flag = Game.flags[sourceId];
      const isAtFlag = flag && creep.pos.isEqualTo(flag);
      if (flag && !isAtFlag) {
        creep.memory.state = STATES.MOVING_TO_MINE;
      } else if (flag && isAtFlag) {
        creep.memory.state = STATES.WAITING_TRANSFER;
      } else if (creep.pos.isNearTo(miner.pos)) {
        creep.memory.state = STATES.WAITING_TRANSFER;
      } else {
        creep.memory.state = STATES.MOVING_TO_MINE;
      }
    } else {
      if (creep.pos.isNearTo(store.pos)) {
        creep.memory.state = STATES.STORING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
    }
  }

  switch (creep.memory.state) {
    case STATES.WAITING_TRANSFER:
      // TODO: instantaneously going back to store is the best option?!
      if (creep.pos.isNearTo(store.pos)) {
        creep.memory.state = STATES.STORING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
      break;
    case STATES.MOVING_TO_MINE:
      const flag = Game.flags[sourceId];
      const isAtFlag = flag && creep.pos.isEqualTo(flag);
      if (flag && !isAtFlag) {
        creep.memory.state = STATES.MOVING_TO_MINE;
      } else if (flag && isAtFlag) {
        // TODO: instantaneously going back to store is the best option?!
        if (creep.pos.isNearTo(store.pos)) {
          creep.memory.state = STATES.STORING;
        } else {
          creep.memory.state = STATES.MOVING_TO_STORE;
        }
      } else if (creep.pos.isNearTo(miner.pos)) {
        // TODO: instantaneously going back to store is the best option?!
        if (creep.pos.isNearTo(store.pos)) {
          creep.memory.state = STATES.STORING;
        } else {
          creep.memory.state = STATES.MOVING_TO_STORE;
        }
      } else {
        creep.memory.state = STATES.MOVING_TO_MINE;
      }
      break;
    case STATES.MOVING_TO_STORE:
      if (creep.pos.isNearTo(store.pos)) {
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
      } else {
        if (store.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
          if (store.id === spawn.id) {
            store = tower;
          } else {
            store = spawn;
          }
          creep.memory.storeId = store.id;
          if (creep.pos.isNearTo(store.pos)) {
            creep.memory.state = STATES.STORING;
          } else {
            creep.memory.state = STATES.MOVING_TO_STORE;
          }
        }
      }
      break;
  }

  // State-action
  switch (creep.memory.state) {
    case STATES.MOVING_TO_MINE:
      const flag = Game.flags[sourceId];
      if (flag) {
        creep.moveTo(flag);
      } else {
        creep.moveTo(miner);
      }
      break;
    case STATES.MOVING_TO_STORE:
      creep.moveTo(store);
      break;
    case STATES.STORING:
      if (order) {
        const currentEnergyAmount = creep.store.energy;
        if (currentEnergyAmount >= order.amount) {
          creep.memory.orders.pop();
        }
      }
      creep.transfer(store, RESOURCE_ENERGY);
      break;
  }

  return {
    ...worldState,
    sourceMining: {
      ...sourceMining,
      [sourceId]: {
        ...config,
        mule: creep.name,
      },
    },
  };
};

/**
 *
 * @param {Creep} creep
 * @param {Id<ConstructionSite>} buildingId
 * @param {WorldState} worldState
 * @return {WorldState}
 */
const buildingMule = (creep, buildingId, worldState) => {
  const { mainSpawn: spawn, creeps, buildings } = worldState;

  let config = buildings[buildingId];

  creep.memory.buildingId = buildingId;
  config = {
    ...config,
    mule: creep.name,
  };

  const builders = config.builders;
  const size = builders.length;
  const builderWaitingMule = find(
    builders,
    (builder) => builder.memory.state === BUILDER_STATES.WAITING_MULE
  );
  const firstBuilder = creeps[first(builders)];

  if (!firstBuilder) {
    console.log(`There's not a builder in the source`);
    return worldState;
  }

  if (!creep.memory.state) {
    if (creep.store.getFreeCapacity() > 0) {
      if (creep.pos.isNearTo(spawn.pos)) {
        creep.memory.state = STATES.WITHDRAWING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
    } else {
      if (creep.pos.isNearTo(firstBuilder.pos)) {
        creep.memory.state = STATES.TRANSFERRING;
      } else {
        creep.memory.state = STATES.MOVING_TO_BUILDER;
      }
    }
  }

  switch (creep.memory.state) {
    case STATES.TRANSFERRING:
  }

  // State-action
  switch (creep.memory.state) {
  }

  return worldState;
};

/**
 * Initialize the buildings
 * @param {Creep} creep
 * @param {WorldState} worldState
 * @returns {WorldState}
 */
export const muleAction = (creep, worldState) => {
  const { creeps, muleOrders, sourceMining, buildings, towers, mainSpawn } = worldState;

  // TODO: rethink
  if (!muleOrders) {
    console.log(`Mule unable to work, there's not muleOrders in worldState`);
    return worldState;
  }

  // TODO: or buildings
  if (!sourceMining) {
    console.log(`Mule unable to work, there's not sourceMining in worldState`);
    return worldState;
  }

  let sourceId = creep.memory.sourceId;
  let buildingId = creep.memory.buildingId;

  if (!sourceId && !buildingId) {
    sourceId = findKey(
      sourceMining,
      (src) => src.isWithMule && (!src.mule || !creeps[src.mule])
    );
  }

  if (!sourceId) {
    buildingId = findKey(
      buildings,
      (bld) => bld.isWithMule && (!bld.mule || !creeps[bld.mule])
    );
  }

  if (sourceId) {
    return sourceMule(creep, sourceId, worldState);
  }

  if (buildingId) {
    return buildingMule(creep, buildingId, worldState);
  }

  console.log(
    `Mule unable to work, there's not a sourceMining or a building requesting a mule`
  );

  return worldState;
};

export const muleDeath = (worldState) => {
  const { creep, sourceMining } = worldState;

  const sourceId = creep.memory.sourceId;

  if (!sourceId) {
    return worldState;
  }

  const config = sourceMining[sourceId];
  if (!config) {
    return worldState;
  }

  return {
    ...worldState,
    sourceMining: {
      ...sourceMining,
      [sourceId]: {
        ...config,
        mule: null,
      },
    },
  };
};
