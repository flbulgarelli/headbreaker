import { describe, test, assert } from 'vitest';
import {
  Tab,
  Slot,
  None,
  InsertSequence,
  generators,
} from '../src/headbreaker/index';

describe('InsertSequence', () => {
  test('fixed', () => {
    const sequence = new InsertSequence(generators.fixed);

    assert.equal(Tab, sequence.next());
    assert.equal(None, sequence.previousComplement());

    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.previousComplement());

    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.previousComplement());

    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.previousComplement());
  });

  test('flipflop', () => {
    const sequence = new InsertSequence(generators.flipflop);
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
  });

  test('two-and-two', () => {
    const sequence = new InsertSequence(generators.twoAndTwo);
    assert.equal(Tab, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Tab, sequence.next());
    assert.equal(Slot, sequence.next());
    assert.equal(Slot, sequence.next());
  });
});
