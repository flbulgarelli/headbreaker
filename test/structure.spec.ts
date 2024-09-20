import { describe, test, assert } from 'vitest';

import { structure, Slot, Tab, None } from '../src/headbreaker/index';

describe('piece', () => {
  describe('serialize', () => {
    test('can serialize structure with up and down Slots', () => {
      assert.deepEqual(structure.serialize({ up: Slot, down: Slot }), '-S-S');
    });

    test('can serialize structure with up and down Tabs', () => {
      assert.deepEqual(structure.serialize({ up: Tab, down: Tab }), '-T-T');
    });

    test('can serialize structure with mixed Tabs and Slots', () => {
      assert.deepEqual(
        structure.serialize({ up: Tab, down: Slot, left: Slot, right: Tab }),
        'TSST'
      );
    });

    test('can serialize structure with mixed Tabs, Slots and Nones', () => {
      assert.deepEqual(
        structure.serialize({ up: Tab, down: Slot, left: None, right: Tab }),
        'TS-T'
      );
    });
  });

  describe('deserialize', () => {
    test('can deserialize structure with up and down Slots', () => {
      assert.deepEqual(structure.deserialize('-S-S'), {
        up: Slot,
        down: Slot,
        left: None,
        right: None,
      });
    });

    test('can deserialize structure with up and down Tabs', () => {
      assert.deepEqual(structure.deserialize('-T-T'), {
        up: Tab,
        down: Tab,
        left: None,
        right: None,
      });
    });
  });

  test('can roundtrip', () => {
    assert.deepEqual(
      structure.serialize(structure.deserialize('-TST')),
      '-TST'
    );
    assert.deepEqual(
      structure.serialize(structure.deserialize('--ST')),
      '--ST'
    );
    assert.deepEqual(
      structure.serialize(structure.deserialize('----')),
      '----'
    );
    assert.deepEqual(
      structure.serialize(structure.deserialize('SSSS')),
      'SSSS'
    );
  });
});
