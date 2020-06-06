/**
 * @template T
 * @param {T} one
 * @param {T} other
 * @param {boolean?} back
 * @returns {[T, T]}
 */
function pivot(one, other, back = false) {
  return back ? [one, other] : [other, one];
}

module.exports = pivot;
