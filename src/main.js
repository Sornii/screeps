import { miner } from './miner';

const spawn = 'Spawn1';

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  console.log(
    `Running, there's ${Game.cpu.tickLimit} of CPU to spend on this tick.`
  );
  miner(Game.spawns[spawn]);
};
