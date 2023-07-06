/**
 * Utilities for handling 2D vectors, expressed a two-elements list
 *
 * @module pair
 */

export type Pair = [number, number];

export default function pair(x: number, y: number): Pair {
  return [x, y];
}

/**
 * Tells whether this pair is (0, 0)
 *
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
pair.isNull = (x: number, y: number): boolean => {
  return pair.equal(x, y, 0, 0);
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} [delta] tolerance in comparison
 * @returns {boolean}
 */
pair.equal = (x1: number, y1: number, x2: number, y2: number, delta: number = 0): boolean => {
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
pair.diff = (x1: number, y1: number, x2: number, y2: number): Pair => {
  return [x1 - x2, y1 - y2];
}
