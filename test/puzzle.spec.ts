import { describe, test, assert, beforeEach } from 'vitest';
import {
  Puzzle,
  Tab,
  Slot,
  PuzzleValidator,
  shuffler,
  connector,
} from '../src/headbreaker/index';
import vector from '../src/headbreaker/vector';

describe('puzzle', () => {
  /** @type {Puzzle} */
  let puzzle: Puzzle;

  beforeEach(() => {
    puzzle = new Puzzle();
    puzzle.newPiece({ right: Tab }).locateAt(0, 0);
    puzzle.newPiece({ left: Slot, right: Tab }).locateAt(3, 0);
    puzzle.newPiece({ left: Slot, right: Tab, down: Slot }).locateAt(6, 0);
    puzzle.newPiece({ up: Tab }).locateAt(6, 3);
  });

  test('has head', () => {
    assert.equal(puzzle.head, puzzle.pieces[0]);
  });

  test('has points', () => {
    assert.deepEqual(puzzle.points, [
      [0, 0],
      [3, 0],
      [6, 0],
      [6, 3],
    ]);
  });

  test('has refs', () => {
    assert.deepEqual(puzzle.refs, [
      [0, 0],
      [0.75, 0],
      [1.5, 0],
      [1.5, 0.75],
    ]);
  });

  describe('can register requirements', () => {
    test('has initially no requirements', () => {
      assert.equal(
        puzzle.horizontalRequirement,
        connector.noConnectionRequirements
      );
      assert.equal(
        puzzle.verticalRequirement,
        connector.noConnectionRequirements
      );
    });
    test('can register a general connection requirement', () => {
      const requirement = (_) => true;

      puzzle.attachConnectionRequirement(requirement);

      assert.equal(puzzle.horizontalRequirement, requirement);
      assert.equal(puzzle.verticalRequirement, requirement);
    });
    test('can deregister connection requirements', () => {
      const requirement = (_) => true;

      puzzle.attachConnectionRequirement(requirement);
      puzzle.clearConnectionRequirements();

      assert.equal(
        puzzle.horizontalRequirement,
        connector.noConnectionRequirements
      );
      assert.equal(
        puzzle.verticalRequirement,
        connector.noConnectionRequirements
      );
    });
  });

  test('autoconnects puzzle', () => {
    puzzle.autoconnect();

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(a.rightConnection, b);
    assert.equal(b.rightConnection, c);
    assert.equal(c.downConnection, d);
  });

  test('shuffles connected puzzle', () => {
    puzzle.autoconnect();
    puzzle.shuffle(100, 100);

    assert.equal(puzzle.pieces.length, 4);
  });

  test('shuffles disconnected puzzle', () => {
    puzzle.shuffle(100, 100);
    assert.equal(puzzle.pieces.length, 4);
  });

  test('connects connected puzzle after shuffle', () => {
    puzzle.autoconnect();
    assert.equal(puzzle.connected, true);

    puzzle.shuffleWith(shuffler.noop);

    assert.equal(puzzle.pieces.length, 4);
    assert.equal(puzzle.connected, true);
  });

  test('connects disconnected puzzle after shuffle', () => {
    assert.equal(puzzle.connected, false);

    puzzle.shuffleWith(shuffler.noop);

    assert.equal(puzzle.pieces.length, 4);
    assert.equal(puzzle.connected, true);
  });

  test('translates connected puzzle', () => {
    puzzle.autoconnect();
    puzzle.translate(10, 10);

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 4);

    assert.equal(a.rightConnection, b);
    assert.equal(b.rightConnection, c);
    assert.equal(c.downConnection, d);
  });

  test('translates disconnected puzzle', () => {
    puzzle.translate(10, 10);
    assert.equal(puzzle.pieces.length, 4);

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(a.rightConnection, undefined);
    assert.equal(b.rightConnection, undefined);
    assert.equal(c.downConnection, undefined);
    assert.equal(d.upConnection, undefined);
  });

  describe('reframing', () => {
    test('reframes single offstage piece', () => {
      puzzle = new Puzzle();
      const piece = puzzle.newPiece({ right: Tab, up: Tab });
      piece.locateAt(-10, -10);

      puzzle.reframe(vector.zero(), vector(10, 10));

      assert.deepEqual(piece.centralAnchor!.asPair(), [2, 2]);
    });

    test('reframes single offstage piece - to the right', () => {
      puzzle = new Puzzle();
      const piece = puzzle.newPiece({ right: Tab, up: Tab });
      piece.locateAt(10, 15);

      puzzle.reframe(vector.zero(), vector(8, 12));

      assert.deepEqual(piece.centralAnchor!.asPair(), [6, 10]);
    });

    test('reframes multiple offstage pieces, preserving distances', () => {
      puzzle = new Puzzle();
      const one = puzzle.newPiece({ right: Tab, up: Tab });
      one.locateAt(-10, -10);

      const other = puzzle.newPiece({ right: Tab, up: Tab });
      other.locateAt(-8, -6);

      puzzle.reframe(vector.zero(), vector(10, 10));

      assert.deepEqual(one.centralAnchor!.asPair(), [2, 2]);
      assert.deepEqual(other.centralAnchor!.asPair(), [4, 6]);
    });

    test('honors min bound when full refraiming is impossible', () => {
      puzzle = new Puzzle();
      const one = puzzle.newPiece({ right: Tab, up: Tab });
      one.locateAt(0, 0);

      const other = puzzle.newPiece({ right: Tab, up: Tab });
      other.locateAt(12, 12);

      puzzle.reframe(vector.zero(), vector(10, 10));

      assert.deepEqual(one.centralAnchor!.asPair(), [2, 2]);
      assert.deepEqual(other.centralAnchor!.asPair(), [14, 14]);
    });

    test('reframes does nothing when pieces are already within bounds', () => {
      puzzle = new Puzzle();
      const one = puzzle.newPiece({ right: Tab, up: Tab });
      one.locateAt(3, 3);

      const other = puzzle.newPiece({ right: Tab, up: Tab });
      other.locateAt(5, 9);

      puzzle.reframe(vector.zero(), vector(20, 20));

      assert.deepEqual(one.centralAnchor!.asPair(), [3, 3]);
      assert.deepEqual(other.centralAnchor!.asPair(), [5, 9]);
    });
  });

  describe('validation', () => {
    test('is invalid by default', () => {
      assert.equal(puzzle.isValid(), false);
    });

    describe('with attached validator', () => {
      beforeEach(() => {
        puzzle.attachValidator(
          new PuzzleValidator((it) => it.head.isAt(10, 10))
        );
      });

      test('can be valid using a validator', () => {
        assert.equal(puzzle.isValid(), false);

        puzzle.head.drag(10, 10);
        assert.equal(puzzle.isValid(), true);
      });

      test('can be validated using a validator', async () => {
        await new Promise<void>((resolve) => {
          puzzle.onValid(() => resolve());
          puzzle.validate();

          puzzle.head.drag(10, 10);

          puzzle.validate();
          puzzle.validate();
          puzzle.validate();
        });
      });
    });
  });

  describe('exports', () => {
    test('exports with connections data', () => {
      assert.deepEqual(puzzle.export(), {
        pieceRadius: { x: 2, y: 2 },
        proximity: 1,
        pieces: [
          {
            centralAnchor: {
              x: 0,
              y: 0,
            },
            connections: {
              down: undefined,
              left: undefined,
              right: undefined,
              up: undefined,
            },
            metadata: {},
            structure: 'T---',
          },
          {
            centralAnchor: {
              x: 3,
              y: 0,
            },
            connections: {
              down: undefined,
              left: undefined,
              right: undefined,
              up: undefined,
            },
            metadata: {},
            structure: 'T-S-',
          },
          {
            centralAnchor: {
              x: 6,
              y: 0,
            },
            connections: {
              down: undefined,
              left: undefined,
              right: undefined,
              up: undefined,
            },
            metadata: {},
            structure: 'TSS-',
          },
          {
            centralAnchor: {
              x: 6,
              y: 3,
            },
            connections: {
              down: undefined,
              left: undefined,
              right: undefined,
              up: undefined,
            },
            metadata: {},
            structure: '---T',
          },
        ],
      });
    });

    test('exports without connections data', () => {
      assert.deepEqual(puzzle.export({ compact: true }), {
        pieceRadius: { x: 2, y: 2 },
        proximity: 1,
        pieces: [
          {
            centralAnchor: {
              x: 0,
              y: 0,
            },
            metadata: {},
            structure: 'T---',
          },
          {
            centralAnchor: {
              x: 3,
              y: 0,
            },
            metadata: {},
            structure: 'T-S-',
          },
          {
            centralAnchor: {
              x: 6,
              y: 0,
            },
            metadata: {},
            structure: 'TSS-',
          },
          {
            centralAnchor: {
              x: 6,
              y: 3,
            },
            metadata: {},
            structure: '---T',
          },
        ],
      });
    });
  });

  test('imports', () => {
    const imported = Puzzle.import(puzzle.export());
    assert.deepEqual(imported.pieces.length, puzzle.pieces.length);
    assert.deepEqual(imported.pieceDiameter, puzzle.pieceDiameter);
    assert.deepEqual(imported.proximity, puzzle.proximity);
    assert.deepEqual(imported.metadata, puzzle.metadata);
  });
});
