/**
 * The global state
 * @typedef {Object} WorldState
 * @property {StructureSpawn} mainSpawn
 * @property {Room} mainRoom
 * @property {Building[]} buildings
 */

/**
 * @type {WorldState}
 */
export const worldState = {
  buildings: [],
  mainSpawn: null,
  mainRoom: null,
};

/**
 * @typedef {Object} Building
 * @property {boolean} isBusy
 * @property {string[]} builders
 * @property {number} maxOccupation
 * @property {BuildableStructureConstant} structureType
 */

/**
 * @type {Building}
 */
export const building = {
  isBusy: false,
  builders: [],
  maxOccupation: 1,
  structureType: null,
};
