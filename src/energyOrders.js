import { curry, find } from 'lodash';

export const energyOrders = curry(
  /**
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    let { stores, energyOrders } = worldState;

    if (!energyOrders || !Array.isArray(energyOrders)) {
      energyOrders = [];
    }

    const newOrders = stores
      ? stores
          .filter((store) => {
            return store.structureType !== 'container';
          })
          .map((store) => {
            if (energyOrders.filter((order) => order.storeId === store.id).length) {
              return;
            }

            if (!store.energy) {
              return {
                storeId: store.id,
                amount: store.store.getFreeCapacity(RESOURCE_ENERGY),
              };
            }
          })
          .filter(Boolean)
      : [];

    return {
      ...worldState,
      energyOrders: [...energyOrders, ...newOrders],
    };
  }
);

energyOrders.name = 'energyOrders';
