import Vector = require('./vector');

interface Size {
  radius: import('./vector').Vector;
  diameter: import('./vector').Vector;
}

/**
 * @param {import('./vector').Vector|number} value
 * @returns {Size}
 */
export function radius(value: import('./vector').Vector | number): Size {
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
export function diameter(value: import('./vector').Vector | number): Size {
  const vector = Vector.cast(value)
  return {
    radius: Vector.multiply(vector, 0.5),
    diameter: vector
  };
}
