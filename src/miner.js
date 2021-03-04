const name = 'Miner';

export const miner = (spawn) => {
  const robert = Game.creeps[name];

  if (!robert) {
    spawn.spawnCreep([WORK, MOVE, CARRY], name);
    return;
  }

  const target = robert.room.find(FIND_SOURCES_ACTIVE);
  if (target) {
    if (robert.harvest(target[0]) === ERR_NOT_IN_RANGE) {
      robert.moveTo(target[0]);
    }
  }
};
