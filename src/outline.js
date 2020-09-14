const Piece = require('./piece');
const {vector, ...Vector} = require('./vector');

/**
 * @typedef {Squared|Rounded} Outline
 */


/**
 * This module contains the draw function. Override it change pieces drawing strategy
 *
 * @module Outline
 */

/**
 * @template T
 * @param {import('./insert').Insert} insert
 * @param {T} t
 * @param {T} s
 * @param {T} n
 * @returns {T}
 */
function select(insert, t, s, n) {
  return insert.isTab() ? t : insert.isSlot() ? s : n;
}

const sl = (p, t, s, n) => select(p.left, t, s, n);
const sr = (p, t, s, n) => select(p.right, t, s, n);
const su = (p, t, s, n) => select(p.up, t, s, n);
const sd = (p, t, s, n) => select(p.down, t, s, n);

class Squared {
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
      sr(piece, (5 + offset.x), (3 + offset.x), (4 + offset.x)),       2,
      (4 + offset.x),                                                  3,
      (4 + offset.x),                                                  (4 + offset.y),
      3,                                                               (4 + offset.y),
      2,                                                               select(piece.down, (5 + offset.y), (3 + offset.y), (4 + offset.y)),
      1,                                                               (4 + offset.y),
      (0 - offset.x),                                                  (4 + offset.y),
      (0 - offset.x),                                                  3,
      sl(piece, (-1 - offset.x), (1 - offset.x), (0 - offset.x)),      2,
      (0 - offset.x),                                                  1
    ].map((it, index) => it * (index % 2 === 0 ? sizeVector.x : sizeVector.y) / 5 )
  }

  isBezier() {
    return false;
  }
}

class Rounded {
  constructor({
    bezelize = false,
    bezelDepth = 2/5,
    insertDepth = 4/5,
    borderLength = 1/3} = {}) {
    this.bezelize = bezelize;
    this.bezelDepth = bezelDepth;
    this.insertDepth = insertDepth;
    this.borderLength = borderLength;
  }

  /**
   * @param {Piece} p
   * @param {import('./vector').Vector|number} [size]
   * @param {import('./vector').Vector|number} [borderFill]
   * @returns {number[]}
   */
  draw(p, size = 150, borderFill = 0) {
    const fullSize = Vector.cast(size);
    const r = Math.trunc(Vector.min(fullSize) * (1 - 2 * this.borderLength) * 100) / 100;
    const s = Vector.divide(Vector.minus(fullSize, r), 2);
    const o = Vector.multiply(r, this.insertDepth);
    const b = Vector.multiply(s, this.bezelDepth);
    const [b0, b1, b2, b3] = this.bezels(p);
    const nx = (c) => c ? b.x : 0;
    const ny = (c) => c ? b.y : 0;

    const rsy  = r + s.y;
    const rsx  = r + s.x;
    const r2sy = r + 2 * s.y;
    const r2sx = r + 2 * s.x;


    return [
      //              0                                         1                                      2
      nx(b0)          , 0               ,
      ...(b0 ?
      [0              , 0               ,         0             , 0             ,         0             , b.y         ] :
      [                                                                                                               ]),
      0               , ny(b0)          ,         0             , s.y           ,         0             , s.y           ,
      ...sl(p,
      [-o.x           , s.y             ,         -o.x          , rsy],
      [o.x            , s.y             ,         o.x           , rsy],
      [0              , s.y             ,         0             , rsy])
                                                                                ,         0              , rsy          ,
      0               , rsy             ,         0             , r2sy          ,         0              , r2sy - ny(b1),
      ...(b1 ?
      [0              , r2sy            ,         0             , r2sy          ,         b.x            , r2sy        ] :
      [                                                                                                                ]),
      nx(b1)          , r2sy            ,         s.x           , r2sy          ,         s.x            , r2sy          ,
      ...sd(p,
      [s.x            , r2sy + o.y      ,         rsx           , r2sy + o.y   ],
      [s.x            , r2sy - o.y      ,         rsx           , r2sy - o.y   ],
      [s.x            , r2sy            ,         rsx           , r2sy   ])
                                                                               ,         rsx             , r2sy          ,
      rsx             , r2sy            ,         r2sx          , r2sy         ,         r2sx - nx(b2)   , r2sy          ,
      ...(b2 ?
      [r2sx           , r2sy            ,         r2sx          , r2sy         ,         r2sx            , r2sy    - b.y]:
      [                                                                                                                 ]),
      r2sx            , r2sy - ny(b2)   ,         r2sx          , rsy          ,         r2sx            , rsy            ,
      ...sr(p,
      [r2sx + o.x     , rsy             ,         r2sx + o.x    , s.y],
      [r2sx - o.x     , rsy             ,         r2sx - o.x    , s.y],
      [r2sx           , rsy             ,         r2sx          , s.y])
                                                                               ,         r2sx            , s.y    ,
      r2sx            , s.y             ,         r2sx          , 0            ,         r2sx            , ny(b3) ,
      ...(b3 ?
      [r2sx           , 0               ,         r2sx          , 0            ,         r2sx    - b.x   , 0] :
      [                                                                                                     ]),
      r2sx - nx(b3)   , 0               ,         rsx           , 0            ,         rsx             , 0      ,
      ...su(p,
      [rsx            , -o.y            ,         s.x           , -o.y],
      [rsx            , o.y             ,         s.x           , o.y],
      [rsx            , 0               ,         s.x           , 0])
                                                                               ,         s.x             , 0      ,
      s.x             , 0               ,         0             , 0            ,         (b0 ? b.x : 0)  , 0
    ]
  }


  bezels(p) {
    if (this.bezelize) {
      return [
        p.left.isNone() && p.up.isNone(),
        p.left.isNone() && p.down.isNone(),
        p.right.isNone() && p.down.isNone(),
        p.right.isNone() && p.up.isNone()
      ];
    } else {
      return [false, false, false, false];
    }
  }

  isBezier() {
    return true;
  }
}

module.exports = {
  Classic: new Squared(),
  Squared,
  Rounded
}
