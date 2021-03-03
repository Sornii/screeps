"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loop = void 0;

var _robert = require("./robert");

var loop = function loop() {
  console.log("Running, there's ".concat(Game.cpu.tickLimit, " of CPU to spend on this tick."));
  (0, _robert.goRobert)(Game.spawns['Spawn1']);
};

exports.loop = loop;
//# sourceMappingURL=main.js.map
