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

 /**
  * This module contains functions for dealing with objects with x and y
  * coordinates that represent or include point data
  *
  * @module Position
  */

/**
 * Returns a new (0, 0) position
 *
 * @returns {Position}
 */
function origin() {
  return position(0, 0);
}

/**
 * Compares two points
 *
 * @param {Position} one
 * @param {Position} other
 * @returns {boolean}
 */
function equal(one, other) {
  return one.x === other.x && one.y === other.y;
}

/**
 * Creates a copy of the given point
 *
 * @param {Position} one
 * @returns {Position}
 */
function copy({x, y}) {
  return {x, y}
}

/**
 * @param {Position} position
 * @param {any} x
 * @param {any} y
 */
function update(position, x, y) {
  position.x = x;
  position.y = y;
}

module.exports = {
  position,
  copy,
  equal,
  origin,
  update
};
