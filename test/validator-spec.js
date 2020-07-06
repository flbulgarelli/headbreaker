require('mocha');
const assert = require('assert');
const {anchor, Puzzle, Manufacturer, PuzzleValidator, PieceValidator} = require('../src/index');

describe("validator", () => {
  /** @type {Puzzle} */
  let puzzle;
  beforeEach(() => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimmensions(2, 2);
    manufacturer.withStructure({pieceSize: 10, proximity: 1});
    manufacturer.withHeadAt(anchor(0, 0));
    puzzle = manufacturer.build();
  });

  describe("puzzle", () => {
    const validator = new PuzzleValidator((puzzle) => puzzle.head.isAt(10, 10));

    it("passes with valid puzzle", () => {
      assert.equal(validator.isValid(puzzle), false);
      puzzle.translate(10, 10);
      assert.equal(validator.isValid(puzzle), true);
    })

    it("updates status", () => {
      validator.validate(puzzle);
      assert.equal(validator.valid, false);

      puzzle.translate(10, 10);

      validator.validate(puzzle);
      assert.equal(validator.valid, true);

      validator.validate(puzzle);
      assert.equal(validator.valid, true);
    })
  })

  describe("piece", () => {
    const validator = new PieceValidator((piece) => piece.metadata.value == 1);

    it("passes with valid puzzle", () => {
      assert.equal(validator.isValid(puzzle), false);
      puzzle.metadata.forEach(it => it.value = 1);
      assert.equal(validator.isValid(puzzle), true);
    })
  })
})
