/**
 * @private
 * @module between
 * */

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export default function between(value: number, min: number, max: number): boolean {
  return min <= value && value <= max;
}
