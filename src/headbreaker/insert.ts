export type InsertType = {
  isSlot: () => boolean;
  isTab: () => boolean;
  isNone: () => boolean;
  match: (other: InsertType) => boolean;
  toString: () => string;
  complement: () => InsertType;
  serialize: () => string;
};

export const Tab: InsertType = {
  isSlot: () => false,
  isTab: () => true,
  isNone: () => false,
  match: (other) => other.isSlot(),
  toString: () => 'Tab',
  complement: () => Slot,
  serialize: () => 'T',
};

export const Slot: InsertType = {
  isSlot: () => true,
  isTab: () => false,
  isNone: () => false,
  match: (other) => other.isTab(),
  toString: () => 'Slot',
  complement: () => Tab,
  serialize: () => 'S',
};

export const None: InsertType = {
  isSlot: () => false,
  isTab: () => false,
  isNone: () => true,
  match: (other) => other.isNone(),
  toString: () => 'None',
  complement: () => None,
  serialize: () => '-',
};

export type Insert = typeof Tab | typeof Slot | typeof None;
