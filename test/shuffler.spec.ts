import { describe, test, assert, beforeEach } from 'vitest';
import { Puzzle, shuffler, Piece } from '../src/headbreaker/index';
import vector, { Vector } from '../src/headbreaker/vector';

describe('shuffler', () => {
  function hasDuplicates(result: Vector[]) {
    return result.some((it) => {
      return result.some(
        (other) => other !== it && it.x == other.x && it.y == other.y
      );
    });
  }
  describe('Complete puzzles', () => {
    let puzzle: Puzzle;
    let pieces: Piece[];
    beforeEach(() => {
      puzzle = new Puzzle();
      pieces = [
        puzzle.newPiece({}, { centralAnchor: vector(0, 0) }),
        puzzle.newPiece({}, { centralAnchor: vector(10, 0) }),
        puzzle.newPiece({}, { centralAnchor: vector(0, 10) }),
        puzzle.newPiece({}, { centralAnchor: vector(10, 10) }),
        puzzle.newPiece({}, { centralAnchor: vector(0, 20) }),
        puzzle.newPiece({}, { centralAnchor: vector(10, 20) }),
      ];
    });

    test('grid', () => {
      const result = shuffler.grid(pieces);
      assert.equal(
        hasDuplicates(result),
        false,
        'There must not be any duplicates'
      );
    });

    test('columns', () => {
      const result = shuffler.columns(pieces);
      assert.deepEqual(
        result.map((it) => it.x),
        [0, 10, 0, 10, 0, 10]
      );
      assert.equal(
        hasDuplicates(result),
        false,
        'There must not be any duplicates'
      );
    });

    test('line', () => {
      const result = shuffler.line(pieces);
      console.log(result);
      assert.deepEqual(
        result.map((it) => it.y),
        [0, 0, 0, 0, 0, 0]
      );
      assert.deepEqual(
        result.every((it, index) => (index % 2 === 0 ? it.x < 30 : it.x >= 30)),
        true
      );
      assert.equal(
        hasDuplicates(result),
        false,
        'There must not be any duplicates'
      );
    });

    test('noop', () => {
      assert.deepEqual(shuffler.noop(pieces), [
        vector(0, 0),
        vector(10, 0),
        vector(0, 10),
        vector(10, 10),
        vector(0, 20),
        vector(10, 20),
      ]);
    });

    test('noisy', () => {
      assert.deepEqual(shuffler.noise(vector(0, 0))(pieces), [
        vector(0, 0),
        vector(10, 0),
        vector(0, 10),
        vector(10, 10),
        vector(0, 20),
        vector(10, 20),
      ]);
    });

    test('padder', () => {
      assert.deepEqual(shuffler.padder(5, 2, 3)(pieces), [
        vector(0, 0),
        vector(15, 0),
        vector(0, 15),
        vector(15, 15),
        vector(0, 30),
        vector(15, 30),
      ]);
    });
  });

  describe('Incomplete puzzles', () => {
    let puzzle: Puzzle;
    let pieces: Piece[];
    beforeEach(() => {
      puzzle = new Puzzle();
      pieces = [
        puzzle.newPiece({}, { centralAnchor: vector(0, 0) }),
        puzzle.newPiece({}, { centralAnchor: vector(0, 10) }),
        puzzle.newPiece({}, { centralAnchor: vector(0, 20) }),
        puzzle.newPiece({}, { centralAnchor: vector(10, 0) }),
      ];
    });

    test('line', () => {
      const result = shuffler.line(pieces);
      assert.deepEqual(
        result.map((it) => it.y),
        [0, 0, 0, 0]
      );
      assert.deepEqual(
        result.slice(0, 3).every((it) => it.x <= 20),
        true
      );
      assert.deepEqual(result[3].x, 30);
      assert.equal(
        hasDuplicates(result),
        false,
        'There must not be any duplicates'
      );
    });
  });
});
