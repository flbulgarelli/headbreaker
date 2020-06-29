/**
 * @typedef {(Tab|Slot|None)} Insert
 */
const Tab = {
  isSlot: () => false,
  isTab:  () => true,
  isNone:  () => false,
  match: (other) => other.isSlot(),
  toString: () => "Tab",
  complement: () => Slot,
  dump: () => 'T'
}

const Slot = {
  isSlot: () => true,
  isTab:  () => false,
  isNone:  () => false,
  match: (other) => other.isTab(),
  toString: () => "Slot",
  complement: () => Tab,
  dump: () => 'S'
}

const None = {
  isSlot: () => false,
  isTab:  () => false,
  isNone:  () => true,
  match: (other) => false,
  toString: () => "None",
  complement: () => None,
  dump: () => '-'
}

/**
 * @module insert
 */
module.exports = {
  None,
  Slot,
  Tab
};


