import Piece = require('./piece');
import vector from './vector';
import { Vector } from './vector';
import { Insert } from './insert';

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
 * @param {Insert} insert
 * @param {T} t
 * @param {T} s
 * @param {T} n
 * @returns {T}
 */
function select<T>(insert: Insert, t: T, s: T, n: T): T {
  return insert.isTab() ? t : insert.isSlot() ? s : n;
}

const sl = (p, t, s, n) => select(p.left, t, s, n);
const sr = (p, t, s, n) => select(p.right, t, s, n);
const su = (p, t, s, n) => select(p.up, t, s, n);
const sd = (p, t, s, n) => select(p.down, t, s, n);

export class Squared {
  /**
   * @param {Piece} piece
   * @param {Vector|number} [size]
   * @param {Vector|number} [borderFill]
   * @returns {number[]}
   */
  draw(piece: Piece, size: Vector | number = 50, borderFill: Vector | number = 0): number[] {
    const sizeVector = vector.cast(size);
    const offset = vector.divide(vector.multiply(borderFill, 5), sizeVector);
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

export class Rounded {
  bezelize: boolean;
  bezelDepth: number;
  insertDepth: number;
  borderLength: number;

  referenceInsertAxis: any;
  constructor({
    bezelize = false,
    bezelDepth = 2/5,
    insertDepth = 4/5,
    borderLength = 1/3,
    referenceInsertAxis = null} = {}) {
    this.bezelize = bezelize;
    this.bezelDepth = bezelDepth;
    this.insertDepth = insertDepth;
    this.borderLength = borderLength;
    /** @type {import('./axis').Axis} */
    this.referenceInsertAxis = referenceInsertAxis;
  }

  /**
   * @param {Vector} fullSize
   * @return {number}
   */
  referenceInsertAxisLength(fullSize: Vector): number {
    return this.referenceInsertAxis ? this.referenceInsertAxis.atVector(fullSize) : vector.inner.min(fullSize);
  }

  /**
   * @param {Piece} p
   * @param {Vector|number} [size]
   * @param {Vector|number} [borderFill]
   * @returns {number[]}
   */
  draw(p: Piece, size: Vector | number = 150, borderFill: Vector | number = 0): number[] {
    /** full piece size, from edge to edge */
    const fullSize = vector.cast(size);

    /** insert external diameter */
    const r = Math.trunc(this.referenceInsertAxisLength(fullSize) * (1 - 2 * this.borderLength) * 100) / 100;

    /** edge length, from vertex to insert start */
    const s = vector.divide(vector.minus(fullSize, r), 2);

    /** insert internal radius, from center to insert end */
    const o = vector.multiply(r, this.insertDepth);

    /** bezel radius */
    const b = vector.multiply(vector.inner.min(s), this.bezelDepth);

    /** the four bezel flags, starting at up-left corner */
    const [b0, b1, b2, b3] = this.bezels(p);

    const nx = (c) => c ? b.x : 0;
    const ny = (c) => c ? b.y : 0;

    const rsy  = r + s.y;
    const rsx  = r + s.x;
    const r2sy = r + 2 * s.y;
    const r2sx = r + 2 * s.x;


    return [
      /** col:  */ //               0                                         1                                      2
      /** start: */  nx(b0)          , 0               ,
      ...(b0 ?
      /** bezel: */  [0              , 0               ,         0             , 0             ,         0             , b.y         ] :
      /**        */  [                                                                                                               ]),
      /** edge:  */  0               , ny(b0)          ,         0             , s.y           ,         0             , s.y           ,
      ...sl(p,
      /** insert: */ [-o.x           , s.y             ,         -o.x          , rsy],
      /**         */ [o.x            , s.y             ,         o.x           , rsy],
      /**         */ [0              , s.y             ,         0             , rsy])
      /**         */                                                                           ,         0              , rsy          ,
      /** edge:   */ 0               , rsy             ,         0             , r2sy          ,         0              , r2sy - ny(b1),
      ...(b1 ?
      /** bezel: */  [0              , r2sy            ,         0             , r2sy          ,         b.x            , r2sy        ] :
      /**        */  [                                                                                                                ]),
      /** edge:   */ nx(b1)          , r2sy            ,         s.x           , r2sy          ,         s.x            , r2sy          ,
      ...sd(p,
      /** insert: */ [s.x            , r2sy + o.y      ,         rsx           , r2sy + o.y   ],
      /**         */ [s.x            , r2sy - o.y      ,         rsx           , r2sy - o.y   ],
      /**         */ [s.x            , r2sy            ,         rsx           , r2sy   ])
      /**         */                                                                          ,         rsx             , r2sy          ,
      /** edge:   */ rsx             , r2sy            ,         r2sx          , r2sy         ,         r2sx - nx(b2)   , r2sy          ,
      ...(b2 ?
      /** bezel: */  [r2sx           , r2sy            ,         r2sx          , r2sy         ,         r2sx            , r2sy    - b.y]:
      /**        */  [                                                                                                                 ]),
      /** edge:   */ r2sx            , r2sy - ny(b2)   ,         r2sx          , rsy          ,         r2sx            , rsy            ,
      ...sr(p,
      /** insert: */ [r2sx + o.x     , rsy             ,         r2sx + o.x    , s.y],
      /**         */ [r2sx - o.x     , rsy             ,         r2sx - o.x    , s.y],
      /**         */ [r2sx           , rsy             ,         r2sx          , s.y])
      /**         */                                                                          ,         r2sx            , s.y    ,
      /** edge:   */ r2sx            , s.y             ,         r2sx          , 0            ,         r2sx            , ny(b3) ,
      ...(b3 ?
      /** bezel:  */ [r2sx           , 0               ,         r2sx          , 0            ,         r2sx    - b.x   , 0] :
      /**         */ [                                                                                                     ]),
      /** edge:   */ r2sx - nx(b3)   , 0               ,         rsx           , 0            ,         rsx             , 0      ,
      ...su(p,
      /** insert: */ [rsx            , -o.y            ,         s.x           , -o.y],
      /**         */ [rsx            , o.y             ,         s.x           , o.y],
      /**         */ [rsx            , 0               ,         s.x           , 0])
      /**         */                                                                          ,         s.x             , 0      ,
      /** edge:   */ s.x             , 0               ,         0             , 0            ,         (b0 ? b.x : 0)  , 0
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

export const Classic = new Squared();
