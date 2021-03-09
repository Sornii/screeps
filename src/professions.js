import { curry, each } from 'lodash';

/**
 * General worker purpose
 * @returns {["work", "work", "work", "move"]}
 */
const worker = () => {
  return [WORK, WORK, CARRY, MOVE];
};

export const miner = () => {
  const timestamp = Date.now();

  return [
    worker(),
    `Worker_${timestamp}`,
    {
      memory: {
        profession: PROFESSIONS.MINER,
        createdAt: timestamp,
        order: ORDER[PROFESSIONS.MINER],
      },
    },
  ];
};

/**
 * Create a Miner
 * @param {StructureSpawn} spawn
 */
export const createMiner = (spawn) => {
  const configuration = miner();
  return [configuration, spawn.spawnCreep(...configuration)];
};

export const mule = () => {
  const timestamp = Date.now();

  return [
    [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    `Mule_${timestamp}`,
    {
      memory: {
        profession: PROFESSIONS.MULE,
        createdAt: timestamp,
        order: ORDER[PROFESSIONS.MULE],
      },
    },
  ];
};

/**
 * Create a Mule
 * @param {StructureSpawn} spawn
 */
export const createMule = (spawn) => {
  const configuration = mule();
  return [configuration, spawn.spawnCreep(...configuration)];
};

export const builder = () => {
  const timestamp = Date.now();

  return [
    worker(),
    `Builder_${timestamp}`,
    {
      memory: {
        profession: PROFESSIONS.BUILDER,
        createdAt: timestamp,
        order: ORDER[PROFESSIONS.BUILDER],
      },
    },
  ];
};

/**
 * Create a Builder
 * @param {StructureSpawn} spawn
 */
export const createBuilder = (spawn) => {
  const configuration = builder();
  return [configuration, spawn.spawnCreep(...configuration)];
};

export const PROFESSIONS = {
  MINER: 'miner',
  MULE: 'mule',
  BUILDER: 'builder',
};

export const CREATORS = {
  [PROFESSIONS.MINER]: createMiner,
  [PROFESSIONS.MULE]: createMule,
  [PROFESSIONS.BUILDER]: createBuilder,
};

export const ORDER = {
  [PROFESSIONS.MINER]: 100,
  [PROFESSIONS.MULE]: 200,
  [PROFESSIONS.BUILDER]: 300,
};

export const initializeDefaultCreepOrder = curry((worldState) => {
  const { creeps } = worldState;

  each(creeps, (creep) => {
    if (!creep.memory.order) {
      creep.memory.order = ORDER[creep.memory.profession];
    }
  });

  return worldState;
});

export const createCreep = (profession, ...args) => {
  return CREATORS[profession](...args);
};
