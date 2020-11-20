const Pair = require('./pair');

/**
 * @typedef {object} Vector
 * @property {number} x
 * @property {number} y
 */

/**
 *
 * @param {number} x
 * @param {number} y
 *
 * @returns {Vector}
 */
function vector(x, y) {
  return { x, y };
}

/**
 * @param {Vector|number} value
 * @returns {Vector}
 */
function cast(value) {
  if (typeof value === 'number') {
    return vector(value, value);
  } else {
    return value;
  }
}

 /**
  * This module contains functions for dealing with objects with x and y
  * coordinates that represent or include point data
  *
  * @module Vector
  */

/**
 * Returns a new (0, 0) vector
 *
 * @returns {Vector}
 */
function zero() {
  return vector(0, 0);
}

/**
 * Compares two points
 *
 * @param {Vector} one
 * @param {Vector} other
 * @param {number} [delta] the tolance in comparison
 * @returns {boolean}
 */
function equal(one, other, delta = 0) {
  return Pair.equal(one.x, one.y, other.x, other.y, delta);
}

/**
 * Creates a copy of the given point
 *
 * @param {Vector} one
 * @returns {Vector}
 */
function copy({x, y}) {
  return {x, y}
}

/**
 * @param {Vector} vector
 * @param {any} x
 * @param {any} y
 */
function update(vector, x, y) {
  vector.x = x;
  vector.y = y;
}

/**
 * @param {Vector} one
 * @param {Vector} other
 * @returns {import('./pair').Pair};
 */
function diff(one, other) {
  return Pair.diff(one.x, one.y, other.x, other.y);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
function multiply(one, other) {
  return apply(one, other, (v1, v2) => v1 * v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
function divide(one, other) {
  return apply(one, other, (v1, v2) => v1 / v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
function plus(one, other) {
  return apply(one, other, (v1, v2) => v1 + v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
function minus(one, other) {
  return apply(one, other, (v1, v2) => v1 - v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
function min(one, other) {
  return apply(one, other, Math.min);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
function max(one, other) {
  return apply(one, other, Math.max);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 * @param {(one: number, other: number) => number} f
 *
 * @returns {Vector}
 */
function apply(one, other, f) {
  const first = cast(one);
  const second = cast(other);
  return {x: f(first.x, second.x), y: f(first.y, second.y)};
}

const inner = {
  /**
   * @param {Vector} one
   *
   * @returns {number}
   */
  min(one) {
    return this.apply(one, Math.min);
  },

  /**
   * @param {Vector} one
   *
   * @returns {number}
   */
  max(one) {
    return this.apply(one, Math.max);
  },

  /**
   * @param {Vector} one
   * @param {(one: number, other: number) => number} f
   * @return {number}
   */
  apply(one, f) {
    return f(one.x, one.y)
  }
}

module.exports = {
  cast,
  vector,
  copy,
  equal,
  zero,
  update,
  diff,
  multiply,
  divide,
  plus,
  minus,
  apply,
  min,
  max,
  inner
};
