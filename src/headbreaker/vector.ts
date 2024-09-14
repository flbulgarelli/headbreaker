import pair, { Pair } from './pair';

export interface Vector {
  x: number;
  y: number;
}

/**
 *
 * @param {number} x
 * @param {number} y
 *
 * @returns {Vector}
 */
export default function vector(x: number, y: number): Vector {
  return { x, y };
}

/**
 * @param {Vector|number} value
 * @returns {Vector}
 */
vector.cast = (value: Vector | number): Vector => {
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
vector.zero = (): Vector => {
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
vector.equal = (one: Vector, other: Vector, delta: number = 0): boolean => {
  return pair.equal(one.x, one.y, other.x, other.y, delta);
}

/**
 * Creates a copy of the given point
 *
 * @param {Vector} one
 * @returns {Vector}
 */
vector.copy = ({x, y}: Vector): Vector => {
  return {x, y}
}

/**
 * @param {Vector} vector
 * @param {any} x
 * @param {any} y
 */
vector.update = (vector: Vector, x: any, y: any) => {
  vector.x = x;
  vector.y = y;
}

/**
 * @param {Vector} one
 * @param {Vector} other
 * @returns {Pair};
 */
vector.diff = (one: Vector, other: Vector): Pair => {
  return pair.diff(one.x, one.y, other.x, other.y);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
vector.multiply = (one: Vector | number, other: Vector | number): Vector => {
  return _apply(one, other, (v1, v2) => v1 * v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
vector.divide = (one: Vector | number, other: Vector | number): Vector => {
  return _apply(one, other, (v1, v2) => v1 / v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
vector.plus = (one: Vector | number, other: Vector | number): Vector => {
  return _apply(one, other, (v1, v2) => v1 + v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
vector.minus = (one: Vector | number, other: Vector | number): Vector => {
  return _apply(one, other, (v1, v2) => v1 - v2);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
vector.min = (one: Vector | number, other: Vector | number): Vector => {
  return _apply(one, other, Math.min);
}

/**
 * @param {Vector|number} one
 * @param {Vector|number} other
 *
 * @returns {Vector}
 */
vector.max = (one: Vector | number, other: Vector | number): Vector => {
  return _apply(one, other, Math.max);
}

function _apply(one: Vector | number, other: Vector | number, f: (one: number, other: number) => number): Vector {
  const first = vector.cast(one);
  const second = vector.cast(other);
  return {x: f(first.x, second.x), y: f(first.y, second.y)};
}

vector.inner = {
  /**
   * @param {Vector} one
   *
   * @returns {number}
   */
  min(one: Vector): number {
    return _innerApply(one, Math.min);
  },

  /**
   * @param {Vector} one
   *
   * @returns {number}
   */
  max(one: Vector): number {
    return _innerApply(one, Math.max);
  },
}

function _innerApply(one: Vector, f: (one: number, other: number) => number): number {
  return f(one.x, one.y)
}
