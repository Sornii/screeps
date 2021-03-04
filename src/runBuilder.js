const name = 'Builder';

const STATES = {
  IDLE: 'idle',
};

/**
 * @param {StructureSpawn} spawn
 * @param {Array<ConstructionSite>} constructionSites
 * @param {string} surname
 */
export const runBuilder = (spawn, constructionSites, surname= '') => {
  const fullName = surname ? `${name} ${surname}` : name;

  const builder = Game.creeps[fullName];

  if (!builder) {
    spawn.spawnCreep([WORK, WORK, MOVE, CARRY], fullName, {
      memory: {
        profession: 'builder',
      },
    });
    return;
  }

  if (builder.spawning) {
    return;
  }

  if (builder.memory.state === STATES.IDLE) {
    return;
  }

  if (builder.store.getUsedCapacity() === 0) {
    if (spawn.store.energy < 250) {
      return;
    }
    if (builder.withdraw(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      builder.moveTo(spawn);
    }
    return;
  }

  let constructionSite = constructionSites[0];

  if (constructionSite) {
    if (builder.build(constructionSite) === ERR_NOT_IN_RANGE) {
      builder.moveTo(constructionSite);
    }
    return;
  }

  if (builder.upgradeController(builder.room.controller) === ERR_NOT_IN_RANGE) {
    builder.moveTo(builder.room.controller);
  }
};
