/**
 * @param {number} dx
 * @param {number} dy
 * @returns {boolean}
 */
function isNull(dx, dy) {
  return dx === 0 && dy === 0;
}

/**
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {[number, number]}
 */
function diff(x1, y1, x2, y2) {
  return [x1 - x2, y1 - y2];
}

module.exports = {
  isNull,
  diff
}


