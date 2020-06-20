const assert = require('assert');
const {structure, Slot, Tab, None} = require('../src/index');

describe("piece", () => {
  describe("dump", () => {
    it("can dump structure with up and down Slots", () => {
      assert.deepEqual(structure.dump({up: Slot, down: Slot}), "-S-S");
    })

    it("can dump structure with up and down Tabs", () => {
      assert.deepEqual(structure.dump({up: Tab, down: Tab}), "-T-T");
    })

    it("can dump structure with mixed Tabs and Slots", () => {
      assert.deepEqual(structure.dump({up: Tab, down: Slot, left: Slot, right: Tab}), "TSST");
    })

    it("can dump structure with mixed Tabs, Slots and Nones", () => {
      assert.deepEqual(structure.dump({up: Tab, down: Slot, left: None, right: Tab}), "TS-T");
    })
  })

  describe("parse", () => {
    it("can parse structure with up and down Slots", () => {
      assert.deepEqual(structure.parse("-S-S"), {up: Slot, down: Slot, left: None, right: None});
    })

    it("can parse structure with up and down Tabs", () => {
      assert.deepEqual(structure.parse("-T-T"), {up: Tab, down: Tab, left: None, right: None});
    })

  })

  it("can roundtrip", () => {
    assert.deepEqual(structure.dump(structure.parse("-TST")), "-TST");
    assert.deepEqual(structure.dump(structure.parse("--ST")), "--ST");
    assert.deepEqual(structure.dump(structure.parse("----")), "----");
    assert.deepEqual(structure.dump(structure.parse("SSSS")), "SSSS");
  })
})
