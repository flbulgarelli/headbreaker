const assert = require('assert');
const {anchor, vector, Puzzle, Piece, Shuffler} = require('../src/index');


describe("shuffler", () => {
  function hasDuplicates(result) {
    return result.some(it => {
      return result.some(other => other !== it && it.x == other.x && it.y == other.y)
    })
  }

  /** @type {Puzzle} */
  let puzzle;
  /** @type {Piece[]} */
  let pieces;
  before(() => {
    puzzle = new Puzzle();
    pieces = [
      puzzle.newPiece({}, {centralAnchor: vector(0, 0)}),
      puzzle.newPiece({}, {centralAnchor: vector(0, 10)}),
      puzzle.newPiece({}, {centralAnchor: vector(10, 0)}),
      puzzle.newPiece({}, {centralAnchor: vector(10, 10)}),
      puzzle.newPiece({}, {centralAnchor: vector(20, 0)}),
      puzzle.newPiece({}, {centralAnchor: vector(20, 10)}),
    ];
  })

  it("grid", () => {
    const result = Shuffler.grid(pieces);
    assert.equal(hasDuplicates(result), false, "There must not be any duplicates");
  })

  it("columns", () => {
    const result = Shuffler.columns(pieces);
    assert.deepEqual(result.map(it => it.x), [0, 0, 10, 10, 20, 20])
    assert.equal(hasDuplicates(result), false, "There must not be any duplicates");
  })

  it("noop", () => {
    assert.deepEqual(Shuffler.noop(pieces), [anchor(0, 0), anchor(0, 10), anchor(10, 0), anchor(10, 10), anchor(20, 0), anchor(20, 10)])
  })
})
