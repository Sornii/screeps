const MOVE = 'move';
const WORK = 'work';
const CARRY = 'carry';

export const loop = () => {
  console.log(
    `Running, there's ${Game.cpu.tickLimit} of CPU to spend on this tick.`
  );
  if (!Game.creeps['Robert']) {
    Game.spawns['Spawn1'].spawnCreep([MOVE, WORK, CARRY], 'Robert');
  }
};
