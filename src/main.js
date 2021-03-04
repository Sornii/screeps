import { runMiner } from './runMiner';
import { runBuilder } from "./runBuilder";

const room = "E48N13";
const spawn = 'Spawn1';

// noinspection JSUnusedGlobalSymbols
export const loop = () => {
  console.log(
    `Running, there's ${Game.cpu.tickLimit} of CPU to spend on this tick.`
  );
  let spawn1 = Game.spawns[spawn];

  const path = Game.rooms[room].findPath(spawn1.pos, Game.getObjectById('5bbcafe09099fc012e63b51e').pos);
  const path2 = Game.rooms[room].findPath(spawn1.pos, Game.getObjectById('5bbcafe09099fc012e63b51f').pos);
  const path3 = Game.rooms[room].findPath(spawn1.pos, new RoomPosition(17, 22, room));
  const path4 = Game.rooms[room].findPath(spawn1.pos, new RoomPosition(21, 23, room));
  Game.rooms[room].visual.poly(path, {stroke: '#fff', strokeWidth: .15,
    opacity: .2, lineStyle: 'dashed'});
  Game.rooms[room].visual.poly(path2, {stroke: '#fff', strokeWidth: .15,
    opacity: .2, lineStyle: 'dashed'});
  Game.rooms[room].visual.poly(path3, {stroke: '#fff', strokeWidth: .15,
    opacity: .2, lineStyle: 'dashed'});
  Game.rooms[room].visual.poly(path4, {stroke: '#fff', strokeWidth: .15,
    opacity: .2, lineStyle: 'dashed'});

  const constructionSites = spawn1.room.find(FIND_CONSTRUCTION_SITES);
  runBuilder(spawn1, constructionSites);
  runBuilder(spawn1, constructionSites, 'III');
  runBuilder(spawn1, constructionSites, 'V');

  runMiner(spawn1);
  runMiner(spawn1, 'II');
  runMiner(spawn1, 'V');
  runMiner(spawn1, 'VII');
  runMiner(spawn1, 'VIII');
  runMiner(spawn1, 'IX');
  runMiner(spawn1, 'X');
  runMiner(spawn1, 'XI');
};
