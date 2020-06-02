const assert = require('assert');

class Puzzle {
  /**
   *
   * @param {number} pieceSize
   */
  constructor(pieceSize = 1) {
    this.pieceSize = pieceSize;
  }

  newPiece(options = {}) {
    const piece = new Piece(options);
    piece.puzzle = this;
    return piece;
  }
}

class Piece {

  constructor({up, down, left, right} = {}) {
    this.up = up || None;
    this.down = down || None;
    this.left = left || None;
    this.right = right || None;
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
  mayMatchVertically(other) {
    return this.down.match(other.up);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  mayMatchHorizontally(other) {
    return this.right.match(other.left);
  }

  get pieceSize() {
    return this.puzzle.pieceSize;
  }

}

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

}

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

    assert(a.mayMatchVertically(b))
    assert(b.mayMatchVertically(a))
  })

  it("can validate potential vertical matches between two partially matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: Slot, down: Slot})

    assert(a.mayMatchVertically(b))
    assert(!b.mayMatchVertically(a))
  })

  it("can validate potential horizontal matches between two matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Slot, right: Tab})

    assert(a.mayMatchHorizontally(b))
    assert(b.mayMatchHorizontally(a))
  })

  it("can validate potential horizontal matches between two partially matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Slot, right: Slot})

    assert(a.mayMatchHorizontally(b))
    assert(!b.mayMatchHorizontally(a))
  })

  it("can validate potential vertical matches between non matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: None, down: Slot})

    assert(!a.mayMatchVertically(b))
    assert(!b.mayMatchVertically(a))
  })

  it("can validate potential horizontal matches between non matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Tab, right: None})

    assert(!a.mayMatchHorizontally(b))
    assert(!b.mayMatchHorizontally(a))
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



})

