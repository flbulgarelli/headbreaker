import between from './between';
import pair, { Pair } from './pair';
import vector, { Vector } from './vector';

/**
 * An Anchor is a mutable 2D point that
 * is used to locate pieces and pieces inserts
 */
export class Anchor {
  x: number;
  y: number;

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Anchor} other
   * @returns {boolean}
   */
  equal(other: Anchor): boolean {
    return this.isAt(other.x, other.y);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  isAt(x: number, y: number): boolean {
    return pair.equal(this.x, this.y, x, y);
  }

  /**
   * Creates a translated copy of this Anchor
   * according to a vector
   *
   * @param {number} dx
   * @param {number} dy
   * @returns {Anchor}
   */
  translated(dx: number, dy: number): Anchor {
    return this.copy().translate(dx, dy);
  }

  /**
   * Translates this anchor given to a vector
   *
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx: number, dy: number) {
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
  closeTo(other: Anchor, tolerance: number): boolean {
    return between(this.x, other.x-tolerance, other.x + tolerance) && between(this.y, other.y-tolerance, other.y + tolerance)
  }

  /**
   * @returns {Anchor}
   */
  copy(): Anchor {
    return new Anchor(this.x, this.y);
  }

  /**
   * Calculates the difference between this anchor and another
   *
   * @param {Anchor} other
   * @returns {Pair}
   */
  diff(other: Anchor): Pair {
    return pair.diff(this.x, this.y, other.x, other.y)
  }

  /**
   * Converts this anchor into a point
   *
   * @returns {Pair}
   */
  asPair(): Pair {
    return pair(this.x, this.y);
  }

  /**
   * Converts this anchor into a vector
   *
   * @returns {Vector}
   */
  asVector(): Vector {
    return vector(this.x, this.y);
  }

  /**
   * @returns {Vector}
   */
  export(): Vector {
    return this.asVector();
  }

  /**
   * @param {number} maxX
   * @param {number} maxY
   * @returns {Anchor}
   */
  static atRandom(maxX: number, maxY: number): Anchor {
    return new Anchor(Math.random() * maxX, Math.random() * maxY);
  }

  /**
   *
   * @param {Vector} vector
   * @returns {Anchor}
   */
  static import(vector: Vector): Anchor {
    return anchor(vector.x, vector.y);
  }
}

/**
 * Creates a new {@link Anchor}
 *
 * @param {number} x
 * @param {number} y
 * @returns {Anchor}
 */
export function anchor(x: number, y: number): Anchor {
  return new Anchor(x, y);
}
