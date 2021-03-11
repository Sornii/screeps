import { ScreepsServer, TerrainMatrix } from 'screeps-server-mockup';

test("screeps server", async () => {

  const server = new ScreepsServer();
  await server.world.reset();

});
