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
function between(value, min, max) {
  return min <= value && value <= max;
}

module.exports = between;
