const {Piece} = require('./puzzle');

/**
 * @param {import('./puzzle').Insert} insert
 * @param {number} t
 * @param {number} s
 * @param {number} n
 */
function select(insert, t, s, n) {
  return insert.isTab() ? t : insert.isSlot() ? s : n;
}

/**
 *
 * @param {Piece} piece
 * @param {number?} size
 * @returns {number[]}
 */
function draw(piece, size = 50) {
  return [
    0, 0,
    1, 0,
    2, select(piece.up, -1, 1, 0),
    3, 0,
    4, 0,
    4, 1,
    select(piece.right, 5, 3, 4), 2,
    4, 3,
    4, 4,
    3, 4,
    2, select(piece.down, 5, 3, 4),
    1, 4,
    0, 4,
    0, 3,
    select(piece.left, -1, 1, 0), 2,
    0, 1
  ].map(it => it * size / 5)
}


module.exports = {
  draw
}
