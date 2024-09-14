/**
 * @template A
 */
export interface Orthogonal<A> {
  up: A | undefined | null;
  down: A | undefined | null;
  left: A | undefined | null;
  right: A | undefined | null;
}

import Piece from './piece';

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
 * @param {Piece} one
 * @param {Piece} other
 * @param {boolean} [back]
 * @returns {[Piece, Piece]}
 */
function pivot(
  one: Piece,
  other: Piece,
  back: boolean = false
): [Piece, Piece] {
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
type Mapper<A, B> = (value: A) => B;

function orthogonalMap<A, B>(
  values: A[],
  mapper: Mapper<A, B>,
  replacement: A | null = null
): B[] {
  return values
    .map((it) => {
      const value = it || replacement;
      return value ? mapper(value) : (null as unknown as B);
    })
    .filter((result): result is B => result !== null);
}

/**
 * @template A
 * @template B
 * @param {A[]} values
 * @param {Mapper<A, B>} mapper
 * @param {A} replacement
 * @returns {Orthogonal<B>}
 */
function orthogonalTransform<A, B>(
  values: A[],
  mapper: Mapper<A, B>,
  replacement?: A
): Orthogonal<B> {
  const [right, down, left, up] = orthogonalMap(values, mapper, replacement);
  return { right, down, left, up };
}

/**
 * @template A
 * @param {A} arg
 * @returns {A}
 */
function itself<A>(arg: A): A {
  return arg;
}

export { pivot, itself, orthogonalMap, orthogonalTransform };
