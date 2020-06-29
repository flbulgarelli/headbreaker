const assert = require('assert');
const {Structure, Slot, Tab, None} = require('../src/index');

describe("piece", () => {
  describe("serialzie", () => {
    it("can serialzie structure with up and down Slots", () => {
      assert.deepEqual(Structure.serialize({up: Slot, down: Slot}), "-S-S");
    })

    it("can serialzie structure with up and down Tabs", () => {
      assert.deepEqual(Structure.serialize({up: Tab, down: Tab}), "-T-T");
    })

    it("can serialzie structure with mixed Tabs and Slots", () => {
      assert.deepEqual(Structure.serialize({up: Tab, down: Slot, left: Slot, right: Tab}), "TSST");
    })

    it("can serialzie structure with mixed Tabs, Slots and Nones", () => {
      assert.deepEqual(Structure.serialize({up: Tab, down: Slot, left: None, right: Tab}), "TS-T");
    })
  })

  describe("deserialize", () => {
    it("can deserialize structure with up and down Slots", () => {
      assert.deepEqual(Structure.deserialize("-S-S"), {up: Slot, down: Slot, left: None, right: None});
    })

    it("can deserialize structure with up and down Tabs", () => {
      assert.deepEqual(Structure.deserialize("-T-T"), {up: Tab, down: Tab, left: None, right: None});
    })

  })

  it("can roundtrip", () => {
    assert.deepEqual(Structure.serialize(Structure.deserialize("-TST")), "-TST");
    assert.deepEqual(Structure.serialize(Structure.deserialize("--ST")), "--ST");
    assert.deepEqual(Structure.serialize(Structure.deserialize("----")), "----");
    assert.deepEqual(Structure.serialize(Structure.deserialize("SSSS")), "SSSS");
  })
})
