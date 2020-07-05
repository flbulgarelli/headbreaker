const between = require('./between');
const Vector = require('./vector')
const {position} = require('./position')

/**
 * An Anchor is a mutable 2D point that
 * is used to locate pieces and pieces inserts
 */
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
   * @param {Anchor} other
   * @returns {boolean}
   */
  equal(other) {
    return this.isAt(other.x, other.y);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isAt(x, y) {
    return this.x === x && this.y === y;
  }

  /**
   * Creates a translated copy of this Anchor
   * according to a vector
   *
   * @param {number} dx
   * @param {number} dy
   */
  translated(dx, dy) {
    return this.copy().translate(dx, dy);
  }

  /**
   * Translates this anchor given to a vector
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
   * Answers whether this Anchor is near to another given a tolerance
   *
   * @param {Anchor} other
   * @param {number} tolerance the max distance within its radius is considered to be "close"
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
   * Calculates the difference between this anchor and another
   *
   * @param {Anchor} other
   * @returns {[number, number]}
   */
  diff(other) {
    return Vector.diff(this.x, this.y, other.x, other.y)
  }

  /**
   * @returns {import('./position').Position}
   */
  export() {
    return position(this.x, this.y);
  }

  /**
   * @param {number} maxX
   * @param {number} maxY
   * @returns {Anchor}
   */
  static atRandom(maxX, maxY) {
    return new Anchor(Math.random() * maxX, Math.random() * maxY);
  }

  /**
   *
   * @param {import('./position').Position} position
   * @returns {Anchor}
   */
  static import(position) {
    return anchor(position.x, position.y);
  }
}

/**
 * Creates a new {@link Anchor}
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
