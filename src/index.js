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

  copy() {
    return new Anchor(this.x, this.y);
  }
}

/**
 * @param {*} value
 * @param {*} min
 * @param {*} max
 * @returns {boolean}
 */
function between(value, min, max) {
  return min <= value && value <= max;
}

class Puzzle {
  /**
   *
   * @param {number} pieceSize
   * @param {number} proximityTolerance
   */
  constructor(pieceSize = 2, proximityTolerance = 1) {
    this.pieceSize = pieceSize;
    this.proximityTolerance = proximityTolerance;
    /** @type {Piece[]} */
    this.pieces = [];
  }

  newPiece(options = {}) {
    const piece = new Piece(options);
    this.pieces.push(piece);
    piece.belongsTo(this);
    return piece;
  }

  /**
   * Tries to connect pieces in their current positions
   * This method is O(n * (n-1))
   */
  autoconnect() {
    this.pieces.forEach(a => {
      this.pieces.filter(it => it !== a).forEach(b => {
        a.tryConnectHorizontallyWith(b);
        a.tryConnectVerticallyWith(b);
      })
    })
  }
}



class Piece {

  constructor({up = None, down = None, left = None, right = None} = {}) {
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
  }

  /**
   * @param {Puzzle} puzzle
   */
  belongsTo(puzzle) {
    this.puzzle = puzzle;

  }

  /**
   * @returns {Piece[]}
   */
  get connections() {
    return [
      this.upConnection,
      this.downConnection,
      this.leftConnection,
      this.rightConnection
    ].filter(it => it);
  }

  /**
   *
   * @param {Piece} other
   */
  connectVerticallyWith(other) {
    if (!this.canConnectVerticallyWith(other)) {
      throw new Error("can not connect vertically!");
    }
    this.downConnection = other;
    other.upConnection = this;
  }

  /**
   *
   * @param {Piece} other
   */
  connectHorizontallyWith(other) {
    if (!this.canConnectHorizontallyWith(other)) {
      throw new Error("can not connect horizontally!");
    }
    this.rightConnection = other;
    other.leftConnection = this;
  }

  /**
   *
   * @param {Piece} other
   */
  tryConnectHorizontallyWith(other) {
    if (this.canConnectHorizontallyWith(other)) {
      this.connectHorizontallyWith(other);
    }
  }
  /**
   *
   * @param {Piece} other
   */
  tryConnectVerticallyWith(other) {
    if (this.canConnectVerticallyWith(other)) {
      this.connectVerticallyWith(other);
    }
  }

  disconnect() {
    if (this.upConnection) {
      this.upConnection.downConnection = null;
      /** @type {Piece} */
      this.upConnection = null;
    }

    if (this.downConnection) {
      this.downConnection.upConnection = null;
      this.downConnection = null;
    }

    if (this.leftConnection) {
      this.leftConnection.rightConnection = null;
      /** @type {Piece} */
      this.leftConnection = null;
    }

    if (this.rightConnection) {
      this.rightConnection.leftConnection = null;
      this.rightConnection = null;
    }
  }

  /**
   *
   * @param {Anchor} anchor
   */
  placeAt(anchor) {
    this.centralAnchor = anchor;
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx, dy) {
    this.centralAnchor.translate(dx, dy);
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   * @param {Piece[]} pushedPieces
   */
  push(dx, dy, pushedPieces = []) {
    const stationaries = this.connections.filter(it => pushedPieces.indexOf(it) === -1);

    this.translate(dx, dy);

    pushedPieces.push(this);
    stationaries.forEach(it =>it.push(dx, dy, pushedPieces));
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   */
  drag(dx, dy) {
    if (dx == 0 && dy == 0) return;

    if (this.horizontallyOpenMovement(dx) && this.vericallyOpenMovement(dy)) {
      this.disconnect();
      this.translate(dx, dy);
    } else {
      this.push(dx, dy);
    }
  }

  /**
   *
   * @param {number} dy
   * @returns {boolean}
   */
  vericallyOpenMovement(dy) {
    return (dy > 0 && !this.downConnection) || (dy < 0 && !this.upConnection) || dy == 0;
  }

  /**
   *
   * @param {number} dx
   * @returns {boolean}
   */
  horizontallyOpenMovement(dx) {
    return (dx > 0 && !this.rightConnection) || (dx < 0 && !this.leftConnection) || dx == 0;
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  canConnectHorizontallyWith(other) {
    return this.horizontallyCloseTo(other) && this.horizontallyMatch(other);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  canConnectVerticallyWith(other) {
    return this.verticallyCloseTo(other) && this.verticallyMatch(other);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  verticallyCloseTo(other) {
    return this.downAnchor.closeTo(other.upAnchor, this.proximityTolerance);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  horizontallyCloseTo(other) {
    return this.rightAnchor.closeTo(other.leftAnchor, this.proximityTolerance);
  }


  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  verticallyMatch(other) {
    return this.down.match(other.up);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  horizontallyMatch(other) {
    return this.right.match(other.left);
  }

  /**
   * @return {Anchor}
   */
  get downAnchor() {
    return this.centralAnchor.translated(0, this.size);
  }

  /**
   * @return {Anchor}
   */
  get rightAnchor() {
    return this.centralAnchor.translated(this.size, 0);
  }

  /**
   * @return {Anchor}
   */
  get upAnchor() {
    return this.centralAnchor.translated(0, -this.size);
  }

  /**
   * @return {Anchor}
   */
  get leftAnchor() {
    return this.centralAnchor.translated(-this.size, 0);
  }

  /**
   * @return {number}
   */
  get size() {
    return this.puzzle.pieceSize;
  }

  /**
   * @returns {number}
   */
  get proximityTolerance() {
    return this.puzzle.proximityTolerance;
  }

}

/**
 * @typedef {(Tab|Slot|None)} Insert
 */

const Tab = {
  isSlot: () => false,
  isTab:  () => true,
  isNone:  () => false,
  match: (other) => other.isSlot()
}

const Slot = {
  isSlot: () => true,
  isTab:  () => false,
  isNone:  () => false,
  match: (other) => other.isTab()

}

const None = {
  isSlot: () => false,
  isTab:  () => false,
  isNone:  () => true,
  match: (other) => false
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

// @ts-ignore
module.exports = {
  anchor,
  Anchor,
  None,
  Piece,
  Puzzle,
  Slot,
  Tab
}
