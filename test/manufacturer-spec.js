const assert = require('assert');
const {anchor, Anchor} = require('../src/anchor');
const {Puzzle, Piece, Tab, Slot, None} = require('../src/puzzle');


class Manufacturer {
  /**
   * @returns {Puzzle}
   */
  build() {
    const puzzle = new Puzzle();
    puzzle.newPiece();
    return puzzle;
  }
  /**
   * @param {import('../src/puzzle').PuzzleStructure} structure
   */
  configureStructure(structure) {
    this.structure = this.structure
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  configureDimmensions(width, height) {
    this.widht = width;
    this.height = height;
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
    assert.equal(first.down, None);
    assert.equal(first.right, None);
    assert.equal(first.left, None);
  })
})
