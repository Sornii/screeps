import { curry } from 'lodash';
import { minerDeath } from './miner';

if (!Creep.prototype._suicide) {
  // Store the original method
  Creep.prototype._suicide = Creep.prototype.suicide;

  // Create our new function
  Creep.prototype.suicide = function () {
    // Add custom functionality
    console.log(`May ${this.name} rest in peace.`);

    minerDeath(this, { sourceMining: Memory.sourceMining });

    // Call and return the original method
    return this._suicide();
  };
}

export const hookWithdraw = curry((worldState) => {
  if (!Creep.prototype._withdraw) {
    // Store the original method
    Creep.prototype._withdraw = Creep.prototype.withdraw;

    // Create our new function
    Creep.prototype.withdraw = function (...args) {
      if (worldState.isSpawnLocked) {
        console.log(`Spawn is locked`);
        return;
      }

      // Call and return the original method
      return this._withdraw(...args);
    };
  }

  return worldState;
});
