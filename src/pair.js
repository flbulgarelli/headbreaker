/**
 * @typedef {[number, number]} Pair
 */

/**
 * Utilities for handling 2D vectors, expressed a two-elements list
 *
 * @module pair
 */

/**
 * Tells whether this pair is (0, 0)
 *
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function isNull(x, y) {
  return equal(x, y, 0, 0);
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [delta] tolerance in comparison
 * @returns {boolean}
 */
function equal(x1, y1, x2, y2, delta = 0) {
  return Math.abs(x1 - x2) <= delta && Math.abs(y1 - y2) <= delta;
}

/**
 * Calculates the difference of two vectors
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {Pair}
 */
function diff(x1, y1, x2, y2) {
  return [x1 - x2, y1 - y2];
}

module.exports = {
  isNull,
  diff,
  equal
};
