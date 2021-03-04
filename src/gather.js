const name = 'Gather';

export const gather = (spawn) => {
  const miner = Game.creeps[name];

  if (!miner) {
    spawn.spawnCreep([MOVE, CARRY], name);
    return;
  }

  const target = miner.room.find(FIND_SOURCES_ACTIVE);
  if (target) {
    if (miner.harvest(target[0]) === ERR_NOT_IN_RANGE) {
      miner.moveTo(target[0]);
    }
  }
};
