const Vector = require('./vector');

/**
 * @typedef {Object} Size
 * @property {import('./vector').Vector} radius
 * @property {import('./vector').Vector} diameter
 **/


/**
 * @param {import('./vector').Vector|number} value
 * @returns {Size}
 */
function radius(value) {
  const vector = Vector.cast(value)
  return {
    radius: vector,
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
    radius: Vector.multiply(vector, 0.5),
    diameter: vector
  };
}

module.exports = {
  radius,
  diameter
}
