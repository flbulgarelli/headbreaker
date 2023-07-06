export interface Orthogonal<A> {
  up: A;
  down: A;
  left: A;
  right: A;
}

type Mapper<A, B> = (a: A) => B

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
export function pivot<T>(one: T, other: T, back: boolean = false): [T, T] {
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
export function orthogonalMap<A, B>(values: A[], mapper: Mapper<A, B>, replacement: A = null): B[] {
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
export function orthogonalTransform<A, B>(values: A[], mapper: Mapper<A, B>, replacement: A = null): Orthogonal<B> {
  const [right, down, left, up] = orthogonalMap(values, mapper, replacement)
  return {right, down, left, up};
}

/**
 * @template A
 * @param {A} arg
 * @returns {A}
 */
export function itself<A>(arg: A): A {
  return arg;
}
