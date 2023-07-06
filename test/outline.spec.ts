const assert = require('assert');
import * as Piece from '../src/piece';
import { Classic, Rounded } from '../src/outline';
import { None, Tab, Slot } from '../src/insert';


describe("Classic", () => {
  it("should produce an square", () => {
    assert.deepEqual(Classic.draw(new Piece(), 5), [
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
    assert.deepEqual(Classic.draw(new Piece(), {x: 5, y: 50}), [
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
    assert.deepEqual(Classic.draw(new Piece(), 5, 0.5), [
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
    assert.deepEqual(Classic.draw(new Piece(), {x: 5, y: 10}, {x: 0.5, y: 1}), [
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
  it("works with TTSS", () => {
    assert.deepEqual(new Rounded().draw(new Piece({up: Tab, right: Tab, down: Slot, left: Slot}), 150), [
      0, 0,
      0, 0, 0, 50, 0, 50,
      40, 50, 40, 100, 0, 100, // insert
      0, 100, 0, 150, 0, 150, // rect
      0, 150, 50, 150, 50, 150, // rect
      50, 110, 100, 110, 100, 150, // insert
      100, 150, 150, 150, 150, 150, // rect
      150, 150, 150, 100, 150, 100, // rect
      190, 100, 190, 50, 150, 50, // insert
      150, 50, 150, 0, 150, 0, // rect
      150, 0, 100, 0, 100, 0, // rect
      100, -40, 50, -40, 50, 0, // insert
      50, 0, 0, 0, 0, 0, // rect
    ])
  })

  it("works with TTST", () => {
    assert.deepEqual(new Rounded().draw(new Piece({up: Tab, right: Tab, down: Slot, left: Tab}), 150), [
      0, 0,
      0, 0, 0, 50, 0, 50,
      -40, 50, -40, 100, 0, 100, // insert
      0, 100, 0, 150, 0, 150, // rect
      0, 150, 50, 150, 50, 150, // rect
      50, 110, 100, 110, 100, 150, // insert
      100, 150, 150, 150, 150, 150, // rect
      150, 150, 150, 100, 150, 100, // rect
      190, 100, 190, 50, 150, 50, // insert
      150, 50, 150, 0, 150, 0, // rect
      150, 0, 100, 0, 100, 0, // rect
      100, -40, 50, -40, 50, 0, // insert
      50, 0, 0, 0, 0, 0, // rect
    ])
  })

  it("works with TSST", () => {
    assert.deepEqual(new Rounded().draw(new Piece({up: Tab, right: Slot, down: Slot, left: Tab}), 150), [
      0, 0,
      0, 0, 0, 50, 0, 50,
      -40, 50, -40, 100, 0, 100, // insert
      0, 100, 0, 150, 0, 150, // rect
      0, 150, 50, 150, 50, 150, // rect
      50, 110, 100, 110, 100, 150, // insert
      100, 150, 150, 150, 150, 150, // rect
      150, 150, 150, 100, 150, 100, // rect
      110, 100, 110, 50, 150, 50, // insert
      150, 50, 150, 0, 150, 0, // rect
      150, 0, 100, 0, 100, 0, // rect
      100, -40, 50, -40, 50, 0, // insert
      50, 0, 0, 0, 0, 0, // rect
    ])
  })

  it("works with T-ST", () => {
    assert.deepEqual(new Rounded().draw(new Piece({up: Tab, right: None, down: Slot, left: Tab}), 150), [
      0, 0,
      0, 0, 0, 50, 0, 50,
      -40, 50, -40, 100, 0, 100, // insert
      0, 100, 0, 150, 0, 150, // rect
      0, 150, 50, 150, 50, 150, // rect
      50, 110, 100, 110, 100, 150, // insert
      100, 150, 150, 150, 150, 150, // rect
      150, 150, 150, 100, 150, 100, // rect
      150, 100, 150, 50, 150, 50, // insert
      150, 50, 150, 0, 150, 0, // rect
      150, 0, 100, 0, 100, 0, // rect
      100, -40, 50, -40, 50, 0, // insert
      50, 0, 0, 0, 0, 0, // rect
    ])
  })

  it("works with ----", () => {
    assert.deepEqual(new Rounded().draw(new Piece(), 150), [
      0, 0,
      0, 0, 0, 50, 0, 50,
      0, 50, 0, 100, 0, 100, // insert
      0, 100, 0, 150, 0, 150, // rect
      0, 150, 50, 150, 50, 150, // rect
      50, 150, 100, 150, 100, 150, // insert
      100, 150, 150, 150, 150, 150, // rect
      150, 150, 150, 100, 150, 100, // rect
      150, 100, 150, 50, 150, 50, // insert
      150, 50, 150, 0, 150, 0, // rect
      150, 0, 100, 0, 100, 0, // rect
      100, 0, 50, 0, 50, 0, // insert
      50, 0, 0, 0, 0, 0, // rect
    ])
  })

  it("works with ----, bezelized", () => {
    assert.equal(new Rounded({bezelize: true}).draw(new Piece(), 150).length, 98);
  })
})
