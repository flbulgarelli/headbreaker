// @ts-nocheck

/**
 * @param {Insert} insert
 * @param {number} t
 * @param {number} s
 * @param {number} n
 */
function createPoint(insert, t, s, n) {
  return insert.isTab() ? t : insert.isSlot() ? s : n;
}

/**
 *
 * @param {Piece} piece
 * @param {number?} size
 * @returns {number[]}
 */
function createPoints(piece, size = 50) {
  return [
    0, 0,
    1, 0,
    2, createPoint(piece.up, -1, 1, 0),
    3, 0,
    4, 0,
    4, 1,
    createPoint(piece.right, 5, 3, 4), 2,
    4, 3,
    4, 4,
    3, 4,
    2, createPoint(piece.down, 5, 3, 4),
    1, 4,
    0, 4,
    0, 3,
    createPoint(piece.left, -1, 1, 0), 2,
    0, 1
  ].map(it => it * size / 5)
}


module.exports = {
  createPoint,
  createPoints
}
