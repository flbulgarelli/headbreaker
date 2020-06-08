const assert = require('assert');
const {Tab, Slot, None} = require('../src/puzzle');
const {InsertSequence, flipflop, fixed, twoAndTwo} = require('../src/sequence');

describe("InsertSequence", () => {
  it("fixed", () => {
    const sequence = new InsertSequence(fixed);

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
    const sequence = new InsertSequence(flipflop);
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
  })


  it("two-and-two", () => {
    const sequence = new InsertSequence(twoAndTwo);
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
