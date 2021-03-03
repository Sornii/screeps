"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.goRobert = void 0;
var name = 'Robert';

var goRobert = function goRobert(spawn) {
  var robert = Game.creeps['Robert'];

  if (!robert) {
    spawn.spawnCreep([WORK, MOVE, CARRY], 'Robert');
    return;
  }

  var target = robert.room.find(FIND_SOURCES_ACTIVE);

  if (target) {
    if (robert.harvest(target[0]) === ERR_NOT_IN_RANGE) {
      robert.moveTo(target[0]);
    }
  }
};

exports.goRobert = goRobert;
//# sourceMappingURL=robert.js.map
