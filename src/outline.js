const Piece = require('./piece');

/**
 * @param {import('./structure').Insert} insert
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
 * @param {number} [size]
 * @returns {number[]}
 */
function draw(piece, size = 50, borderFill = 0) {
  const offset = borderFill * 5 / size;
  return [
    (0 - offset),                                                  (0 - offset),
    1,                                                             (0 - offset),
    2,                                                             select(piece.up, (-1 - offset), (1 - offset), (0 - offset)),
    3,                                                             (0 - offset),
    (4 + offset),                                                  (0 - offset),
    (4 + offset),                                                  1,
    select(piece.right, (5 + offset), (3 + offset), (4 + offset)), 2,
    (4 + offset),                                                  3,
    (4 + offset),                                                  (4 + offset),
    3,                                                             (4 + offset),
    2,                                                             select(piece.down, (5 + offset), (3 + offset), (4 + offset)),
    1,                                                             (4 + offset),
    (0 - offset),                                                  (4 + offset),
    (0 - offset),                                                  3,
    select(piece.left, (-1 - offset), (1 - offset), (0 - offset)), 2,
    (0 - offset),                                                  1
  ].map(it => it * size / 5)
}

/**
 * @module outline
 */
module.exports = {
  draw
}
