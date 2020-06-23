/**
 * @typedef {object} Position
 * @property {number} x
 * @property {number} y
 */


/**
 *
 * @param {number} x
 * @param {number} y
 *
 * @returns {Position}
 */
function position(x, y) {
  return { x, y };
}

position.null = () => position(0, 0);

module.exports = position;
