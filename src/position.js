const Pair = require('./pair');

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
  return Pair.equal(one.x, one.y, other.x, other.y);
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

/**
 * @param {Position} one
 * @param {Position} other
 * @returns {import('./pair').Pair};
 */
function diff(one, other) {
  return Pair.diff(one.x, one.y, other.x, other.y);
}

/**
 * @param {Position} position
 * @param {number} n
 *
 * @returns {Position}
 */
function multiply({x, y}, n) {
  return {x: x * n , y: y * n};
}

module.exports = {
  position,
  copy,
  equal,
  origin,
  update,
  diff,
  multiply
};
