const assert = require('assert');
const Piece = require('../src/piece');
const outline = require('../src/outline');


describe("Classic", () => {
  const classic = new outline.Classic();
  it("should produce an square", () => {
    assert.deepEqual(classic.draw(new Piece(), 5), [
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
    assert.deepEqual(classic.draw(new Piece(), {x: 5, y: 50}), [
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
    assert.deepEqual(classic.draw(new Piece(), 5, 0.5), [
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
    assert.deepEqual(classic.draw(new Piece(), {x: 5, y: 10}, {x: 0.5, y: 1}), [
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

describe("Rounded", () => {
  it("should produce an square", () => {
    assert.deepEqual(new outline.Rounded().draw(new Piece(), 150), [
      0, 0,
      0, 0, 0, 50, 0, 50,
      40, 50, 40, 100, 0, 100, // in curve
      0, 100, 0, 150, 0, 150, // rect
      0, 150, 50, 150, 50, 150, // rect
      50, 110, 100, 110, 100, 150, // in curve
      100, 150, 150, 150, 150, 150, // rect
      150, 150, 150, 100, 150, 100, // rect
      190, 100, 190, 50, 150, 50, // out curve
      150, 50, 150, 0, 150, 0, // rect
      150, 0, 100, 0, 100, 0, // rect
      100, -40, 50, -40, 50, 0, // our curve
      50, 0, 0, 0, 0, 0, // rect
    ])
  })
})
