const {Slot, Tab, None} = require('./insert');

/**
 * @param {string} insert
 * @returns {import('./insert').Insert}
 */
function parseInsert(insert) {
  return insert === 'S' ? Slot : insert === 'T' ? Tab : None;
}

/**
 * @typedef {object} Structure
 * @property {import('./insert').Insert} [up]
 * @property {import('./insert').Insert} [left]
 * @property {import('./insert').Insert} [down]
 * @property {import('./insert').Insert} [right]
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
 * @module Structure
 */
module.exports = {
  dump,
  parse,
  asStructure
};


