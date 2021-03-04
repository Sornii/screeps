/**
 * Zero-based index dice
 * @param {number} sides The number of sides
 * @returns {number} random side starting from zero
 */
export const roll = (sides) => {
  return Math.floor(Math.random() * sides);
};
