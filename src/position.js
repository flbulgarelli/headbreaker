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
 * @param {Position|number} value
 * @returns {Position}
 */
function cast(value) {
  if (typeof value === 'number') {
    return position(value, value);
  } else {
    return value;
  }
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
 * @param {Position|number} one
 * @param {Position|number} other
 *
 * @returns {Position}
 */
function multiply(one, other) {
  const first = cast(one);
  const second = cast(other);
  return {x: first.x * second.x , y: first.y * second.y};
}


/**
 * @param {Position|number} one
 * @param {Position|number} other
 *
 * @returns {Position}
 */
function divide(one, other) {
  const first = cast(one);
  const second = cast(other);
  return {x: first.x / second.x , y: first.y / second.y};
}

module.exports = {
  cast,
  position,
  copy,
  equal,
  origin,
  update,
  diff,
  multiply,
  divide
};
