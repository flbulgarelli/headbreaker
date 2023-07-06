import vector, { Vector } from './vector';

export interface Size {
  radius: Vector;
  diameter: Vector;
}

/**
 * @param {Vector|number} value
 * @returns {Size}
 */
export function radius(value: Vector | number): Size {
  const v = vector.cast(value)
  return {
    radius: v,
    diameter: vector.multiply(v, 2)
  };
}

/**
 * @param {Vector|number} value
 * @returns {Size}
 */
export function diameter(value: Vector | number): Size {
  const v = vector.cast(value)
  return {
    radius: vector.multiply(v, 0.5),
    diameter: v
  };
}
