const position = require('./position');

/**
 * @typedef {object} ImageMetadata
 * @property {HTMLImageElement}    content
 * @property {import('./position').Position} [offset]
 * @property {number}   [scale]
 */

/**
 * @typedef {HTMLImageElement|ImageMetadata} ImageLike
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
      offset: position(1, 1),
      scale: 1
    };
  }
  return imageLike;
}


module.exports = {
  asImageMetadata
}
