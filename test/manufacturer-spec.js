const assert = require('assert');
const {anchor, Anchor} = require('../src/anchor');
const {Puzzle, Piece, Tab, Slot, None} = require('../src/puzzle');


class Manufacturer {

  /**
   * If nothing is configured, default Puzzle structured is assumed
   *
   * @param {import('../src/puzzle').PuzzleStructure} structure
   */
  configureStructure(structure) {
    this.structure = structure
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  configureDimmensions(width, height) {
    this.width = width;
    this.height = height;
  }

   /**
   * @returns {Puzzle}
   */
  build() {
    const puzzle = new Puzzle(this.structure);
    for (let x = 0; x < this.width; x++) {
      puzzle.newPiece({
        up: None,
        right: x === (this.width - 1) ? None : Tab,
        down: None,
        left: x === 0 ? None : Slot
      });
    }
    return puzzle;
  }
}

describe("manufacturer", () => {
  it("create 1 x 1", () => {
    const manufacturer = new Manufacturer();
    manufacturer.configureDimmensions(1, 1);
    manufacturer.configureStructure({pieceSize: 10, proximity: 1});
    const puzzle = manufacturer.build();
    const first = puzzle.pieces[0];

    assert.equal(puzzle.pieces.length, 1);

    assert.equal(first.up, None);
    assert.equal(first.right, None);
    assert.equal(first.down, None);
    assert.equal(first.left, None);

    assert.equal(first.size, 10);
    assert.equal(first.proximity, 1);

  })

  it("create 2 x 1", () => {
    const manufacturer = new Manufacturer();
    manufacturer.configureDimmensions(2, 1);
    const puzzle = manufacturer.build();

    const first = puzzle.pieces[0];
    const second = puzzle.pieces[1];

    assert.equal(puzzle.pieces.length, 2);

    assert.equal(first.up, None);
    assert.equal(first.right, Tab);
    assert.equal(first.down, None);
    assert.equal(first.left, None);

    assert.equal(second.up, None);
    assert.equal(second.right, None);
    assert.equal(second.down, None);
    assert.equal(second.left, Slot);
  })

  it("create 3 x 1", () => {
    const manufacturer = new Manufacturer();
    manufacturer.configureDimmensions(3, 1);
    const puzzle = manufacturer.build();

    const [first, second, third] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 3);

    assert.equal(first.up, None);
    assert.equal(first.right, Tab);
    assert.equal(first.down, None);
    assert.equal(first.left, None);

    assert.equal(second.up, None);
    assert.equal(second.right, Tab);
    assert.equal(second.down, None);
    assert.equal(second.left, Slot);

    assert.equal(third.up, None);
    assert.equal(third.right, None);
    assert.equal(third.down, None);
    assert.equal(third.left, Slot);
  })
})
