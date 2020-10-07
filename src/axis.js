

/**
 * @typedef {Vertical|Horizontal} Axis
 */

const Vertical = {
  /**
   * @param {import("./vector").Vector} vector
   * @returns {number}
   */
  atVector(vector) {
    return vector.y
  },

  /**
   * @param {HTMLImageElement|HTMLCanvasElement} image
   * @returns {number}
   */
  atDimension(image) {
    return image.height;
  }
}

const Horizontal = {
  /**
   * @param {import("./vector").Vector} vector
   * @returns {number}
   */
  atVector(vector) {
    return vector.x
  },

  /**
   * @param {HTMLImageElement|HTMLCanvasElement} image
   * @returns {number}
   */
  atDimension(image) {
    return image.width;
  }
}

module.exports = {
  Vertical,
  Horizontal
}
