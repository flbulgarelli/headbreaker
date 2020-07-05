const {Slot, Tab, None} = require('./insert');
const {orthogonalMap} = require('./prelude');

/**
 * @typedef {object} Structure
 * @property {import('./insert').Insert} [up]
 * @property {import('./insert').Insert} [left]
 * @property {import('./insert').Insert} [down]
 * @property {import('./insert').Insert} [right]
 */

/**
 * @module Structure
 */

/**
 * @private
 * @param {string} insert
 * @returns {import('./insert').Insert}
 */
function parseInsert(insert) {
  return insert === 'S' ? Slot : insert === 'T' ? Tab : None;
}

/**
 *
 * @param {Structure} structure
 * @returns {string}
 */
function serialize(structure) {
  return orthogonalMap([structure.right, structure.down, structure.left, structure.up], it => it.serialize(), None).join('');
}

/**
 *
 * @param {string} string
 * @returns {Structure}
 */
function deserialize(string) {

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
    return deserialize(structureLike);
  }
  return structureLike;
}

module.exports = {
  serialize,
  deserialize,
  asStructure
};


