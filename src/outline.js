const Piece = require('./piece');
const {position, ...Position} = require('./position');

/**
 * This module contains the draw function. Override it change pieces drawing strategy
 *
 * @module Outline
 */

/**
 * @param {import('./insert').Insert} insert
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
 * @param {import('./position').Position} [size]
 * @returns {number[]}
 */
function draw(piece, size = position(50, 50), borderFill = 0) {
  const offset = Position.divide(borderFill * 5, size);
  return [
    (0 - offset.x),                                                  (0 - offset.y),
    1,                                                             (0 - offset.y),
    2,                                                             select(piece.up, (-1 - offset.y), (1 - offset.y), (0 - offset.y)),
    3,                                                             (0 - offset.y),
    (4 + offset.x),                                                  (0 - offset.y),
    (4 + offset.x),                                                  1,
    select(piece.right, (5 + offset.x), (3 + offset.x), (4 + offset.x)), 2,
    (4 + offset.x),                                                  3,
    (4 + offset.x),                                                  (4 + offset.y),
    3,                                                             (4 + offset.y),
    2,                                                             select(piece.down, (5 + offset.y), (3 + offset.y), (4 + offset.y)),
    1,                                                             (4 + offset.y),
    (0 - offset.x),                                                  (4 + offset.y),
    (0 - offset.x),                                                  3,
    select(piece.left, (-1 - offset.x), (1 - offset.x), (0 - offset.x)), 2,
    (0 - offset.x),                                                  1
  ].map((it, index) => it * (index % 2 === 0 ? size.x : size.y) / 5 )
}


module.exports = {
  draw
}
