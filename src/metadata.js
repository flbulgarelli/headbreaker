/**
 * This module exposes metadata-handling functions you can override to have better performance
 *
 * @module Metadata
 */

/**
 * Copies a metadata object. The default implementation uses {@link JSON#parse}. Override it to have better performance
 *
 * @template T
 * @param {T} metadata
 * @returns {T}
 */
function copy(metadata) {
  return JSON.parse(JSON.stringify(metadata));
}

module.exports = {
  copy
}
