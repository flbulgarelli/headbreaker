const {Tab, Slot, None} = require('../src/puzzle');


/** @typedef {import('./puzzle').Insert} Insert */

/**
 * @type {InsertsGenerator};
 */
function fixed(_n) {
  return Tab;
}

/**
 * @type {InsertsGenerator};
 */
function flipflop(n) {
  return n % 2 === 0 ? Tab : Slot;
}

/**
 * @type {InsertsGenerator};
 */
function twoAndTwo(n) {
  return n % 4 < 2 ? Tab : Slot;
}

/**
 * @type {InsertsGenerator};
 */
function random(_) {
  return Math.random() < 0.5 ? Tab : Slot;
}

/**
 * @typedef {(index:number) => Insert} InsertsGenerator;
 */
class InsertSequence {
  /**
   * @param {InsertsGenerator} generator;
   */
  constructor(generator) {
    this.generator = generator;
    this.n = 0
    this._previous;
    this._current = None;
  }

  /**
   * @returns {Insert}
   */
  previousComplement() {
    return this._previous.complement();
  }

  /**
   * @returns {Insert}
   */
  current(max) {
    if (this.n == max) {
      return None
    }
    return this._current;
  }

  next() {
    this._previous = this._current;
    this._current = this.generator(this.n++);
    return this._current;
  }
}

module.exports = {
  InsertSequence,
  fixed,
  flipflop,
  twoAndTwo,
  random
}
