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
 * @param {string} insert
 * @returns {Insert}
 */
function parseInsert(insert) {
  return insert === 'S' ? Slot : insert === 'T' ? Tab : None;
}

/**
 * @typedef {object} Structure
 * @property {Insert} [up]
 * @property {Insert} [left]
 * @property {Insert} [down]
 * @property {Insert} [right]
 */

/**
 *
 * @param {Structure} structure
 * @returns {string}
 */
function dump(structure) {
  return [structure.right, structure.down, structure.left, structure.up].map(it => (it || None).dump()).join('');
}

/**
 *
 * @param {string} string
 * @returns {Structure}
 */
function parse(string) {

  if (string.length !== 4) {
    throw new Error("structure string must be 4-chars long");
  }

  return {
    right: parseInsert(string[0]),
    down: parseInsert(string[1]),
    left: parseInsert(string[2]),
    up: parseInsert(string[3]),
  };
}

/**
 * @typedef {Structure|string} StructureLike
 */

/**
 * @param {StructureLike} structureLike
 * @returns {Structure}
 */
function asStructure(structureLike) {
  if (typeof(structureLike) === 'string') {
    return parse(structureLike);
  }
  return structureLike;
}


/**
 * @module structure
 */
module.exports = {
  None,
  Slot,
  Tab,
  dump,
  parse,
  asStructure
};


