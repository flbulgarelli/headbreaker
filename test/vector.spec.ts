require('mocha');
const assert = require('assert');
import vector from '../src/vector';

describe("anchor", () => {
  it("can equal", () => {
    assert.equal(vector.equal(vector(1, 1), vector(1, 1)), true);
    assert.equal(vector.equal(vector(1, 1), vector(1, 2)), false);
    assert.equal(vector.equal(vector(2, 1), vector(1, 1)), false);
  })

  it("can plus", () => {
    assert.deepEqual(vector.plus(1, 2), vector(3, 3));
    assert.deepEqual(vector.plus(vector(1, 3), 2), vector(3, 5));
    assert.deepEqual(vector.plus(2, vector(1, 3)), vector(3, 5));

    assert.deepEqual(vector.plus(vector(1, 1), vector(1, 1)), vector(2, 2));
    assert.deepEqual(vector.plus(vector(1, 1), vector(1, 2)), vector(2, 3));
    assert.deepEqual(vector.plus(vector(2, 1), vector(1, 1)), vector(3, 2));
  })

  it("can minus", () => {
    assert.deepEqual(vector.minus(1, 2), vector(-1, -1));
    assert.deepEqual(vector.minus(vector(1, 3), 2), vector(-1, 1));
    assert.deepEqual(vector.minus(2, vector(1, 3)), vector(1, -1));

    assert.deepEqual(vector.minus(vector(1, 1), vector(1, 1)), vector(0, 0));
    assert.deepEqual(vector.minus(vector(1, 1), vector(1, 2)), vector(0, -1));
    assert.deepEqual(vector.minus(vector(2, 1), vector(1, 1)), vector(1, 0));
  })


  it("can max", () => {
    assert.deepEqual(vector.max(1, 2), vector(2, 2));
    assert.deepEqual(vector.max(vector(1, 3), 2), vector(2, 3));
    assert.deepEqual(vector.max(2, vector(1, 3)), vector(2, 3));

    assert.deepEqual(vector.max(vector(1, 1), vector(1, 1)), vector(1, 1));
    assert.deepEqual(vector.max(vector(1, 1), vector(1, 2)), vector(1, 2));
    assert.deepEqual(vector.max(vector(2, 1), vector(1, 1)), vector(2, 1));
  })

  it("can min", () => {
    assert.deepEqual(vector.min(1, 2), vector(1, 1));
    assert.deepEqual(vector.min(vector(1, 3), 2), vector(1, 2));
    assert.deepEqual(vector.min(2, vector(1, 3)), vector(1, 2));

    assert.deepEqual(vector.min(vector(1, 1), vector(1, 1)), vector(1, 1));
    assert.deepEqual(vector.min(vector(1, 1), vector(1, 2)), vector(1, 1));
    assert.deepEqual(vector.min(vector(2, 1), vector(1, 1)), vector(1, 1));
  })

  it("can inner max", () => {
    assert.deepEqual(vector.inner.max(vector(1, 1)), 1);
    assert.deepEqual(vector.inner.max(vector(2, 1)), 2);
    assert.deepEqual(vector.inner.max(vector(3, 5)), 5);
  })

  it("can inner min", () => {
    assert.deepEqual(vector.inner.min(vector(1, 1)), 1);
    assert.deepEqual(vector.inner.min(vector(2, 1)), 1);
    assert.deepEqual(vector.inner.min(vector(3, 5)), 3);
  })
})
