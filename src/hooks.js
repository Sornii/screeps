import { minerDeath } from './dies';

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
