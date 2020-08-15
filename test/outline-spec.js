const assert = require('assert');
const Piece = require('../src/piece');
const Outline = require('../src/outline');

describe("draw", () => {
  it("should produce an square", () => {
    assert.deepEqual(Outline.draw(new Piece(), 5), [
      0, 0,
      1, 0,
      2, 0,
      3, 0,
      4, 0,
      4, 1,
      4, 2,
      4, 3,
      4, 4,
      3, 4,
      2, 4,
      1, 4,
      0, 4,
      0, 3,
      0, 2,
      0, 1
    ])
  })

  it("should produce a rectangle", () => {
    assert.deepEqual(Outline.draw(new Piece(), {x: 5, y: 50}), [
      0, 0,
      1, 0,
      2, 0,
      3, 0,
      4, 0,
      4, 10,
      4, 20,
      4, 30,
      4, 40,
      3, 40,
      2, 40,
      1, 40,
      0, 40,
      0, 30,
      0, 20,
      0, 10
    ])
  })

  it("should produce an square with border fill", () => {
    assert.deepEqual(Outline.draw(new Piece(), 5, 0.5), [
      -0.5,  -0.5,
      1,     -0.5,
      2,     -0.5,
      3,     -0.5,
      4.5,   -0.5,
      4.5,   1,
      4.5,   2,
      4.5,   3,
      4.5,   4.5,
      3,     4.5,
      2,     4.5,
      1,     4.5,
      -0.5,  4.5,
      -0.5,  3,
      -0.5,  2,
      -0.5,  1
    ])
  })

  it("should produce a rectangle with border fill", () => {
    assert.deepEqual(Outline.draw(new Piece(), {x: 5, y: 10}, {x: 0.5, y: 1}), [
      -0.5,  -1,
      1,     -1,
      2,     -1,
      3,     -1,
      4.5,   -1,
      4.5,   2,
      4.5,   4,
      4.5,   6,
      4.5,   9,
      3,     9,
      2,     9,
      1,     9,
      -0.5,  9,
      -0.5,  6,
      -0.5,  4,
      -0.5,  2
    ])
  })
})
