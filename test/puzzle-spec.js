const assert = require('assert');
const {Puzzle, Tab, Slot, PuzzleValidator} = require('../src/index');

describe("puzzle", () => {
  /** @type {Puzzle} */
  let puzzle;

  beforeEach(() => {
    puzzle = new Puzzle();
    puzzle
      .newPiece({right: Tab})
      .locateAt(0, 0);
    puzzle
      .newPiece({left: Slot, right: Tab})
      .locateAt(3, 0);
    puzzle
      .newPiece({left: Slot, right: Tab, down: Slot})
      .locateAt(6, 0);
    puzzle
      .newPiece({up: Tab})
      .locateAt(6, 3);

  })

  it("has head", () => {
    assert.equal(puzzle.head, puzzle.pieces[0]);
  })

  it("has points", () => {
    assert.deepEqual(puzzle.points, [[0, 0], [3, 0], [6, 0], [6, 3]]);
  })

  it("has refs", () => {
    assert.deepEqual(puzzle.refs, [[0, 0], [0.75, 0], [1.5, 0], [1.5, 0.75]]);
  })

  it("autoconnects puzzle", () => {
    puzzle.autoconnect();

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(a.rightConnection, b);
    assert.equal(b.rightConnection, c);
    assert.equal(c.downConnection, d);
  });

  it("shuffles connected puzzle", () => {
    puzzle.autoconnect();
    puzzle.shuffle(100, 100);

    assert.equal(puzzle.pieces.length, 4);
  })

  it("shuffles disconnected puzzle", () => {
    puzzle.shuffle(100, 100);
    assert.equal(puzzle.pieces.length, 4);
  })

  it("translates connected puzzle", () => {
    puzzle.autoconnect();
    puzzle.translate(10, 10);

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 4);

    assert.equal(a.rightConnection, b);
    assert.equal(b.rightConnection, c);
    assert.equal(c.downConnection, d);
  })

  it("translates disconnected puzzle", () => {
    puzzle.translate(10, 10);
    assert.equal(puzzle.pieces.length, 4);

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(a.rightConnection, null);
    assert.equal(b.rightConnection, null);
    assert.equal(c.downConnection, null);
  })

  describe("validation", () => {
    it("is invalid by default", () => {
      assert.equal(puzzle.isValid(), false);
    })

    describe("with attached validator", () => {
      beforeEach(() => {
        puzzle.attachValidator(new PuzzleValidator(it => it.head.isAt(10, 10)));
      })

      it("can be valid using a validator", () => {
        assert.equal(puzzle.isValid(), false);

        puzzle.head.drag(10, 10);
        assert.equal(puzzle.isValid(), true);
      })

      it("can be validated using a validator", (done) => {
        puzzle.onValid(() => done());
        puzzle.validate();

        puzzle.head.drag(10, 10);

        puzzle.validate();
        puzzle.validate();
        puzzle.validate();
      })
    })
  })

  describe("exports", () => {
    it("exports with connections data", () => {
      assert.deepEqual(puzzle.export(), {
        pieceRadio: {x: 2, y: 2},
        proximity: 1,
        pieces: [
          {
            centralAnchor: {
              x: 0,
              y: 0
            },
            connections: {
              down: null,
              left: null,
              right: null,
              up: null,
            },
            metadata: {},
            structure: "T---"
          },
          {
            centralAnchor: {
              x: 3,
              y: 0
            },
            connections: {
              down: null,
              left: null,
              right: null,
              up: null,
            },
            metadata: {},
            structure: "T-S-"
          },
          {
            centralAnchor: {
              x: 6,
              y: 0
            },
            connections: {
              down: null,
              left: null,
              right: null,
              up: null,
            },
            metadata: {},
            structure: "TSS-"
          },
          {
            centralAnchor: {
              x: 6,
              y: 3
            },
            connections: {
              down: null,
              left: null,
              right: null,
              up: null,
            },
            metadata: {},
            structure: "---T"
          },
        ]
      });
    })

    it("exports without connections data", () => {
      assert.deepEqual(puzzle.export({compact: true}), {
        pieceRadio: {x: 2, y: 2},
        proximity: 1,
        pieces: [
          {
            centralAnchor: {
              x: 0,
              y: 0
            },
            metadata: {},
            structure: "T---"
          },
          {
            centralAnchor: {
              x: 3,
              y: 0
            },
            metadata: {},
            structure: "T-S-"
          },
          {
            centralAnchor: {
              x: 6,
              y: 0
            },
            metadata: {},
            structure: "TSS-"
          },
          {
            centralAnchor: {
              x: 6,
              y: 3
            },
            metadata: {},
            structure: "---T"
          },
        ]
      });
    })
  })

  it("imports", () => {
    const imported = Puzzle.import(puzzle.export());
    assert.deepEqual(imported.pieces.length, puzzle.pieces.length);
    assert.deepEqual(imported.pieceDiameter, puzzle.pieceDiameter);
    assert.deepEqual(imported.proximity, puzzle.proximity);
    assert.deepEqual(imported.metadata, puzzle.metadata);
  })
})
