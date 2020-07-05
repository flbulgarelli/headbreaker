/**
 * @template A
 * @typedef {Object} Orthogonal
 * @property {A} up
 * @property {A} down
 * @property {A} left
 * @property {A} right
 */

/**
 * @template A
 * @template B
 *
 * @callback Mapper
 * @param {A} value
 * @returns {B}
 */

/**
 * Misc generic functions
 *
 * @module Prelude
 */

/**
 * @template T
 * @param {T} one
 * @param {T} other
 * @param {boolean} [back]
 * @returns {[T, T]}
 */
function pivot(one, other, back = false) {
  return back ? [one, other] : [other, one];
}

/**
 * @template A
 * @template B
 *
 * @param {A[]} values
 * @param {Mapper<A, B>} mapper
 * @param {A} replacement
 * @returns {B[]}
 */
function orthogonalMap(values, mapper, replacement = null) {
  return values.map(it => {
    const value = it || replacement;
    return value && mapper(value)
  });
}

/**
 * @template A
 * @template B
 * @param {A[]} values
 * @param {Mapper<A, B>} mapper
 * @param {A} replacement
 * @returns {Orthogonal<B>}
 */
function orthogonalTransform(values, mapper, replacement = null) {
  const [right, down, left, up] = orthogonalMap(values, mapper, replacement)
  return {right, down, left, up};
}

/**
 * @template A
 * @param {A} arg
 * @returns {A}
 */
function itself(arg) {
  return arg;
}

module.exports = {
  pivot,
  itself,
  orthogonalMap,
  orthogonalTransform
};
