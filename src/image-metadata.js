const {vector} = require('./vector');

/**
 * @typedef {object} ImageMetadata
 * @property {HTMLImageElement}    content
 * @property {import('./vector').Vector} [offset]
 * @property {number}   [scale]
 */

/**
 * @typedef {HTMLImageElement|ImageMetadata} ImageLike
 */

/**
 * @module ImageMetadata
 */

/**
 * Converts an image-like object into a true {@link ImageMetadata} object
 *
 * @param {ImageLike} imageLike
 * @returns {ImageMetadata}
 */
function asImageMetadata(imageLike) {
  if (imageLike instanceof HTMLImageElement) {
    return {
      content: imageLike,
      offset: vector(1, 1),
      scale: 1
    };
  }
  return imageLike;
}

module.exports = {
  asImageMetadata
}
