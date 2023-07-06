require('mocha');
const assert = require('assert');
const {anchor, Anchor} = require('../src/anchor');

describe("anchor", () => {
  it("can equal", () => {
    assert.equal(anchor(0, 0).equal(anchor(0, 0)), true);
    assert.equal(anchor(0, 0).equal(anchor(10, 0)), false);
    assert.equal(anchor(0, 0).equal(anchor(0, 10)), false);
  })

  it("can check position", () => {
    assert.equal(anchor(0, 0).isAt(0, 0), true);
    assert.equal(anchor(0, 0).isAt(10, 0), false);
    assert.equal(anchor(0, 0).isAt(0, 10), false);
  })

  it("can translated vertically", () => {
    assert.deepEqual(anchor(1, 5).translated(0, 4), anchor(1, 9));
    assert.deepEqual(anchor(1, 5).translated(0, -5), anchor(1, 0));
  })

  it("can translated horizontally", () => {
    assert.deepEqual(anchor(1, 5).translated(4, 0), anchor(5, 5));
    assert.deepEqual(anchor(1, 5).translated(-1, 0), anchor(0, 5));
  })

  it("can check proximity when ortogonally close", () => {
    assert.equal(anchor(0, 0).closeTo(anchor(0, 0), 2), true);

    assert.equal(anchor(0, 0).closeTo(anchor(0, 2), 2), true);
    assert.equal(anchor(0, 0).closeTo(anchor(0, 1), 2), true);

    assert.equal(anchor(0, 0).closeTo(anchor(0, -2), 2), true);
    assert.equal(anchor(0, 0).closeTo(anchor(0, -1), 2), true);

    assert.equal(anchor(0, 0).closeTo(anchor(2, 0), 2), true);
    assert.equal(anchor(0, 0).closeTo(anchor(-2, 0), 2), true);
  })

  it("can check proximity when ortogonally away", () => {
    assert.equal(anchor(0, 0).closeTo(anchor(0, 2), 1), false);
    assert.equal(anchor(0, 0).closeTo(anchor(0, -2), 1), false);
    assert.equal(anchor(0, 0).closeTo(anchor(2, 0), 1), false);
    assert.equal(anchor(0, 0).closeTo(anchor(-2, 0), 1), false);
  })

  it("can create random anchors", () => {
    assert.equal(Anchor.atRandom(100, 100).x < 100, true);
    assert.equal(Anchor.atRandom(100, 100).x > 0, true);
    assert.equal(Anchor.atRandom(100, 50).y < 50, true);
    assert.equal(Anchor.atRandom(100, 50).y > 0, true);
  })
})
