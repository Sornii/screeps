const name = 'Robert';

export const goRobert = (spawn) => {
  const robert = Game.creeps['Robert'];

  if (!robert) {
    spawn.spawnCreep([WORK, MOVE, CARRY], 'Robert');
    return;
  }

  const target = robert.room.find(FIND_SOURCES_ACTIVE);
  if (target) {
    if (robert.harvest(target[0]) === ERR_NOT_IN_RANGE) {
      robert.moveTo(target[0]);
    }
  }
};
