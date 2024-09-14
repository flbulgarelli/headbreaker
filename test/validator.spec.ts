import { describe, test, assert, beforeEach } from 'vitest';
import {
  anchor,
  Manufacturer,
  PuzzleValidator,
  PieceValidator,
  Puzzle,
  Validator,
} from '../src/headbreaker/index';

describe('validator', () => {
  /** @type {Puzzle} */
  let puzzle: Puzzle;
  /** @type {Validator} */
  let validator: Validator;

  beforeEach(() => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(2, 2);
    manufacturer.withStructure({ pieceRadius: 10, proximity: 1 });
    manufacturer.withHeadAt(anchor(0, 0));
    puzzle = manufacturer.build();
  });

  describe('puzzle', () => {
    beforeEach(() => {
      validator = new PuzzleValidator((puzzle) => puzzle.head.isAt(10, 10));
    });

    test('passes with valid puzzle', () => {
      assert.equal(validator.isValid(puzzle), false);
      puzzle.translate(10, 10);
      assert.equal(validator.isValid(puzzle), true);
    });

    test('updates status', () => {
      validator.validate(puzzle);
      assert.equal(validator.valid, false);

      puzzle.translate(10, 10);

      validator.validate(puzzle);
      assert.equal(validator.valid, true);

      validator.validate(puzzle);
      assert.equal(validator.valid, true);
    });

    test('connected validator', () => {
      puzzle.disconnect();
      const validator = new PuzzleValidator(PuzzleValidator.connected);
      assert.equal(validator.isValid(puzzle), false);

      puzzle.autoconnect();
      assert.equal(validator.isValid(puzzle), true);
    });

    describe('relative refs validator', () => {
      test('without offset', () => {
        const validator = new PuzzleValidator(
          PuzzleValidator.relativeRefs([
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ])
        );
        assert.equal(validator.isValid(puzzle), true);
      });

      test('with offset in refs', () => {
        const validator = new PuzzleValidator(
          PuzzleValidator.relativeRefs([
            [1, 1],
            [2, 1],
            [1, 2],
            [2, 2],
          ])
        );
        assert.equal(validator.isValid(puzzle), true);
      });

      test('with offset in pieces', () => {
        const validator = new PuzzleValidator(
          PuzzleValidator.relativeRefs([
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ])
        );
        puzzle.translate(10, -10);
        assert.equal(validator.isValid(puzzle), true);
      });

      test('with non integral offset in pieces', () => {
        const validator = new PuzzleValidator(
          PuzzleValidator.relativeRefs([
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
          ])
        );
        puzzle.translate(2, -3);
        assert.equal(validator.isValid(puzzle), true);
      });

      test('with invalid refs', () => {
        const validator = new PuzzleValidator(
          PuzzleValidator.relativeRefs([
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
          ])
        );
        assert.equal(validator.isValid(puzzle), false);
      });
    });
  });

  describe('piece', () => {
    beforeEach(() => {
      validator = new PieceValidator((piece) => piece.metadata.value == 1);
    });

    test('passes with valid puzzle', () => {
      assert.equal(validator.isValid(puzzle), false);
      puzzle.metadata.forEach((it) => (it.value = 1));
      assert.equal(validator.isValid(puzzle), true);
    });

    test('is valid within onValid', () => {
      validator.onValid(() => {
        assert.equal(validator.valid, true);
      });
      puzzle.metadata.forEach((it) => (it.value = 1));
      validator.validate(puzzle);
    });

    test('is validation status is initially undefined', () => {
      assert.equal(validator.valid, undefined);
    });

    test('is validation status can be updated without firing events', () => {
      validator.updateValidity(puzzle);
      assert.equal(validator.valid, false);
    });
  });
});
