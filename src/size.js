const Vector = require('./vector');

/**
 * @typedef {Object} Size
 * @property {import('./vector').Vector} radio
 * @property {import('./vector').Vector} diameter
 **/


/**
 * @param {import('./vector').Vector|number} value
 * @returns {Size}
 */
function radio(value) {
  const vector = Vector.cast(value)
  return {
    radio: vector,
    diameter: Vector.multiply(vector, 2)
  };
}

/**
 * @param {import('./vector').Vector|number} value
 * @returns {Size}
 */
function diameter(value) {
  const vector = Vector.cast(value)
  return {
    radio: Vector.multiply(vector, 0.5),
    diameter: vector
  };
}

module.exports = {
  radio,
  diameter
}
