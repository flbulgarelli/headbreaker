const {Tab, Slot, None} = require('../src/structure');


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
 * @typedef {(index:number) => import('./structure').Insert} InsertsGenerator;
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
   * @returns {import('./structure').Insert}
   */
  previousComplement() {
    return this._previous.complement();
  }

  /**
   * @returns {import('./structure').Insert}
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


/**
 * @module sequence
 */
module.exports = {
  InsertSequence,
  fixed,
  flipflop,
  twoAndTwo,
  random
}
