import { curry, find } from 'lodash';

export const energyOrders = curry(
  /**
   * @param {WorldState} worldState
   * @returns {WorldState}
   */
  (worldState) => {
    const { stores, energyOrders } = worldState;

    const newOrders = stores
      ? stores
          .map((store) => {
            if (energyOrders.find((order) => order.storeId === store.id)) {
              return;
            }

            if (!store.energy) {
              return {
                storeId: store.id,
                amount: store.store.getFreeCapacity(),
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
