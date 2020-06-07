// @ts-nocheck
const assert = require('assert');
const {Piece} = require('../src/puzzle');
const outline = require('../src/outline');

describe("draw", () => {
  it("should produce an square", () => {
    assert.deepEqual(outline.draw(new Piece(), 5), [
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
})
