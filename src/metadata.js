/**
 * @template T
 * @param {T} metadata
 * @returns {T}
 */
function clone(metadata) {
  return JSON.parse(JSON.stringify(metadata));
}

module.exports = {
  clone
}
