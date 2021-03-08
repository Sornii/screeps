import { each } from 'lodash';

export const viewer = (worldState) => {
  const { roads } = worldState;

  each(roads, (road) => {
    const { roomId, fromX, fromY, toX, toY } = road;
    const room = Game.rooms[roomId];

    if (!room) {
      console.log(`Can't create visual for path. Room doesn't exist.`);
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
};
