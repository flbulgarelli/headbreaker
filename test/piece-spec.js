// @ts-ignore
const assert = require('assert');


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
  }

  newPiece(options = {}) {
    const piece = new Piece(options);
    piece.belongsTo(this);
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
  connectVertically(other) {
    if (!this.canConnectVerticallyWith(other)) {
      throw new Error("can not connect vertically!");
    }
    this.downConnection = other;
    other.connectVerticallyBack(this);
  }

  /**
   *
   * @param {Piece} other
   */
  connectVerticallyBack(other) {
    this.upConnection = other;
  }

  /**
   *
   * @param {Piece} other
   */
  connectHorizontally(other) {
    if (!this.canConnectHorizontallyWith(other)) {
      throw new Error("can not connect horizontally!");
    }
    this.rightConnection = other;
    other.connectHorizontallyBack(this);
  }

  /**
   *
   * @param {Piece} other
   */
  connectHorizontallyBack(other) {
    this.leftConnection = other;
  }

  /**
   * @param {Puzzle} puzzle
   */
  belongsTo(puzzle) {
    this.puzzle = puzzle;

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
    throw new Error("Method not implemented.");
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

describe("anchor", () => {
  it("can translated vertically", () => {
    assert.deepEqual(anchor(1, 5).translated(0, 4), anchor(1, 9));
    assert.deepEqual(anchor(1, 5).translated(0, -5), anchor(1, 0));
  })

  it("can translated horizontally", () => {
    assert.deepEqual(anchor(1, 5).translated(4, 0), anchor(5, 5));
    assert.deepEqual(anchor(1, 5).translated(-1, 0), anchor(0, 5));
  })

  it("can check proximity when ortogonally close", () => {
    assert(anchor(0, 0).closeTo(anchor(0, 0), 2));

    assert(anchor(0, 0).closeTo(anchor(0, 2), 2));
    assert(anchor(0, 0).closeTo(anchor(0, 1), 2));

    assert(anchor(0, 0).closeTo(anchor(0, -2), 2));
    assert(anchor(0, 0).closeTo(anchor(0, -1), 2));

    assert(anchor(0, 0).closeTo(anchor(2, 0), 2));
    assert(anchor(0, 0).closeTo(anchor(-2, 0), 2));
  })

  it("can check proximity when ortogonally away", () => {
    assert(!anchor(0, 0).closeTo(anchor(0, 2), 1));
    assert(!anchor(0, 0).closeTo(anchor(0, -2), 1));
    assert(!anchor(0, 0).closeTo(anchor(2, 0), 1));
    assert(!anchor(0, 0).closeTo(anchor(-2, 0), 1));
  })

})

describe("piece", () => {
  it("can create a piece and place it", () => {
    const piece = new Piece();
    piece.placeAt(anchor(0, 0));
    assert.deepEqual(piece.centralAnchor, anchor(0, 0));
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
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 0))

    assert(!a.verticallyCloseTo(b));
    assert(!b.verticallyCloseTo(a));
  })


  it("can check whether pieces are horizontally close when overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 0))

    assert(!a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("can check whether pieces are vertically close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 20))

    assert(!a.verticallyCloseTo(b));
    assert(!b.verticallyCloseTo(a));
  })

  it("can check whether pieces are horizontally close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(20, 0))

    assert(!a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("can check whether pieces are vertically close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 2))

    assert(!a.verticallyCloseTo(b));
    assert(!b.verticallyCloseTo(a));
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(2, 0))

    assert(!a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("can check whether pieces are vertically close when close", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 3))

    assert(a.verticallyCloseTo(b));
    assert(!b.verticallyCloseTo(a));
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(3, 0))

    assert(a.horizontallyCloseTo(b));
    assert(!b.horizontallyCloseTo(a));
  })

  it("knows its positive inserts positions", () => {
    const puzzle = new Puzzle();

    const piece = puzzle.newPiece();
    piece.placeAt(anchor(0, 0))

    assert.deepEqual(piece.downAnchor, anchor(0, 2));
    assert.deepEqual(piece.rightAnchor, anchor(2, 0));
  })

  it("knows its negative inserts positions", () => {
    const puzzle = new Puzzle();

    const piece = puzzle.newPiece();
    piece.placeAt(anchor(0, 0))

    assert.deepEqual(piece.upAnchor, anchor(0, -2));
    assert.deepEqual(piece.leftAnchor, anchor(-2, 0));
  })

  it("checks if can connect horizontally", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))
    c.placeAt(anchor(3, 3))

    assert(b.canConnectHorizontallyWith(c));
    assert(!a.canConnectHorizontallyWith(b));
    assert(!b.canConnectHorizontallyWith(a));
    assert(!c.canConnectHorizontallyWith(b));
  })


  it("checks if can connect vertically", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))
    c.placeAt(anchor(3, 3))

    assert(a.canConnectVerticallyWith(b));
    assert(!b.canConnectVerticallyWith(a));
    assert(!b.canConnectVerticallyWith(c));
    assert(!c.canConnectVerticallyWith(b));
  })


  it("connects vertically", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))
    c.placeAt(anchor(3, 3))

    a.connectVertically(b);
    assert.equal(a.downConnection, b);
  })


  it("connects horizontally", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))
    c.placeAt(anchor(3, 3))

    b.connectHorizontally(c);
    assert.equal(b.rightConnection, c);
  })


  it("translates", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece({down: Tab});

    piece.placeAt(anchor(0, 0));
    piece.translate(10, 5);

    assert.deepEqual(piece.centralAnchor, anchor(10, 5));

  })
})

