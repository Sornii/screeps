/**
 * General worker purpose
 * @returns {["work", "work", "work", "move"]}
 */
const worker = () => {
  return [WORK, WORK, WORK, MOVE];
};

export const miner = () => {
  const timestamp = Date.now();

  return [
    worker(),
    `Worker_${timestamp}`,
    {
      memory: {
        profession: 'miner',
        createdAt: timestamp,
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
    [CARRY, CARRY, MOVE, MOVE],
    `Mule_${timestamp}`,
    {
      memory: {
        profession: 'mule',
        createdAt: timestamp,
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
        profession: 'builder',
        createdAt: timestamp,
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

const CREATORS = {
  miner: createMiner,
  mule: createMule,
  builder: createBuilder,
};

export const createCreep = (profession, ...args) => {
  return CREATORS[profession](...args);
};
