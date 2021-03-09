import { findKey, remove } from 'lodash';

export const STATES = {
  MOVING_TO_BUILDING: 'movingToBuilding',
  MOVING_TO_STORE: 'movingToStore',
  WAITING_MULE: 'waitingMule',
  WITHDRAWING: 'withdrawing',
  RECEIVING: 'receiving',
  BUILDING: 'building',
  IDLING: 'idling',
};

export const builderAction = (creep, worldState) => {
  const { creeps, buildings } = worldState;

  if (!buildings || !Object.keys(buildings).length) {
    console.log('Builders have nothing to do.');
    return worldState;
  }

  let buildingId = creep.memory.buildingId;
  let building = Game.getObjectById(buildingId);
  let config = buildings[buildingId];

  const spawn = worldState.mainSpawn;
  const mule = creeps[creep.memory.mule];

  if (!building) {
    buildingId = findKey(
      buildings,
      (src, key) => !src.isBusy && key !== 'undefined'
    );
    if (!buildingId) {
      console.log('Builder have not found a building to work on');
      return worldState;
    }
    if (!config || Object.keys(config).length === 0) {
      config = {
        isBusy: false,
        builders: [],
        maxOccupation: 1,
      };
    }
    config.builders.push(creep.name);
    config = {
      ...config,
      isBusy: config.builders.length >= config.maxOccupation,
    };
    creep.memory.buildingId = buildingId;

    building = Game.getObjectById(buildingId);
  }

  if (!creep.memory.state) {
    if (creep.store.getFreeCapacity() === 0) {
      if (creep.pos.inRangeTo(building.pos, 3)) {
        creep.memory.state = STATES.BUILDING;
      } else {
        creep.memory.state = STATES.MOVING_TO_BUILDING;
      }
    } else {
      if (creep.pos.isNearTo(spawn.pos)) {
        creep.memory.state = STATES.WITHDRAWING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
    }
  }

  // State-checker
  switch (creep.memory.state) {
    case STATES.BUILDING:
      if (creep.store.getUsedCapacity() === 0) {
        if (creep.pos.isNearTo(spawn.pos)) {
          creep.memory.state = STATES.WITHDRAWING;
        } else if (mule) {
          creep.memory.state = STATES.WAITING_MULE;
        } else {
          creep.memory.state = STATES.MOVING_TO_STORE;
        }
      }
      break;
    case STATES.MOVING_TO_BUILDING:
      if (creep.pos.inRangeTo(building.pos, 3)) {
        creep.memory.state = STATES.BUILDING;
      } else {
        creep.memory.state = STATES.MOVING_TO_BUILDING;
      }
      break;
    case STATES.MOVING_TO_STORE:
      if (creep.pos.isNearTo(spawn.pos)) {
        creep.memory.state = STATES.WITHDRAWING;
      } else {
        creep.memory.state = STATES.MOVING_TO_STORE;
      }
      break;
    case STATES.WITHDRAWING:
      if (creep.store.getFreeCapacity() === 0) {
        if (creep.pos.inRangeTo(building.pos, 3)) {
          creep.memory.state = STATES.BUILDING;
        } else {
          creep.memory.state = STATES.MOVING_TO_BUILDING;
        }
      }
      break;
    case STATES.WAITING_MULE:
      if (creep.pos.isNearTo(mule)) {
        creep.memory.state = STATES.RECEIVING;
      }
      break;
    case STATES.RECEIVING:
      if (creep.store.getFreeCapacity() === 0) {
        creep.memory.state = STATES.BUILDING;
      }
  }

  // State-action
  switch (creep.memory.state) {
    case STATES.BUILDING:
      if (creep.build(building) < 0) {
        if (creep.upgradeController(building) < 0) {
          delete creep.memory.buildingId;
        }
      }
      break;
    case STATES.MOVING_TO_BUILDING:
      creep.moveTo(building);
      break;
    case STATES.MOVING_TO_STORE:
      creep.moveTo(spawn);
      break;
    case STATES.WITHDRAWING:
      creep.withdraw(spawn, RESOURCE_ENERGY);
      break;
  }

  return {
    ...worldState,
    buildings: {
      ...buildings,
      [buildingId]: config,
    },
  };
};

export const builderDeath = (creep, worldState) => {
  const { buildings } = worldState;

  const buildingId = creep.memory.buildingId;
  let config = buildings[buildingId];
  if (!config || Object.keys(config).length === 0) {
    config = {
      isBusy: false,
      builders: [],
      maxOccupation: 1,
    };
  } else {
    remove(config.builders, (name) => creep.name === name);
  }
  config = {
    ...config,
    isBusy: config.miners.length >= config.maxOccupation,
  };

  return {
    ...worldState,
    buildings: {
      ...buildings,
      [buildingId]: config,
    },
  };
};
