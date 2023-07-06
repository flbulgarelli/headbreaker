require('mocha');
const assert = require('assert');
const {vector, Horizontal, Vertical} = require('../src/index');

describe("axis", () => {
  it("Horizontal", () => {
    assert.equal(Horizontal.atVector(vector(1, 20)), 1);
  })

  it("Vertical", () => {
    assert.equal(Vertical.atVector(vector(1, 20)), 20);
  })
})
