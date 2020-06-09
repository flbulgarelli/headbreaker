const between = require('./between');
const vector = require('./vector')

class Anchor {

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @param {Anchor} other
   * @returns {boolean}
   */
  equals(other) {
    return other.x == this.x && other.y == this.y;
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   */
  translated(dx, dy) {
    return this.copy().translate(dx, dy);
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx, dy) {
    this.x += dx;
    this.y += dy;
    return this;
  }

  /**
   *
   * @param {Anchor} other
   * @param {number} tolerance
   * @returns {boolean}
   */
  closeTo(other, tolerance) {
    return between(this.x, other.x-tolerance, other.x + tolerance) && between(this.y, other.y-tolerance, other.y + tolerance)
  }

  /**
   * @returns {Anchor}
   */
  copy() {
    return new Anchor(this.x, this.y);
  }

  /**
   *
   * @param {Anchor} other
   * @returns {[number, number]}
   */
  diff(other) {
    return vector.diff(this.x, this.y, other.x, other.y)
  }

  /**
   * @param {number} maxX
   * @param {number} maxY
   * @returns {Anchor}
   */
  static atRandom(maxX, maxY) {
    return new Anchor(Math.random() * maxX, Math.random() * maxY);
  }

}

/**
 *
 * @param {number} x
 * @param {number} y
 * @returns {Anchor}
 */
function anchor(x, y) {
  return new Anchor(x, y);
}


module.exports = {
  anchor,
  Anchor
}
