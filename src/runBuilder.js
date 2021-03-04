const name = 'Builder';

/**
 * @param {StructureSpawn} spawn
 * @param {Array<ConstructionSite>} constructionSites
 */
export const runBuilder = (spawn, constructionSites) => {
  const builder = Game.creeps[name];

  if (!builder) {
    spawn.spawnCreep([WORK, MOVE, CARRY], name);
    return;
  }

  if (builder.spawning) {
    return;
  }

  if (builder.store.getUsedCapacity() === 0) {
    if (builder.withdraw(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      builder.moveTo(spawn);
    }
    return;
  }

  let constructionSite = constructionSites[0];

  if (constructionSite) {
    let returnCode = builder.build(constructionSite);
    if (returnCode === ERR_NOT_IN_RANGE) {
      builder.moveTo(constructionSite);
    }
  }
};
