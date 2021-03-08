import { each } from "lodash";

export const viewer = (worldState) => {

  const { roads } = worldState;

  each(roads, road => {
    const { roomId, fromX, fromY, toX, toY } = road;
    const room = Game.rooms[roomId];

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
