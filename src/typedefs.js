/**
 * The global state
 * @typedef {Object} WorldState
 * @property {StructureSpawn} mainSpawn
 * @property {Room} mainRoom
 * @property {Array<AnyStructure>} structures
 * @property {Array<StructureTower>} towers
 * @property {Object.<Profession, number>} professionPopulation
 *   The amount of profession that the room is controlling, if the number of
 *   alive population goes lower than the number here, the spawn creates a creep
 *   with the required profession
 * @property {Object.<Profession, number>} countByProfession
 *   The amount of alive creeps by profession
 * @property {Object.<Profession, Array<Creep>>} creepsByProfession
 *   The alive creeps grouped by profession
 * @property buildings
 */
