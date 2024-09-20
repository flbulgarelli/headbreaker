/**
 * @module Connector
 */
import { Anchor } from './anchor';
import Piece from './piece';
import { pivot } from './prelude';

export type ConnectionRequirement = (one: Piece, other: Piece) => boolean;

/**
 * @type {ConnectionRequirement}
 */
export function noConnectionRequirements(_one: Piece, _other: Piece): boolean {
  return true;
}

/**
 * @private
 */
export class Connector {
  axis: string;
  forward: string;
  backward: string;
  forwardAnchor: string;
  backwardAnchor: string;
  forwardConnection: string;
  backwardConnection: string;
  requirement: ConnectionRequirement;

  /**
   * @param {"x" | "y"} axis
   * @param {"right" | "down"} forward
   * @param {"left" | "up"} backward
   */
  constructor(
    axis: 'x' | 'y',
    forward: 'right' | 'down',
    backward: 'left' | 'up'
  ) {
    this.axis = axis;

    this.forward = forward;
    this.backward = backward;

    this.forwardAnchor = `${forward}Anchor`;
    this.backwardAnchor = `${backward}Anchor`;

    this.forwardConnection = `${forward}Connection`;
    this.backwardConnection = `${backward}Connection`;

    /** @type {ConnectionRequirement} */
    this.requirement = noConnectionRequirements;
  }

  /**
   * @param {boolean} [back]
   */
  attract(one: Piece, other: Piece, back: boolean = false) {
    const [iron, magnet] = pivot(one, other, back);
    const forwardAnchorKey = this.forwardAnchor as keyof Piece;
    const backwardAnchorKey = this.backwardAnchor as keyof Piece;

    let dx: number, dy: number;

    if (
      magnet.centralAnchor &&
      iron.centralAnchor &&
      magnet.centralAnchor[this.axis as keyof typeof magnet.centralAnchor] >
        iron.centralAnchor[this.axis as keyof typeof iron.centralAnchor]
    ) {
      const magnetAnchor = magnet[backwardAnchorKey] as Anchor;
      const ironAnchor = iron[forwardAnchorKey] as Anchor;
      [dx, dy] = magnetAnchor.diff(ironAnchor);
    } else {
      const magnetAnchor = magnet[forwardAnchorKey] as Anchor;
      const ironAnchor = iron[backwardAnchorKey] as Anchor;
      [dx, dy] = magnetAnchor.diff(ironAnchor);
    }

    iron.push(dx, dy);
  }

  /**
   * @param {number} delta
   * @returns {boolean}
   */
  openMovement(one: Piece, delta: number): boolean {
    return (
      (delta > 0 && !one[this.forwardConnection as keyof Piece]) ||
      (delta < 0 && !one[this.backwardConnection as keyof Piece]) ||
      delta == 0
    );
  }

  /**
   * @param {number} proximity
   * @returns {boolean}
   */
  canConnectWith(one: Piece, other: Piece, proximity: number): boolean {
    return (
      this.closeTo(one, other, proximity) &&
      this.match(one, other) &&
      this.requirement(one, other)
    );
  }

  /**
   *
   * @param {number} proximity
   * @returns {boolean}
   */
  closeTo(one: Piece, other: Piece, proximity: number): boolean {
    const forwardAnchorKey = this.forwardAnchor as keyof Piece;
    const backwardAnchorKey = this.backwardAnchor as keyof Piece;
    return one[forwardAnchorKey].closeTo(other[backwardAnchorKey], proximity);
  }

  /**
   * @returns {boolean}
   */
  match(one: Piece, other: Piece): boolean {
    return one[this.forward as keyof Piece].match(
      other[this.backward as keyof Piece]
    );
  }

  /**
   * Connects two pieces if they meet the connection requirements.
   *
   * @param {Piece} one - The first piece to connect.
   * @param {Piece} other - The second piece to connect.
   * @param {number} proximity - The proximity to check for a connection.
   * @param {boolean} back - Whether to connect in the backward direction.
   */
  connectWith(one: Piece, other: Piece, proximity: number, back: boolean) {
    if (!this.canConnectWith(one, other, proximity)) {
      throw new Error(`Cannot connect ${this.forward}!`);
    }

    type ConnectionKey =
      | 'rightConnection'
      | 'leftConnection'
      | 'upConnection'
      | 'downConnection';
    const forwardConnection = this.forwardConnection as ConnectionKey;
    const backwardConnection = this.backwardConnection as ConnectionKey;

    if (one[forwardConnection] !== other) {
      this.attract(other, one, back);
      one[forwardConnection] = other;
      other[backwardConnection] = one;
      one.fireConnect(other);
    }
  }

  /**
   * @param {ConnectionRequirement} requirement
   */
  attachRequirement(requirement: ConnectionRequirement) {
    this.requirement = requirement;
  }

  /**
   * Returns a new right-to-left connector
   *
   * @returns {Connector}
   */
  static horizontal(): Connector {
    return new Connector('x', 'right', 'left');
  }

  /**
   * Returns a new down-to-up connector
   *
   * @returns {Connector}
   */
  static vertical(): Connector {
    return new Connector('y', 'down', 'up');
  }
}
