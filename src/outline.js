const Piece = require('./piece');
const {vector, ...Vector} = require('./vector');

/**
 * @typedef {Classic|Rounded} Outline
 */


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

class Classic {
  /**
   * @param {Piece} piece
   * @param {import('./vector').Vector|number} [size]
   * @param {import('./vector').Vector|number} [borderFill]
   * @returns {number[]}
   */
  draw(piece, size = 50, borderFill = 0) {
    const sizeVector = Vector.cast(size);
    const offset = Vector.divide(Vector.multiply(borderFill, 5), sizeVector);
    return [
      (0 - offset.x),                                                  (0 - offset.y),
      1,                                                               (0 - offset.y),
      2,                                                               select(piece.up, (-1 - offset.y), (1 - offset.y), (0 - offset.y)),
      3,                                                               (0 - offset.y),
      (4 + offset.x),                                                  (0 - offset.y),
      (4 + offset.x),                                                  1,
      select(piece.right, (5 + offset.x), (3 + offset.x), (4 + offset.x)), 2,
      (4 + offset.x),                                                  3,
      (4 + offset.x),                                                  (4 + offset.y),
      3,                                                               (4 + offset.y),
      2,                                                               select(piece.down, (5 + offset.y), (3 + offset.y), (4 + offset.y)),
      1,                                                               (4 + offset.y),
      (0 - offset.x),                                                  (4 + offset.y),
      (0 - offset.x),                                                  3,
      select(piece.left, (-1 - offset.x), (1 - offset.x), (0 - offset.x)), 2,
      (0 - offset.x),                                                  1
    ].map((it, index) => it * (index % 2 === 0 ? sizeVector.x : sizeVector.y) / 5 )
  }

  isBezier() {
    return false;
  }
}

class Rounded {
  /**
   * @param {Piece} piece
   * @param {import('./vector').Vector|number} [size]
   * @param {import('./vector').Vector|number} [borderFill]
   * @returns {number[]}
   */
  draw(piece, size = 150, borderFill = 0) {
    const s = Vector.divide(Vector.cast(size), 3);
    const o = Vector.multiply(s, 4/5);
    return [
      //            0                                      1                                      2
      0             , -s.y         ,                                                                         // start
      0             , -s.y         ,         0             , 0            ,         0             , 0      , // rect
      o.x           , 0            ,         o.x           , s.y          ,         0             , s.y    , // in curve
      0             , s.y          ,         0             , 2 * s.y      ,         0             , 2 * s.y, // rect
      0             , 2 * s.y      ,         s.x           , 2 * s.y      ,         1 * s.x       , 2 * s.y, // rect
      1 * s.x       , 2 * s.y - o.y,         2 * s.x       , 2 * s.y - o.y,         2 * s.x       , 2 * s.y, // in curve
      2 * s.x       , 2 * s.y      ,         3 * s.x       , 2 * s.y      ,         3 * s.x       , 2 * s.y, // rect
      3 * s.x       , 2 * s.y      ,         3 * s.x       , s.y          ,         3 * s.x       , s.y    , // rect
      3 * s.x + o.x , s.y          ,         3 * s.x + o.x , 0            ,         3 * s.x       , 0      , // out curve
      3 * s.x       , 0            ,         3 * s.x       , -s.y         ,         3 * s.x       , -s.y   , // rect
      3 * s.x       , -s.y         ,         2 * s.x       , -s.y         ,         2 * s.x       , -s.y   , // rect
      2 * s.x       , -s.y - o.y   ,         1 * s.x       , -s.y - o.y   ,         1 * s.x       , -s.y   , // our curve
      1 * s.x       , -s.y         ,         0             , -s.y         ,         0             , -s.y    // rect
    ]
  }

  isBezier() {
    return true;
  }
}

module.exports = {
  Classic,
  Rounded
}
