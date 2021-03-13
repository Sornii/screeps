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
  // TODO: it does not reset each ticket, think in another solution

  return worldState;
});

hookWithdraw.timedName = 'hookWithdraw';
