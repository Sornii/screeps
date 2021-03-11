import { curry, each } from 'lodash';

export const viewer = curry(
  /**
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { roads, structures, mainRoom } = worldState;

    structures.forEach((structure) => {
      if (structure.hits < structure.hitsMax) {
        const percentage = Math.floor(
          (structure.hits / structure.hitsMax) * 100
        );
        mainRoom.visual.text(`${percentage}%`, structure.pos, {
          font: '12px Helvetica',
        });
      }
    });

    each(roads, (road) => {
      const { roomId, fromX, fromY, toX, toY } = road;
      const room = Game.rooms[roomId];

      if (!room) {
        console.log(
          `Can't create visual for path. Room ${roomId} doesn't exist.`
        );
        return;
      }

      const from = room.getPositionAt(fromX, fromY);
      const to = room.getPositionAt(toX, toY);
      const path = room.findPath(from, to, {
        ignoreCreeps: true,
        ignoreRoads: true,
        swampCost: 1,
        plainCost: 1,
      });
      room.visual.poly(path);
    });

    return worldState;
  }
);
