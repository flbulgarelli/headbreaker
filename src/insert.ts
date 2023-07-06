export const Tab = {
  isSlot: () => false,
  isTab:  () => true,
  isNone:  () => false,
  match: (other) => other.isSlot(),
  toString: () => "Tab",
  complement: () => Slot,
  serialize: () => 'T'
}

export const Slot = {
  isSlot: () => true,
  isTab:  () => false,
  isNone:  () => false,
  match: (other) => other.isTab(),
  toString: () => "Slot",
  complement: () => Tab,
  serialize: () => 'S'
}

export const None = {
  isSlot: () => false,
  isTab:  () => false,
  isNone:  () => true,
  match: (other) => false,
  toString: () => "None",
  complement: () => None,
  serialize: () => '-'
}

export type Insert = (typeof Tab | typeof Slot | typeof None);
