const {parse} = require('./structure');

/**
 * @typedef {import('./structure').Structure|string} StructureLike
 */

/**
 * @param {StructureLike} structureLike
 * @returns {import('./structure').Structure}
 */
function asStructure(structureLike) {
  if (typeof(structureLike) === 'string') {
    return parse(structureLike);
  }
  return structureLike;
}

module.exports = {
  asStructure
}
