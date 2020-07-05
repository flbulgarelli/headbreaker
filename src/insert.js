/**
 * A connection element of a piece
 *
 * @typedef {(Tab|Slot|None)} Insert
 */

const Tab = {
  isSlot: () => false,
  isTab:  () => true,
  isNone:  () => false,
  match: (other) => other.isSlot(),
  toString: () => "Tab",
  complement: () => Slot,
  serialize: () => 'T'
}

const Slot = {
  isSlot: () => true,
  isTab:  () => false,
  isNone:  () => false,
  match: (other) => other.isTab(),
  toString: () => "Slot",
  complement: () => Tab,
  serialize: () => 'S'
}

const None = {
  isSlot: () => false,
  isTab:  () => false,
  isNone:  () => true,
  match: (other) => false,
  toString: () => "None",
  complement: () => None,
  serialize: () => '-'
}

module.exports = {
  None,
  Slot,
  Tab
};


