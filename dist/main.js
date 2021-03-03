"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loop = void 0;

var loop = function loop() {
  console.log("Running, there's ".concat(Game.cpu.tickLimit, " of CPU to spend on this tick."));

  if (!Game.creeps['Robert']) {
    Game.spawns['Spawn1'].spawnCreep([MOVE, WORK, CARRY], "Robert");
  }
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
