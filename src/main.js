import {goRobert} from "./robert";

export const loop = () => {
  console.log(
    `Running, there's ${Game.cpu.tickLimit} of CPU to spend on this tick.`
  );
  goRobert(Game.spawns['Spawn1']);
};
