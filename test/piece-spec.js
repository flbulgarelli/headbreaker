const assert = require('assert');


class Point {

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
   * @param {Point} other
   * @returns {boolean}
   */
  equals(other) {
    return other.x == this.x && other.y == this.y;
  }

  /**
   *
   * @param {number} dy
   */
  vericallyTranslate(dy) {
    return new Point(this.x, this.y + dy);
  }

  /**
   *
   * @param {number} dx
   */
  horizontallyTranslate(dx) {
    return new Point(this.x + dx, this.y);
  }

  /**
   *
   * @param {Point} other
   * @param {number} tolerance
   * @returns {boolean}
   */
  closeTo(other, tolerance) {
    return between(this.x, other.x-tolerance, other.x + tolerance) && between(this.y, other.y-tolerance, other.y + tolerance)
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
  }

  newPiece(options = {}) {
    const piece = new Piece(options);
    piece.puzzle = this;
    return piece;
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
   *
   * @param {Point} point
   */
  placeAt(point) {
    this.position = point;
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  vericallyCloseTo(other) {
    return this.downPosition.closeTo(other.upPosition, this.proximityTolerance);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  horizontallyCloseTo(other) {
    return this.rightPosition.closeTo(other.leftPosition, this.proximityTolerance);
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
   * @return {Point}
   */
  get downPosition() {
    return this.position.vericallyTranslate(this.size);
  }

  /**
   * @return {Point}
   */
  get rightPosition() {
    return this.position.horizontallyTranslate(this.size);
  }

  /**
   * @return {Point}
   */
  get upPosition() {
    return this.position.vericallyTranslate(-this.size);
  }

  /**
   * @return {Point}
   */
  get leftPosition() {
    return this.position.horizontallyTranslate(-this.size);
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
 * @returns {Point}
 */
function point(x, y) {
  return new Point(x, y);
}

describe("point", () => {
  it("can translate vertically", () => {
    assert.deepEqual(point(1, 5).vericallyTranslate(4), point(1, 9));
    assert.deepEqual(point(1, 5).vericallyTranslate(-5), point(1, 0));
  })

  it("can translate horizontally", () => {
    assert.deepEqual(point(1, 5).horizontallyTranslate(4), point(5, 5));
    assert.deepEqual(point(1, 5).horizontallyTranslate(-1), point(0, 5));
  })

  it("can check proximity when ortogonally close", () => {
    assert(point(0, 0).closeTo(point(0, 0), 2));

    assert(point(0, 0).closeTo(point(0, 2), 2));
    assert(point(0, 0).closeTo(point(0, 1), 2));

    assert(point(0, 0).closeTo(point(0, -2), 2));
    assert(point(0, 0).closeTo(point(0, -1), 2));

    assert(point(0, 0).closeTo(point(2, 0), 2));
    assert(point(0, 0).closeTo(point(-2, 0), 2));
  })

  it("can check proximity when ortogonally away", () => {
    assert(!point(0, 0).closeTo(point(0, 2), 1));
    assert(!point(0, 0).closeTo(point(0, -2), 1));
    assert(!point(0, 0).closeTo(point(2, 0), 1));
    assert(!point(0, 0).closeTo(point(-2, 0), 1));
  })

})

describe("piece", () => {
  it("can create a piece and place it", () => {
    const piece = new Piece();
    piece.placeAt(point(0, 0));
    assert.deepEqual(piece.position, point(0, 0));
  })

  it("there are no inserts by default", () => {
    const piece = new Piece()
    assert(piece.up.isNone())
    assert(piece.down.isNone())
    assert(piece.left.isNone())
    assert(piece.right.isNone())
  })

  it("can specify there is an upper tab", () => {
    const piece = new Piece({up: Tab})
    assert(piece.up.isTab())
    assert(!piece.up.isSlot())
  })

  it("can specify there is a lower slot", () => {
    const piece = new Piece({down: Slot})
    assert(!piece.down.isTab())
    assert(piece.down.isSlot())
  })

  it("can specify there there are lateral Slots an Tabs and implicit upper and bottom Non", () => {
    const piece = new Piece({left: Slot, right: Tab})
    assert(piece.left.isSlot())
    assert(piece.right.isTab())
    assert(piece.up.isNone())
    assert(piece.down.isNone())
  })

  it("can validate potential vertical matches between two matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: Slot, down: Tab})

    assert(a.verticallyMatch(b))
    assert(b.verticallyMatch(a))
  })

  it("can validate potential vertical matches between two partially matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: Slot, down: Slot})

    assert(a.verticallyMatch(b))
    assert(!b.verticallyMatch(a))
  })

  it("can validate potential horizontal matches between two matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Slot, right: Tab})

    assert(a.horizontallyMatch(b))
    assert(b.horizontallyMatch(a))
  })

  it("can validate potential horizontal matches between two partially matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Slot, right: Slot})

    assert(a.horizontallyMatch(b))
    assert(!b.horizontallyMatch(a))
  })

  it("can validate potential vertical matches between non matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: None, down: Slot})

    assert(!a.verticallyMatch(b))
    assert(!b.verticallyMatch(a))
  })

  it("can validate potential horizontal matches between non matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Tab, right: None})

    assert(!a.horizontallyMatch(b))
    assert(!b.horizontallyMatch(a))
  })

  it("can create a piece from a puzzle", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece();

    assert(piece.puzzle === puzzle);
  })


  it("can create a piece from a puzzle", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece();

    assert(piece.puzzle === puzzle);
  })


  it("can check whether pieces are vertically close when overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(0, 0))

    assert(!a.vericallyCloseTo(b));
    assert(!b.vericallyCloseTo(a));
  })


  it("can check whether pieces are horizontally close when overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(0, 0))

    assert(!a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("can check whether pieces are vertically close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(0, 20))

    assert(!a.vericallyCloseTo(b));
    assert(!b.vericallyCloseTo(a));
  })

  it("can check whether pieces are horizontally close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(20, 0))

    assert(!a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("can check whether pieces are vertically close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(0, 2))

    assert(!a.vericallyCloseTo(b));
    assert(!b.vericallyCloseTo(a));
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(2, 0))

    assert(!a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("can check whether pieces are vertically close when close", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(0, 3))

    assert(a.vericallyCloseTo(b));
    assert(!b.vericallyCloseTo(a));
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(point(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(point(3, 0))

    assert(a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("knows its positive inserts positions", () => {
    const puzzle = new Puzzle();

    const piece = puzzle.newPiece();
    piece.placeAt(point(0, 0))

    assert.deepEqual(piece.downPosition, point(0, 2));
    assert.deepEqual(piece.rightPosition, point(2, 0));
  })

  it("knows its negative inserts positions", () => {
    const puzzle = new Puzzle();

    const piece = puzzle.newPiece();
    piece.placeAt(point(0, 0))

    assert.deepEqual(piece.upPosition, point(0, -2));
    assert.deepEqual(piece.leftPosition, point(-2, 0));
  })

})

