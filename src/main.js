import { runMiner } from './runMiner';
import { runBuilder } from "./runBuilder";

const spawn = 'Spawn1';

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  console.log(
    `Running, there's ${Game.cpu.tickLimit} of CPU to spend on this tick.`
  );
  let spawn1 = Game.spawns[spawn];

  const constructionSites = spawn1.room.find(FIND_CONSTRUCTION_SITES);
  runBuilder(spawn1, constructionSites);
  runBuilder(spawn1, constructionSites, 'II');

  runMiner(spawn1);
  runMiner(spawn1, 'II');
  runMiner(spawn1, 'III');
  runMiner(spawn1, 'IV');
  runMiner(spawn1, 'V');
  runMiner(spawn1, 'VI');
};
