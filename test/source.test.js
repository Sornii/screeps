import _ from 'lodash';
import { ScreepsServer, TerrainMatrix } from 'screeps-server-mockup';

test('screeps server', async () => {
  const server = new ScreepsServer();
  await server.world.reset();

  const terrain = new TerrainMatrix();

  await server.world.addRoom('W0N1');
  await server.world.addRoomObject('W0N1', 'controller', 10, 10, { level: 0 });
  await server.world.setTerrain('W0N1', terrain);

  await server.world.addRoomObject('W0N1', 'source', 10, 40, {
    energy: 1500,
    energyCapacity: 3000,
    ticksToRegeneration: 300,
  });

  const modules = {
    main: `module.exports.loop = function() {
        console.log('Tick!', Game.time);
    };`,
  };

  const bot = await server.world.addBot({
    username: 'bot',
    room: 'W0N1',
    x: 25,
    y: 25,
    modules,
  });

  await server.start();

  for (let i = 0; i < 10; i++) {
    console.log('[tick]', await server.world.gameTime);
    await server.tick();
    const notifications = await bot.notifications;
    const newNotifications = await bot.newNotifications;
    const roomObjects = await server.world.roomObjects('W0N1');
    console.log('[ticksToRegeneration]', _.find(roomObjects,{ type: 'source' }).ticksToRegeneration);
    console.log('[memory]', await bot.memory);
  }

  server.stop();
});
