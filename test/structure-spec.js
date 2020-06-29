const assert = require('assert');
const {Structure, Slot, Tab, None} = require('../src/index');

describe("piece", () => {
  describe("dump", () => {
    it("can dump structure with up and down Slots", () => {
      assert.deepEqual(Structure.dump({up: Slot, down: Slot}), "-S-S");
    })

    it("can dump structure with up and down Tabs", () => {
      assert.deepEqual(Structure.dump({up: Tab, down: Tab}), "-T-T");
    })

    it("can dump structure with mixed Tabs and Slots", () => {
      assert.deepEqual(Structure.dump({up: Tab, down: Slot, left: Slot, right: Tab}), "TSST");
    })

    it("can dump structure with mixed Tabs, Slots and Nones", () => {
      assert.deepEqual(Structure.dump({up: Tab, down: Slot, left: None, right: Tab}), "TS-T");
    })
  })

  describe("parse", () => {
    it("can parse structure with up and down Slots", () => {
      assert.deepEqual(Structure.parse("-S-S"), {up: Slot, down: Slot, left: None, right: None});
    })

    it("can parse structure with up and down Tabs", () => {
      assert.deepEqual(Structure.parse("-T-T"), {up: Tab, down: Tab, left: None, right: None});
    })

  })

  it("can roundtrip", () => {
    assert.deepEqual(Structure.dump(Structure.parse("-TST")), "-TST");
    assert.deepEqual(Structure.dump(Structure.parse("--ST")), "--ST");
    assert.deepEqual(Structure.dump(Structure.parse("----")), "----");
    assert.deepEqual(Structure.dump(Structure.parse("SSSS")), "SSSS");
  })
})
