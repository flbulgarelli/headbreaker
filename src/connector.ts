/**
 * @module Connector
 */
import Piece from './piece';
import { pivot } from './prelude';

type ConnectionRequirement = (one: Piece, other: Piece) => boolean;

/**
 * @type {ConnectionRequirement}
 */
export function noConnectionRequirements(_one, _other) {
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
  constructor(axis: "x" | "y", forward: "right" | "down", backward: "left" | "up") {

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
  attract(one, other, back: boolean = false) {
    const [iron, magnet] = pivot(one, other, back);
    let dx, dy;
    if (magnet.centralAnchor[this.axis] > iron.centralAnchor[this.axis]) {
      [dx, dy] = magnet[this.backwardAnchor].diff(iron[this.forwardAnchor])
    } else {
      [dx, dy] = magnet[this.forwardAnchor].diff(iron[this.backwardAnchor])
    }
    iron.push(dx, dy);
  }


   /**
   * @param {number} delta
   * @returns {boolean}
   */
  openMovement(one, delta: number): boolean {
    return (delta > 0 && !one[this.forwardConnection]) || (delta < 0 && !one[this.backwardConnection]) || delta == 0;
  }

  /**
   * @param {number} proximity
   * @returns {boolean}
   */
  canConnectWith(one, other, proximity: number): boolean {
    return this.closeTo(one, other, proximity) && this.match(one, other) && this.requirement(one, other);
  }

  /**
   *
   * @param {number} proximity
   * @returns {boolean}
   */
  closeTo(one, other, proximity: number): boolean {
    return one[this.forwardAnchor].closeTo(other[this.backwardAnchor], proximity);
  }

  /**
   * @returns {boolean}
   */
  match(one, other): boolean {
    return one[this.forward].match(other[this.backward]);
  }

  /**
   * @param {Piece} one
   * @param {*} other
   * @param {number} proximity
   * @param {boolean} back
   */
  connectWith(one: Piece, other: any, proximity: number, back: boolean) {
    if (!this.canConnectWith(one, other, proximity)) {
      throw new Error(`can not connect ${this.forward}!`);
    }
    if (one[this.forwardConnection] !== other) {
      this.attract(other, one, back);
      one[this.forwardConnection] = other;
      other[this.backwardConnection] = one;
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
    return new Connector("x", "right", "left")
  }

   /**
   * Returns a new down-to-up connector
   *
   * @returns {Connector}
   */
  static vertical(): Connector {
    return new Connector("y", "down", "up")
  }
}