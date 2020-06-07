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
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this._buildPiece(puzzle, x, y);
      }
    }
    return puzzle;
  }
  /**
   * @param {Puzzle} puzzle
   * @param {number} x
   * @param {number} y
   */
  _buildPiece(puzzle, x, y) {
    puzzle.newPiece({
      up: y === 0 ? None : Slot,
      right: x === (this.width - 1) ? None : Tab,
      down: y === (this.height - 1) ? None : Tab,
      left: x === 0 ? None : Slot
    });
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

  it("create 1 x 2", () => {
    const manufacturer = new Manufacturer();
    manufacturer.configureDimmensions(1, 2);
    const puzzle = manufacturer.build();

    const [first, second] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 2);

    assert.equal(first.up, None);
    assert.equal(first.right, None);
    assert.equal(first.down, Tab);
    assert.equal(first.left, None);

    assert.equal(second.up, Slot);
    assert.equal(second.right, None);
    assert.equal(second.down, None);
    assert.equal(second.left, None);
  })

  it("create 3 x 2", () => {
    const manufacturer = new Manufacturer();
    manufacturer.configureDimmensions(3, 2);
    const puzzle = manufacturer.build();

    const [a, b, c, d, e, f] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 6);

    assert.equal(a.up, None);
    assert.equal(a.right, Tab);
    assert.equal(a.down, Tab);
    assert.equal(a.left, None);

    assert.equal(b.up, None);
    assert.equal(b.right, Tab);
    assert.equal(b.down, Tab);
    assert.equal(b.left, Slot);

    assert.equal(c.up, None);
    assert.equal(c.right, None);
    assert.equal(c.down, Tab);
    assert.equal(c.left, Slot);

    assert.equal(d.up, Slot);
    assert.equal(d.right, Tab);
    assert.equal(d.down, None);
    assert.equal(d.left, None);

    assert.equal(e.up, Slot);
    assert.equal(e.right, Tab);
    assert.equal(e.down, None);
    assert.equal(e.left, Slot);

    assert.equal(f.up, Slot);
    assert.equal(f.right, None);
    assert.equal(f.down, None);
    assert.equal(f.left, Slot);
  })
})
