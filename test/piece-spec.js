// @ts-ignore
const assert = require('assert');
// @ts-ignore
const {anchor, Puzzle, Anchor, Piece, Tab, Slot, None} = require('../src/index');

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

    a.connectVerticallyWith(b);
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

    b.connectHorizontallyWith(c);
    assert.equal(b.rightConnection, c);
  })


  it("translates", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece({down: Tab});

    piece.placeAt(anchor(0, 0));
    piece.translate(10, 5);

    assert.deepEqual(piece.centralAnchor, anchor(10, 5));
  })


  it("pushes when no connections", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece({down: Tab});

    piece.placeAt(anchor(0, 0));
    piece.push(10, 5);

    assert.deepEqual(piece.centralAnchor, anchor(10, 5));
  })

  it("pushes when no connections", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot, right: Tab, down: Slot});
    const d = puzzle.newPiece({up: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(3, 0))
    c.placeAt(anchor(6, 0))
    d.placeAt(anchor(6, 3))

    a.connectHorizontallyWith(b);
    b.connectHorizontallyWith(c);
    c.connectVerticallyWith(d);

    a.push(1, 1);

    assert.deepEqual(a.centralAnchor, anchor(1, 1));
    assert.deepEqual(b.centralAnchor, anchor(4, 1));
    assert.deepEqual(c.centralAnchor, anchor(7, 1));
    assert.deepEqual(d.centralAnchor, anchor(7, 4));
  })


  it("drags when no connections", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece({down: Tab});

    piece.placeAt(anchor(0, 0));
    piece.drag(10, 5);
    piece.drag(-1, 0);
    piece.drag(0, -2);

    assert.deepEqual(piece.centralAnchor, anchor(9, 3));
  })

  describe("drags when there are connections", () => {
    let puzzle;
    let a, b, c, d;

    beforeEach(() => {
      puzzle = new Puzzle();

      a = puzzle.newPiece({right: Tab});
      b = puzzle.newPiece({left: Slot, right: Tab});
      c = puzzle.newPiece({left: Slot, right: Tab, down: Slot});
      d = puzzle.newPiece({up: Tab});

      a.placeAt(anchor(0, 0))
      b.placeAt(anchor(3, 0))
      c.placeAt(anchor(6, 0))
      d.placeAt(anchor(6, 3))

      // a > b > c
      //         v
      //         d
      a.connectHorizontallyWith(b);
      b.connectHorizontallyWith(c);
      c.connectVerticallyWith(d);
    });


    it("drags single-connection-piece to right pushing", () => {
      a.drag(10, 0);

      assert.deepEqual(a.centralAnchor, anchor(10, 0));
      assert.deepEqual(b.centralAnchor, anchor(13, 0));

      assert.equal(a.rightConnection, b);
      assert(!a.leftConnection);
      assert(!a.upConnection);
      assert(!a.downConnection);
    })

    it("drags single-connection-piece to left releasing", () => {
      a.drag(-10, 0);

      assert.deepEqual(a.centralAnchor, anchor(-10, 0));
      assert.deepEqual(b.centralAnchor, anchor(3, 0));

      assert(!a.rightConnection);
      assert(!a.leftConnection);
      assert(!a.upConnection);
      assert(!a.downConnection);
    })

    it("drags single-connection-piece up releasing", () => {
      a.drag(0, -10);

      assert.deepEqual(a.centralAnchor, anchor(0, -10));
      assert.deepEqual(b.centralAnchor, anchor(3, 0));

      assert(!a.rightConnection);
      assert(!a.leftConnection);
      assert(!a.upConnection);
      assert(!a.downConnection);
    })


    it("drags single-connection-piece down releasing", () => {
      a.drag(0, 10);

      assert.deepEqual(a.centralAnchor, anchor(0, 10));
      assert.deepEqual(b.centralAnchor, anchor(3, 0));

      assert(!a.rightConnection);
      assert(!a.leftConnection);
      assert(!a.upConnection);
      assert(!a.downConnection);
    })

    it("drags multi-connection-piece to right releasing", () => {
      c.drag(10, 0);

      assert.deepEqual(c.centralAnchor, anchor(16, 0));
      assert.deepEqual(b.centralAnchor, anchor(3, 0));
      assert.deepEqual(d.centralAnchor, anchor(6, 3));

      assert(!c.rightConnection);
      assert(!c.leftConnection);
      assert(!c.upConnection);
      assert(!c.downConnection);
    })

    it("drags multi-connection-piece to left pushing", () => {
      c.drag(-10, 0);

      assert.deepEqual(c.centralAnchor, anchor(-4, 0));
      assert.deepEqual(b.centralAnchor, anchor(-7, 0));
      assert.deepEqual(d.centralAnchor, anchor(-4, 3));

      assert(!c.rightConnection);
      assert(c.leftConnection);
      assert(!c.upConnection);
      assert(c.downConnection);
    })

    it("drags multi-connection-piece up releasing", () => {
      c.drag(0, -10);

      assert.deepEqual(c.centralAnchor, anchor(6, -10));
      assert.deepEqual(b.centralAnchor, anchor(3, 0));
      assert.deepEqual(d.centralAnchor, anchor(6, 3));

      assert(!c.rightConnection);
      assert(!c.leftConnection);
      assert(!c.upConnection);
      assert(!c.downConnection);
    })


    it("drags multi-connection-piece down pushing", () => {
      c.drag(0, 10);

      assert.deepEqual(c.centralAnchor, anchor(6, 10));
      assert.deepEqual(b.centralAnchor, anchor(3, 10));
      assert.deepEqual(d.centralAnchor, anchor(6, 13));

      assert(!c.rightConnection);
      assert(c.leftConnection);
      assert(!c.upConnection);
      assert(c.downConnection);
    })
  })


})

it("autoconnects puzzle", () => {
  const puzzle = new Puzzle();

  puzzle
    .newPiece({right: Tab})
    .placeAt(anchor(0, 0));
  puzzle
    .newPiece({left: Slot, right: Tab})
    .placeAt(anchor(3, 0));
  puzzle
    .newPiece({left: Slot, right: Tab, down: Slot})
    .placeAt(anchor(6, 0));
  puzzle
    .newPiece({up: Tab})
    .placeAt(anchor(6, 3));

  puzzle.autoconnect();

  const [a, b, c, d] = puzzle.pieces;

  assert.equal(a.rightConnection, b);
  assert.equal(b.rightConnection, c);
  assert.equal(c.downConnection, d);
})
