/**
 * @private
 * @module Connector
 */
const {pivot} = require('./prelude');

/**
 * @private
 */
class Connector {

  /**
   * @param {"x" | "y"} axis
   * @param {"right" | "down"} forward
   * @param {"left" | "up"} backward
   */
  constructor(axis, forward, backward) {

    this.axis = axis;

    this.forward = forward;
    this.backward = backward;

    this.forwardAnchor = `${forward}Anchor`;
    this.backwardAnchor = `${backward}Anchor`;

    this.forwardConnection = `${forward}Connection`;
    this.backwardConnection = `${backward}Connection`;
  }

  /**
   * @param {boolean} [back]
   */
  attract(one, other, back = false) {
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
  openMovement(one, delta) {
    return (delta > 0 && !one[this.forwardConnection]) || (delta < 0 && !one[this.backwardConnection]) || delta == 0;
  }

  /**
   * @param {number} proximity
   * @returns {boolean}
   */
  canConnectWith(one, other, proximity) {
    return this.closeTo(one, other, proximity) && this.match(one, other);
  }

  /**
   *
   * @param {number} proximity
   * @returns {boolean}
   */
  closeTo(one, other, proximity) {
    return one[this.forwardAnchor].closeTo(other[this.backwardAnchor], proximity);
  }

  /**
   * @returns {boolean}
   */
  match(one, other) {
    return one[this.forward].match(other[this.backward]);
  }

  /**
   * @param {import('./piece')} one
   * @param {*} other
   * @param {number} proximity
   * @param {boolean} back
   */
  connectWith(one, other, proximity, back) {
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
}

module.exports = {
  horizontal: new Connector("x", "right", "left"),
  vertical: new Connector("y", "down", "up")
};
