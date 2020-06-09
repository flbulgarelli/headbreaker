// @ts-nocheck
require('mocha');
const assert = require('assert');
const {anchor, Anchor} = require('../src/anchor');

describe("anchor", () => {
  it("can translated vertically", () => {
    assert.deepEqual(anchor(1, 5).translated(0, 4), anchor(1, 9));
    assert.deepEqual(anchor(1, 5).translated(0, -5), anchor(1, 0));
  })

  it("can translated horizontally", () => {
    assert.deepEqual(anchor(1, 5).translated(4, 0), anchor(5, 5));
    assert.deepEqual(anchor(1, 5).translated(-1, 0), anchor(0, 5));
  })

  it("can check proximity when ortogonally close", () => {
    assert(anchor(0, 0).closeTo(anchor(0, 0), 2));

    assert(anchor(0, 0).closeTo(anchor(0, 2), 2));
    assert(anchor(0, 0).closeTo(anchor(0, 1), 2));

    assert(anchor(0, 0).closeTo(anchor(0, -2), 2));
    assert(anchor(0, 0).closeTo(anchor(0, -1), 2));

    assert(anchor(0, 0).closeTo(anchor(2, 0), 2));
    assert(anchor(0, 0).closeTo(anchor(-2, 0), 2));
  })

  it("can check proximity when ortogonally away", () => {
    assert(!anchor(0, 0).closeTo(anchor(0, 2), 1));
    assert(!anchor(0, 0).closeTo(anchor(0, -2), 1));
    assert(!anchor(0, 0).closeTo(anchor(2, 0), 1));
    assert(!anchor(0, 0).closeTo(anchor(-2, 0), 1));
  })

  it("can create random anchors", () => {
    assert(Anchor.atRandom(100, 100).x < 100);
    assert(Anchor.atRandom(100, 100).x > 0);
    assert(Anchor.atRandom(100, 50).y < 50);
    assert(Anchor.atRandom(100, 50).y > 0);
  })
})
