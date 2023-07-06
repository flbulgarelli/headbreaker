const assert = require('assert');
const {Tab, Slot, None, InsertSequence, generators} = require('../src/index');

describe("InsertSequence", () => {
  it("fixed", () => {
    const sequence = new InsertSequence(generators.fixed);

    assert.equal(Tab, sequence.next());
    assert.equal(None, sequence.previousComplement());

    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.previousComplement());

    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.previousComplement());

    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.previousComplement());
  })

  it("flipflop", () => {
    const sequence = new InsertSequence(generators.flipflop);
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
  })


  it("two-and-two", () => {
    const sequence = new InsertSequence(generators.twoAndTwo);
    assert.equal(Tab, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Slot, sequence.next());
  })
})
