const assert = require('assert');
import {Puzzle, Piece, Tab, Slot, None, anchor, vector, radius, diameter} from '../src/index';

describe("piece", () => {
  describe("can annotate a piece", () => {
    it("can annotate with undefined or null", () => {
      const piece = new Piece();
      piece.annotate(null);
      piece.annotate(undefined);
      assert.deepEqual(piece.metadata, {});
    })

    it("can annotate with right values", () => {
      const piece = new Piece();
      piece.annotate({foo: 1})
      piece.annotate({bar: 2});
      assert.deepEqual(piece.metadata, {foo: 1, bar: 2});
    })
  })

  it("can create a piece and place it", () => {
    const piece = new Piece();
    piece.locateAt(0, 0);
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

  it("can configure a piece", () => {
    const piece = new Piece({ up: Slot, left: Tab });
    piece.configure({
      centralAnchor: anchor(10, 0),
      size: diameter(4)
    });

    assert.deepEqual(piece.radius, vector(2, 2));
    assert.deepEqual(piece.centralAnchor, anchor(10, 0));
    assert.deepEqual(piece.metadata, {});
  })

  it("can create a piece with config", () => {
    const piece = new Piece(
      { up: Slot, left: Tab },
      { metadata: {foo: 2}, centralAnchor: vector(10, 0), size: radius(4) });

    assert.deepEqual(piece.radius, vector(4, 4));
    assert.deepEqual(piece.centralAnchor, anchor(10, 0));
    assert.deepEqual(piece.metadata, {foo: 2});
  })

  it("can create a piece from a puzzle", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece();

    assert.equal(piece.puzzle, puzzle);
  })

  it("can compute diameter multiple times", () => {
    const puzzle = new Puzzle({pieceRadius: vector(3, 2)});
    const piece = puzzle.newPiece();

    assert.deepEqual(piece.diameter, vector(6, 4));
    assert.deepEqual(piece.diameter, vector(6, 4));
  })

  it("can override piece size with scalar", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece();

    assert.deepEqual(piece.radius, vector(2, 2));
    assert.deepEqual(piece.diameter, vector(4, 4));

    piece.resize(radius(5));

    assert.deepEqual(piece.radius, vector(5, 5));
    assert.deepEqual(piece.diameter, vector(10, 10));
  })

  it("can override piece size with scalar", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece();

    assert.deepEqual(piece.radius, vector(2, 2));
    assert.deepEqual(piece.diameter, vector(4, 4));

    piece.resize(radius(vector(5, 2)));

    assert.deepEqual(piece.radius, vector(5, 2));
    assert.deepEqual(piece.diameter, vector(10, 4));
  })


  it("can create a rectangular, wide piece from a puzzle", () => {
    const puzzle = new Puzzle({pieceRadius: vector(6, 4)});
    const piece = puzzle.newPiece();
    piece.locateAt(0, 0);

    assert.equal(piece.puzzle, puzzle);
    assert.deepEqual(piece.radius, vector(6, 4));
    assert.deepEqual(piece.rightAnchor, anchor(6, 0));
    assert.deepEqual(piece.leftAnchor, anchor(-6, 0));
    assert.deepEqual(piece.upAnchor, anchor(0, -4));
    assert.deepEqual(piece.downAnchor, anchor(0, 4));
  })

  it("can create a rectangular, tall piece from a puzzle", () => {
    const puzzle = new Puzzle({pieceRadius: {x: 3, y: 5}});
    const piece = puzzle.newPiece();
    piece.locateAt(0, 0);

    assert.equal(piece.puzzle, puzzle);
    assert.deepEqual(piece.radius, {x: 3, y: 5});
    assert.deepEqual(piece.rightAnchor, anchor(3, 0));
    assert.deepEqual(piece.leftAnchor, anchor(-3, 0));
    assert.deepEqual(piece.upAnchor, anchor(0, -5));
    assert.deepEqual(piece.downAnchor, anchor(0, 5));
  })

  it("can check whether pieces are vertically close when overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(0, 0);

    assert.equal(a.verticallyCloseTo(b), false);
    assert.equal(b.verticallyCloseTo(a), false);
  })


  it("can check whether rectangular pieces are vertically close when overlapped", () => {
    const puzzle = new Puzzle({pieceRadius: {x: 4, y: 10}});

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(0, 0);

    assert.equal(a.verticallyCloseTo(b), false);
    assert.equal(b.verticallyCloseTo(a), false);
  })

  it("can check whether pieces are horizontally close when overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(0, 0);

    assert.equal(a.horizontallyCloseTo(b), false);
    assert.equal(b.horizontallyCloseTo(a), false);
  })

  it("can check whether pieces are vertically close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(0, 20);

    assert.equal(a.verticallyCloseTo(b), false);
    assert.equal(b.verticallyCloseTo(a), false);
  })

  it("can check whether pieces are horizontally close when far away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(20, 0);

    assert.equal(a.horizontallyCloseTo(b), false);
    assert.equal(b.horizontallyCloseTo(a), false);
  })

  it("can check whether pieces are vertically close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(0, 2);

    assert.equal(a.verticallyCloseTo(b), false);
    assert.equal(b.verticallyCloseTo(a), false);
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(2, 0);

    assert.equal(a.horizontallyCloseTo(b), false);
    assert.equal(b.horizontallyCloseTo(a), false);
  })

  it("can check whether pieces are vertically close when close", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(0, 3);

    assert.equal(a.verticallyCloseTo(b), true);
    assert.equal(b.verticallyCloseTo(a), false);
  })

  it("can check whether pieces are horizontally close when partially overlapped", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece();
    a.locateAt(0, 0);

    const b = puzzle.newPiece();
    b.locateAt(3, 0);

    assert.equal(a.horizontallyCloseTo(b), true);
    assert.equal(b.horizontallyCloseTo(a), false);
  })

  it("knows its positive inserts positions", () => {
    const puzzle = new Puzzle();

    const piece = puzzle.newPiece();
    piece.locateAt(0, 0);

    assert.deepEqual(piece.downAnchor, anchor(0, 2));
    assert.deepEqual(piece.rightAnchor, anchor(2, 0));
  })

  it("knows its negative inserts positions", () => {
    const puzzle = new Puzzle();

    const piece = puzzle.newPiece();
    piece.locateAt(0, 0);

    assert.deepEqual(piece.upAnchor, anchor(0, -2));
    assert.deepEqual(piece.leftAnchor, anchor(-2, 0));
  })

  it("has native connectors", () => {
    const piece = new Piece();

    assert.notEqual(piece.verticalConnector, null);
    assert.notEqual(piece.horizontalConnector, null);
    assert.notEqual(piece.horizontalConnector, piece.verticalConnector);
  })

  describe("connection of regular pieces", () => {
    /** @type {import('../src/puzzle')} */
    let puzzle;
    /** @type {import('../src/piece')} */
    let a;
    /** @type {import('../src/piece')} */
    let b;
    /** @type {import('../src/piece')} */
    let c;

    beforeEach(() => {
      puzzle = new Puzzle();
      a = puzzle.newPiece({down: Tab});
      b = puzzle.newPiece({up: Slot, right: Tab});
      c = puzzle.newPiece({left: Slot});

      a.locateAt(0, 0);
      b.locateAt(0, 3);
      c.locateAt(3, 3);
    })


    it("checks if can connect horizontally", () => {
      assert.equal(b.canConnectHorizontallyWith(c), true);
      assert.equal(a.canConnectHorizontallyWith(b), false);
      assert.equal(b.canConnectHorizontallyWith(a), false);
      assert.equal(c.canConnectHorizontallyWith(b), false);
    })

    it("can try to connect close pieces horizontally", () => {
      assert.notEqual(b.rightConnection, c);
      b.tryConnectHorizontallyWith(c);
      assert.equal(b.rightConnection, c);
    })

    it("can try to connect distant pieces horizontally ", () => {
      assert.notEqual(a.rightConnection, b);
      a.tryConnectHorizontallyWith(b);
      assert.notEqual(a.rightConnection, b);
      assert.notEqual(b.rightConnection, a);
    })

    it("checks if can connect horizontally wih requirement that accepts all connections", () => {
      puzzle.attachHorizontalConnectionRequirement((_) => true);

      assert.equal(b.canConnectHorizontallyWith(c), true);
      assert.equal(a.canConnectHorizontallyWith(b), false);
      assert.equal(b.canConnectHorizontallyWith(a), false);
      assert.equal(c.canConnectHorizontallyWith(b), false);
    })

    it("checks if can connect horizontally wih requirement that prevents all connections", () => {
      puzzle.attachHorizontalConnectionRequirement((_) => false);

      assert.equal(b.canConnectHorizontallyWith(c), false);
      assert.equal(a.canConnectHorizontallyWith(b), false);
      assert.equal(b.canConnectHorizontallyWith(a), false);
      assert.equal(c.canConnectHorizontallyWith(b), false);
    })

    it("checks if can connect vertically", () => {
      assert.equal(a.canConnectVerticallyWith(b), true);
      assert.equal(b.canConnectVerticallyWith(a), false);
      assert.equal(b.canConnectVerticallyWith(c), false);
      assert.equal(c.canConnectVerticallyWith(b), false);
    })

    it("can try to connect close pieces vertically", () => {
      assert.notEqual(a.downConnection, b);
      a.tryConnectVerticallyWith(b);
      assert.equal(a.downConnection, b);
    })

    it("can try to connect distant pieces vertically", () => {
      assert.notEqual(b.downConnection, c);
      b.tryConnectVerticallyWith(c);
      assert.notEqual(b.downConnection, c);
      assert.notEqual(c.downConnection, b);
    })

    it("checks if can connect vertically wih requirement that accepts all connections", () => {
      puzzle.attachVerticalConnectionRequirement((_) => true);

      assert.equal(a.canConnectVerticallyWith(b), true);
      assert.equal(b.canConnectVerticallyWith(a), false);
      assert.equal(b.canConnectVerticallyWith(c), false);
      assert.equal(c.canConnectVerticallyWith(b), false);
    })

    it("checks if can connect vertically wih requirement that prevents all connections", () => {
      puzzle.attachVerticalConnectionRequirement((_) => false);

      assert.equal(a.canConnectVerticallyWith(b), false);
      assert.equal(b.canConnectVerticallyWith(a), false);
      assert.equal(b.canConnectVerticallyWith(c), false);
      assert.equal(c.canConnectVerticallyWith(b), false);
    })


    it("checks if rectangular pieces can connect vertically", () => {
      const puzzle = new Puzzle({pieceRadius: {x: 2, y: 3}});

      const a = puzzle.newPiece({down: Tab});
      const b = puzzle.newPiece({up: Slot, right: Tab});
      const c = puzzle.newPiece({left: Slot});

      a.locateAt(0, 0);
      b.locateAt(0, 5);
      c.locateAt(3, 5);

      assert.equal(a.canConnectVerticallyWith(b), true);
      assert.equal(b.canConnectVerticallyWith(a), false);
      assert.equal(b.canConnectVerticallyWith(c), false);
      assert.equal(c.canConnectVerticallyWith(b), false);
    })


    it("connects vertically", () => {

      a.connectVerticallyWith(b);
      assert.equal(a.downConnection, b);
      assert.equal(a.connected, true);
      assert.equal(b.connected, true);
    })
  })

  it("connects vertically irregular pieces", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece(
      {right: Tab},
      {size: diameter(10)});
    const b = puzzle.newPiece(
      {left: Slot},
      {size: diameter({x: 20, y: 10})});

    a.locateAt(0, 0);
    b.locateAt(15, 0);

    a.connectHorizontallyWith(b);

    assert.equal(a.rightConnection, b);
    assert.equal(a.connected, true);
    assert.equal(b.connected, true);
  })

  it("does not connect vertically when too away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.locateAt(0, 0);
    b.locateAt(10, 30);

    assert.throws(() => a.connectVerticallyWith(b), /can not connect down!/);
  })

  it("connects vertically with attracts", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.locateAt(0, 0);
    b.locateAt(0, 3);

    a.connectVerticallyWith(b);

    assert.deepEqual(a.centralAnchor, anchor(0, -1));
    assert.deepEqual(b.centralAnchor, anchor(0, 3));
  })

  it("connects vertically with attracts back", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.locateAt(0, 0);
    b.locateAt(0, 3);

    a.connectVerticallyWith(b, true);

    assert.deepEqual(a.centralAnchor, anchor(0, 0));
    assert.deepEqual(b.centralAnchor, anchor(0, 4));
  })

  it("connects vertically with attracts, twice", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, down: Tab});
    const c = puzzle.newPiece({up: Slot, down: Tab});

    a.locateAt(0, 0);
    b.locateAt(0, 3);
    c.locateAt(0, 6);

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

    a.locateAt(0, 0);
    b.locateAt(0, 3);
    c.locateAt(3, 3);

    b.connectHorizontallyWith(c);
    assert.equal(b.rightConnection, c);
    assert.equal(b.connected, true);
    assert.equal(c.connected, true);
  })

  it("does not connect horizontally when too away", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot, right: Tab});

    a.locateAt(0, 0);
    b.locateAt(10, 30);

    assert.throws(() => a.connectHorizontallyWith(b), /can not connect right!/);
  })

  it("connects horizontally with attracts", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot, right: Tab});

    a.locateAt(0, 0);
    b.locateAt(3, 0);

    a.connectHorizontallyWith(b);

    assert.deepEqual(a.centralAnchor, anchor(-1, 0));
    assert.deepEqual(b.centralAnchor, anchor(3, 0));
  })

  it("attracts right to left", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot});

    a.locateAt(0, 0);
    b.locateAt(5, 1);

    a.attractHorizontally(b);

    assert.deepEqual(a.centralAnchor, anchor(0, 0));
    assert.deepEqual(b.centralAnchor, anchor(4, 0));
  })


  it("attracts left to right", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot});

    a.locateAt(0, 0);
    b.locateAt(5, 1);

    b.attractHorizontally(a);

    assert.deepEqual(a.centralAnchor, anchor(1, 1));
    assert.deepEqual(b.centralAnchor, anchor(5, 1));
  })

  it("attracts down to up", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot});

    a.locateAt(0, 0);
    b.locateAt(1, 5);

    a.attractVertically(b);

    assert.deepEqual(a.centralAnchor, anchor(0, 0));
    assert.deepEqual(b.centralAnchor, anchor(0, 4));
  })


  it("attracts up to down", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({down: Tab});
    const b = puzzle.newPiece({up: Slot});

    a.locateAt(0, 0);
    b.locateAt(1, 5);

    b.attractVertically(a);

    assert.deepEqual(a.centralAnchor, anchor(1, 1));
    assert.deepEqual(b.centralAnchor, anchor(1, 5));
  })


  it("translates", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece({down: Tab});

    piece.locateAt(0, 0);
    piece.translate(10, 5);

    assert.deepEqual(piece.centralAnchor, anchor(10, 5));
  })

  describe("relocates to", () => {
    let piece;
    beforeEach(() => {
      const puzzle = new Puzzle();
      piece = puzzle.newPiece({down: Tab});
    });

    it("starting at origin", () => {
      piece.locateAt(0, 0);
      piece.relocateTo(10, 5);
      assert.deepEqual(piece.centralAnchor, anchor(10, 5));
    })

    it("starting at other point", () => {
      piece.locateAt(12, -12);
      piece.relocateTo(10, 5);
      assert.deepEqual(piece.centralAnchor, anchor(10, 5));
    })
  })

  it("pushes when no connections", () => {
    const puzzle = new Puzzle();
    const piece = puzzle.newPiece({down: Tab});

    piece.locateAt(0, 0);
    piece.push(10, 5);

    assert.deepEqual(piece.centralAnchor, anchor(10, 5));
  })

  it("pushes when has connections", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot, right: Tab, down: Slot});
    const d = puzzle.newPiece({up: Tab});

    a.locateAt(0, 0);
    b.locateAt(4, 0);
    c.locateAt(8, 0);
    d.locateAt(8, 4);

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

    a.locateAt(0, 0);
    b.locateAt(3, 0);
    c.locateAt(6, 0);
    d.locateAt(6, 3);

    a.connectHorizontallyWith(b);
    b.connectHorizontallyWith(c);
    c.connectVerticallyWith(d);

    a.push(1, 1);

    assert.deepEqual(a.centralAnchor, anchor(-1, 0));
    assert.deepEqual(b.centralAnchor, anchor(3, 0));
    assert.deepEqual(c.centralAnchor, anchor(7, 0));
    assert.deepEqual(d.centralAnchor, anchor(7, 4));
  })

  it("pushes rectangular pieces when has connections and attracts", () => {
    const puzzle = new Puzzle({pieceRadius: {x: 2, y: 3}});

    const a = puzzle.newPiece({right: Tab});
    const b = puzzle.newPiece({left: Slot, right: Tab});
    const c = puzzle.newPiece({left: Slot, right: Tab, down: Slot});
    const d = puzzle.newPiece({up: Tab});

    a.locateAt(0, 0);
    b.locateAt(3, 0);
    c.locateAt(6, 0);
    d.locateAt(6, 5);

    a.connectHorizontallyWith(b);
    b.connectHorizontallyWith(c);
    c.connectVerticallyWith(d);

    a.push(1, 1);

    assert.deepEqual(a.centralAnchor, anchor(-1, 0));
    assert.deepEqual(b.centralAnchor, anchor(3, 0));
    assert.deepEqual(c.centralAnchor, anchor(7, 0));
    assert.deepEqual(d.centralAnchor, anchor(7, 6));
  })


  it("pushes with double connections", () => {
    const puzzle = new Puzzle();

    const a = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});
    const b = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});
    const c = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});
    const d = puzzle.newPiece({up: Slot, right: Slot, down: Tab, left: Tab});

    a.locateAt(0, 0);
    b.locateAt(4, 0);
    c.locateAt(0, 4);
    d.locateAt(4, 4);

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

    piece.locateAt(0, 0);
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

      a.locateAt(0, 0);
      b.locateAt(4, 0);
      c.locateAt(8, 0);
      d.locateAt(8, 4);

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

    it("drags single-connection-piece to right forcing disconnection", () => {
      puzzle.forceDisconnectionWhileDragging();
      a.drag(10, 0);

      assert.deepEqual(a.centralAnchor, anchor(10, 0));
      assert.deepEqual(b.centralAnchor, anchor(4, 0));

      assert.equal(a.rightConnection, null);
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

    it("drags multi-connection-piece up, forcing connection", () => {
      puzzle.forceConnectionWhileDragging();
      c.drag(0, -10);

      assert.deepEqual(c.centralAnchor, anchor(8, -10));
      assert.deepEqual(b.centralAnchor, anchor(4, -10));
      assert.deepEqual(d.centralAnchor, anchor(8, -6));

      assert.equal(c.rightConnection, null);
      assert.equal(c.leftConnection, b);
      assert.equal(c.upConnection, null);
      assert.equal(c.downConnection, d);
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
      assert.deepEqual(piece.inserts, [None, None, Tab, Slot]);
      assert.deepEqual(piece.metadata, {});
      assert.deepEqual(piece.presentConnections, []);
    })

    it("can import piece with anchor", () => {
      const piece = Piece.import({
        centralAnchor: {x: 2, y: 3},
        structure: "TTST",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {}
      });
      assert.deepEqual(piece.centralAnchor, anchor(2, 3));
      assert.deepEqual(piece.inserts, [Tab, Tab, Slot, Tab]);
      assert.deepEqual(piece.metadata, {});
      assert.deepEqual(piece.presentConnections, []);
    })

    it("can import piece with connections - which are ignored", () => {
      const piece = Piece.import({
        centralAnchor: {x: 2, y: 3},
        structure: "TTST",
        connections: {right:{id: 2}, down:null, left:null, up:{id: 4}},
        metadata: {}
      });
      assert.deepEqual(piece.centralAnchor, anchor(2, 3));
      assert.deepEqual(piece.inserts, [Tab, Tab, Slot, Tab]);
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
      piece.locateAt(10, 0);

      assert.deepEqual(piece.export(),  {
        centralAnchor: {x: 10, y: 0},
        structure: "--TS",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {}
      });
    })

    it("can export piece with metadata and anchor", () => {
      const piece = new Piece({up: Slot, left: Tab});
      piece.locateAt(10, 0);
      piece.annotate({foo: 2})

      assert.deepEqual(piece.export(),  {
        centralAnchor: {x: 10, y: 0},
        structure: "--TS",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {foo: 2}
      });
    })

    it("can export piece with metadata, anchor and size", () => {
      const piece = new Piece({up: Slot, left: Tab});
      piece.locateAt(10, 0);
      piece.annotate({foo: 2});
      piece.resize(radius(4));

      assert.deepEqual(piece.export(),  {
        centralAnchor: {x: 10, y: 0},
        structure: "--TS",
        connections: {right:null, down:null, left:null, up:null},
        metadata: {foo: 2},
        size: {radius: {x: 4, y: 4}, diameter: {x: 8, y: 8}}
      });
    })

    it("can export a piece with connections without metadata", () => {
      const puzzle = new Puzzle();

      let a = puzzle.newPiece({right: Tab});
      let b = puzzle.newPiece({left: Slot, right: Tab});

      a.locateAt(0, 0);
      b.locateAt(4, 0);

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

      a.locateAt(0, 0);
      b.locateAt(4, 0);

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
