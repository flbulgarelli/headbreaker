const assert = require('assert');
const {Puzzle, Piece, Tab, Slot, None, anchor, Anchor} = require('../src/index');

describe("piece", () => {
  it("can create a piece and place it", () => {
    const piece = new Piece();
    piece.placeAt(anchor(0, 0));
    assert.deepEqual(piece.centralAnchor, anchor(0, 0));
  })

  it("there are no inserts by default", () => {
    const piece = new Piece()
    assert.equal(piece.up.isNone(), true);
    assert.equal(piece.down.isNone(), true);
    assert.equal(piece.left.isNone(), true);
    assert.equal(piece.right.isNone(), true);
  })

  it("can specify there is an upper tab", () => {
    const piece = new Piece({up: Tab})
    assert.equal(piece.up.isTab(), true);
    assert.equal(piece.up.isSlot(), false);
  })

  it("can specify there is a lower slot", () => {
    const piece = new Piece({down: Slot})
    assert.equal(piece.down.isTab(), false);
    assert.equal(piece.down.isSlot(), true);
  })

  it("can specify there there are lateral Slots an Tabs and implicit upper and bottom Non", () => {
    const piece = new Piece({left: Slot, right: Tab})
    assert.equal(piece.left.isSlot(), true);
    assert.equal(piece.right.isTab(), true);
    assert.equal(piece.up.isNone(), true);
    assert.equal(piece.down.isNone(), true);
  })

  it("can validate potential vertical matches between two matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: Slot, down: Tab})

    assert.equal(a.verticallyMatch(b), true);
    assert.equal(b.verticallyMatch(a), true);
  })

  it("can validate potential vertical matches between two partially matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: Slot, down: Slot})

    assert.equal(a.verticallyMatch(b), true);
    assert.equal(b.verticallyMatch(a), false);
  })

  it("can validate potential horizontal matches between two matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Slot, right: Tab})

    assert.equal(a.horizontallyMatch(b), true);
    assert.equal(b.horizontallyMatch(a), true);
  })

  it("can validate potential horizontal matches between two partially matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Slot, right: Slot})

    assert.equal(a.horizontallyMatch(b), true);
    assert.equal(b.horizontallyMatch(a), false);
  })

  it("can validate potential vertical matches between non matching pieces", () => {
    const a = new Piece({up: Slot, down: Tab})
    const b = new Piece({up: None, down: Slot})

    assert.equal(a.verticallyMatch(b), false);
    assert.equal(b.verticallyMatch(a), false);
  })

  it("can validate potential horizontal matches between non matching pieces", () => {
    const a = new Piece({left: Slot, right: Tab})
    const b = new Piece({left: Tab, right: None})

    assert.equal(a.horizontallyMatch(b), false);
    assert.equal(b.horizontallyMatch(a), false);
  })

  it("can create a piece from a puzzle", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece();

    assert.equal(piece.puzzle, puzzle);
  })


  it("can create a piece from a puzzle", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece();

    assert.equal(piece.puzzle, puzzle);
  })


  it("can check whether pieces are vertically close when overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 0))

    assert.equal(a.verticallyCloseTo(b), false);
    assert.equal(b.verticallyCloseTo(a), false);
  })


  it("can check whether pieces are horizontally close when overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 0))

    assert.equal(a.horizontallyCloseTo(b), false);
    assert.equal(b.horizontallyCloseTo(a), false);
  })

  it("can check whether pieces are vertically close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 20))

    assert.equal(a.verticallyCloseTo(b), false);
    assert.equal(b.verticallyCloseTo(a), false);
  })

  it("can check whether pieces are horizontally close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(20, 0))

    assert.equal(a.horizontallyCloseTo(b), false);
    assert.equal(b.horizontallyCloseTo(a), false);
  })

  it("can check whether pieces are vertically close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 2))

    assert.equal(a.verticallyCloseTo(b), false);
    assert.equal(b.verticallyCloseTo(a), false);
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(2, 0))

    assert.equal(a.horizontallyCloseTo(b), false);
    assert.equal(b.horizontallyCloseTo(a), false);
  })

  it("can check whether pieces are vertically close when close", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(0, 3))

    assert.equal(a.verticallyCloseTo(b), true);
    assert.equal(b.verticallyCloseTo(a), false);
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.placeAt(anchor(0, 0))

    const b = puzzle.newPiece();
    b.placeAt(anchor(3, 0))

    assert.equal(a.horizontallyCloseTo(b), true);
    assert.equal(b.horizontallyCloseTo(a), false);
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

    assert.equal(b.canConnectHorizontallyWith(c), true);
    assert.equal(a.canConnectHorizontallyWith(b), false);
    assert.equal(b.canConnectHorizontallyWith(a), false);
    assert.equal(c.canConnectHorizontallyWith(b), false);
  })


  it("checks if can connect vertically", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))
    c.placeAt(anchor(3, 3))

    assert.equal(a.canConnectVerticallyWith(b), true);
    assert.equal(b.canConnectVerticallyWith(a), false);
    assert.equal(b.canConnectVerticallyWith(c), false);
    assert.equal(c.canConnectVerticallyWith(b), false);
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
    assert.equal(a.connected, true);
    assert.equal(b.connected, true);
  })

  it("does not connect vertically when too away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(10, 30))

    assert.throws(() => a.connectVerticallyWith(b), /can not connect down!/);
  })

  it("connects vertically with attracts", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))

    a.connectVerticallyWith(b);

    assert.deepEqual(a.centralAnchor, anchor(0, -1));
    assert.deepEqual(b.centralAnchor, anchor(0, 3));
  })

  it("connects vertically with attracts back", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))

    a.connectVerticallyWith(b, true);

    assert.deepEqual(a.centralAnchor, anchor(0, 0));
    assert.deepEqual(b.centralAnchor, anchor(0, 4));
  })

  it("connects vertically with attracts, twice", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, down: Tab});
    const c = puzzle.newPiece({up: Slot, down: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(0, 3))
    c.placeAt(anchor(0, 6))

    a.connectVerticallyWith(b);
    b.connectVerticallyWith(c);

    assert.deepEqual(a.centralAnchor, anchor(0, -2));
    assert.deepEqual(b.centralAnchor, anchor(0, 2));
    assert.deepEqual(c.centralAnchor, anchor(0, 6));
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
    assert.equal(b.connected, true);
    assert.equal(c.connected, true);
  })

  it("does not connect horizontally when too away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(10, 30))

    assert.throws(() => a.connectHorizontallyWith(b), /can not connect right!/);
  })

  it("connects horizontally with attracts", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot, right: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(3, 0))

    a.connectHorizontallyWith(b);

    assert.deepEqual(a.centralAnchor, anchor(-1, 0));
    assert.deepEqual(b.centralAnchor, anchor(3, 0));
  })

  it("attracts right to left", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(5, 1))

    a.attractHorizontally(b);

    assert.deepEqual(a.centralAnchor, anchor(0, 0));
    assert.deepEqual(b.centralAnchor, anchor(4, 0));
  })


  it("attracts left to right", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(5, 1))

    b.attractHorizontally(a);

    assert.deepEqual(a.centralAnchor, anchor(1, 1));
    assert.deepEqual(b.centralAnchor, anchor(5, 1));
  })

  it("attracts down to up", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(1, 5))

    a.attractVertically(b);

    assert.deepEqual(a.centralAnchor, anchor(0, 0));
    assert.deepEqual(b.centralAnchor, anchor(0, 4));
  })


  it("attracts up to down", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(1, 5))

    b.attractVertically(a);

    assert.deepEqual(a.centralAnchor, anchor(1, 1));
    assert.deepEqual(b.centralAnchor, anchor(1, 5));
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

  it("pushes when has connections", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot, right: Tab, down: Slot});
    const d = puzzle.newPiece({up: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(4, 0))
    c.placeAt(anchor(8, 0))
    d.placeAt(anchor(8, 4))

    a.connectHorizontallyWith(b);
    b.connectHorizontallyWith(c);
    c.connectVerticallyWith(d);

    a.push(1, 1);

    assert.deepEqual(a.centralAnchor, anchor(1, 1));
    assert.deepEqual(b.centralAnchor, anchor(5, 1));
    assert.deepEqual(c.centralAnchor, anchor(9, 1));
    assert.deepEqual(d.centralAnchor, anchor(9, 5));
  })

  it("pushes when has connections and attracts", () => {
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

    assert.deepEqual(a.centralAnchor, anchor(-1, 0));
    assert.deepEqual(b.centralAnchor, anchor(3, 0));
    assert.deepEqual(c.centralAnchor, anchor(7, 0));
    assert.deepEqual(d.centralAnchor, anchor(7, 4));
  })

  it("pushes with double connections", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});
    const b = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});
    const c = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});
    const d = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});

    a.placeAt(anchor(0, 0))
    b.placeAt(anchor(4, 0))
    c.placeAt(anchor(0, 4))
    d.placeAt(anchor(4, 4))

    a.connectHorizontallyWith(b);
    c.connectHorizontallyWith(d);
    a.connectVerticallyWith(c);
    b.connectVerticallyWith(d);

    a.push(1, 1);

    assert.deepEqual(a.centralAnchor, anchor(1, 1));
    assert.deepEqual(b.centralAnchor, anchor(5, 1));
    assert.deepEqual(c.centralAnchor, anchor(1, 5));
    assert.deepEqual(d.centralAnchor, anchor(5, 5));
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
      b.placeAt(anchor(4, 0))
      c.placeAt(anchor(8, 0))
      d.placeAt(anchor(8, 4))

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
      assert.deepEqual(b.centralAnchor, anchor(14, 0));

      assert.equal(a.rightConnection, b);
      assert.equal(a.leftConnection, null);
      assert.equal(a.upConnection, null);
      assert.equal(a.downConnection, null);
    })

    it("drags single-connection-piece to left releasing", () => {
      a.drag(-10, 0);

      assert.deepEqual(a.centralAnchor, anchor(-10, 0));
      assert.deepEqual(b.centralAnchor, anchor(4, 0));

      assert.equal(a.rightConnection, null);
      assert.equal(a.leftConnection, null);
      assert.equal(a.upConnection, null);
      assert.equal(a.downConnection, null);
    })

    it("drags single-connection-piece up releasing", () => {
      a.drag(0, -10);

      assert.deepEqual(a.centralAnchor, anchor(0, -10));
      assert.deepEqual(b.centralAnchor, anchor(4, 0));

      assert.equal(a.rightConnection, null);
      assert.equal(a.leftConnection, null);
      assert.equal(a.upConnection, null);
      assert.equal(a.downConnection, null);
    })


    it("drags single-connection-piece down releasing", () => {
      a.drag(0, 10);

      assert.deepEqual(a.centralAnchor, anchor(0, 10));
      assert.deepEqual(b.centralAnchor, anchor(4, 0));

      assert.equal(a.rightConnection, null);
      assert.equal(a.leftConnection, null);
      assert.equal(a.upConnection, null);
      assert.equal(a.downConnection, null);
    })

    it("drags multi-connection-piece to right releasing", () => {
      c.drag(10, 0);

      assert.deepEqual(c.centralAnchor, anchor(18, 0));
      assert.deepEqual(b.centralAnchor, anchor(4, 0));
      assert.deepEqual(d.centralAnchor, anchor(8, 4));

      assert.equal(c.rightConnection, null);
      assert.equal(c.leftConnection, null);
      assert.equal(c.upConnection, null);
      assert.equal(c.downConnection, null);
    })

    it("drags multi-connection-piece to left pushing", () => {
      c.drag(-10, 0);

      assert.deepEqual(c.centralAnchor, anchor(-2, 0));
      assert.deepEqual(b.centralAnchor, anchor(-6, 0));
      assert.deepEqual(d.centralAnchor, anchor(-2, 4));

      assert.equal(c.rightConnection, null);
      assert.equal(c.leftConnection, b);
      assert.equal(c.upConnection, null);
      assert.equal(c.downConnection, d);
    })

    it("drags multi-connection-piece up releasing", () => {
      c.drag(0, -10);

      assert.deepEqual(c.centralAnchor, anchor(8, -10));
      assert.deepEqual(b.centralAnchor, anchor(4, 0));
      assert.deepEqual(d.centralAnchor, anchor(8, 4));

      assert.equal(c.rightConnection, null);
      assert.equal(c.leftConnection, null);
      assert.equal(c.upConnection, null);
      assert.equal(c.downConnection, null);
    })


    it("drags multi-connection-piece down pushing", () => {
      c.drag(0, 10);

      assert.deepEqual(c.centralAnchor, anchor(8, 10));
      assert.deepEqual(b.centralAnchor, anchor(4, 10));
      assert.deepEqual(d.centralAnchor, anchor(8, 14));

      assert.equal(c.rightConnection, null);
      assert.equal(c.leftConnection, b);
      assert.equal(c.upConnection, null);
      assert.equal(c.downConnection, d);
    })
  })

  describe("import", () => {
    it("can import piece without anchor", () => {
      const piece = Piece.import({
        centralAnchor: null,
        structure: "--TS",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {}
      });
      assert.equal(piece.centralAnchor, null);
      assert.deepEqual(piece.metadata, {});
      assert.deepEqual(piece.presentConnections, []);
    })
  })

  describe("export", () => {
    it("can export piece without anchor", () => {
      const piece = new Piece({up: Slot, left: Tab});

      assert.deepEqual(piece.export(),  {
        centralAnchor: null,
        structure: "--TS",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {}
      });
    })

    it("can export piece without metadata", () => {
      const piece = new Piece({up: Slot, left: Tab});
      piece.placeAt(anchor(10, 0));

      assert.deepEqual(piece.export(),  {
        centralAnchor: {x: 10, y: 0},
        structure: "--TS",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {}
      });
    })

    it("can export piece with metadata and anchor", () => {
      const piece = new Piece({up: Slot, left: Tab});
      piece.placeAt(anchor(10, 0));
      piece.annotate({foo: 2})

      assert.deepEqual(piece.export(),  {
        centralAnchor: {x: 10, y: 0},
        structure: "--TS",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {foo: 2}
      });
    })


    it("can export a piece with connections without metadata", () => {
      const puzzle = new Puzzle();

      let a = puzzle.newPiece({right: Tab});
      let b = puzzle.newPiece({left: Slot, right: Tab});

      a.placeAt(anchor(0, 0));
      b.placeAt(anchor(4, 0));

      a.connectHorizontallyWith(b);

      assert.deepEqual(a.export(),  {
        centralAnchor: {x: 0, y: 0},
        structure: "T---",
        connections: {right: {id: null}, down:null, left:null, up:null},
        metadata: {}
      });
    })

    it("can export a piece with connections with metadata", () => {
      const puzzle = new Puzzle();

      let a = puzzle.newPiece({right: Tab});
      a.annotate({id: 1});

      let b = puzzle.newPiece({left: Slot, right: Tab});
      b.annotate({id: 2});

      a.placeAt(anchor(0, 0))
      b.placeAt(anchor(4, 0))

      a.connectHorizontallyWith(b);

      assert.deepEqual(a.export(),  {
        centralAnchor: {x: 0, y: 0},
        structure: "T---",
        connections: {right: {id: 2}, down:null, left:null, up:null},
        metadata: {id: 1}
      });
    })
  });
})
