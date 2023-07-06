

import { Vector } from "./vector";

/**
 * @typedef {Vertical|Horizontal} Axis
 */

export const Vertical = {
  /**
   * @param {Vector} vector
   * @returns {number}
   */
  atVector(vector: Vector): number {
    return vector.y
  },

  /**
   * @param {HTMLImageElement|HTMLCanvasElement} image
   * @returns {number}
   */
  atDimension(image: HTMLImageElement | HTMLCanvasElement): number {
    return image.height;
  }
}

export const Horizontal = {
  /**
   * @param {Vector} vector
   * @returns {number}
   */
  atVector(vector: Vector): number {
    return vector.x
  },

  /**
   * @param {HTMLImageElement|HTMLCanvasElement} image
   * @returns {number}
   */
  atDimension(image: HTMLImageElement | HTMLCanvasElement): number {
    return image.width;
  }
}
