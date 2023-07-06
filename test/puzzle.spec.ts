const assert = require('assert');
const {Puzzle, Tab, Slot, PuzzleValidator, Shuffler, connector} = require('../src/index');
import vector from '../src/vector';

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

  describe("can register requirements", () => {
    it("has initially no requirements", () => {
      assert.equal(puzzle.horizontalRequirement, connector.noConnectionRequirements);
      assert.equal(puzzle.verticalRequirement, connector.noConnectionRequirements);
    })
    it("can register a general connection requirement", () => {
      const requirement = (_) => true;

      puzzle.attachConnectionRequirement(requirement);

      assert.equal(puzzle.horizontalRequirement, requirement);
      assert.equal(puzzle.verticalRequirement, requirement);
    })
    it("can deregister connection requirements", () => {
      const requirement = (_) => true;

      puzzle.attachConnectionRequirement(requirement);
      puzzle.clearConnectionRequirements();

      assert.equal(puzzle.horizontalRequirement, connector.noConnectionRequirements);
      assert.equal(puzzle.verticalRequirement, connector.noConnectionRequirements);
    })

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

  it("connects connected puzzle after shuffle", () => {
    puzzle.autoconnect();
    assert.equal(puzzle.connected, true);

    puzzle.shuffleWith(Shuffler.noop);

    assert.equal(puzzle.pieces.length, 4);
    assert.equal(puzzle.connected, true);
  })

  it("connects disconnected puzzle after shuffle", () => {
    assert.equal(puzzle.connected, false);

    puzzle.shuffleWith(Shuffler.noop);

    assert.equal(puzzle.pieces.length, 4);
    assert.equal(puzzle.connected, true);
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

  describe("reframing", () => {
    it("reframes single offstage piece", () => {
      puzzle = new Puzzle();
      const piece = puzzle.newPiece({right: Tab, up: Tab});
      piece.locateAt(-10, -10);

      puzzle.reframe(vector.zero(), vector(10, 10));

      assert.deepEqual(piece.centralAnchor.asPair(), [2, 2]);
    })

    it("reframes single offstage piece - to the right", () => {
      puzzle = new Puzzle();
      const piece = puzzle.newPiece({right: Tab, up: Tab});
      piece.locateAt(10, 15);

      puzzle.reframe(vector.zero(), vector(8, 12));

      assert.deepEqual(piece.centralAnchor.asPair(), [6, 10]);
    })

    it("reframes multiple offstage pieces, preserving distances", () => {
      puzzle = new Puzzle();
      const one = puzzle.newPiece({right: Tab, up: Tab});
      one.locateAt(-10, -10);

      const other = puzzle.newPiece({right: Tab, up: Tab});
      other.locateAt(-8, -6);

      puzzle.reframe(vector.zero(), vector(10, 10));

      assert.deepEqual(one.centralAnchor.asPair(), [2, 2]);
      assert.deepEqual(other.centralAnchor.asPair(), [4, 6]);
    })

    it("honors min bound when full refraiming is impossible", () => {
      puzzle = new Puzzle();
      const one = puzzle.newPiece({right: Tab, up: Tab});
      one.locateAt(0, 0);

      const other = puzzle.newPiece({right: Tab, up: Tab});
      other.locateAt(12, 12);

      puzzle.reframe(vector.zero(), vector(10, 10));

      assert.deepEqual(one.centralAnchor.asPair(), [2, 2]);
      assert.deepEqual(other.centralAnchor.asPair(), [14, 14]);
    })

    it("reframes does nothing when pieces are already within bounds", () => {
      puzzle = new Puzzle();
      const one = puzzle.newPiece({right: Tab, up: Tab});
      one.locateAt(3, 3);

      const other = puzzle.newPiece({right: Tab, up: Tab});
      other.locateAt(5, 9);

      puzzle.reframe(vector.zero(), vector(20, 20));

      assert.deepEqual(one.centralAnchor.asPair(), [3, 3]);
      assert.deepEqual(other.centralAnchor.asPair(), [5, 9]);
    })
  });



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
        pieceRadius: {x: 2, y: 2},
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
        pieceRadius: {x: 2, y: 2},
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
