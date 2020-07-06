const Puzzle = require('./puzzle');
const Piece = require('./piece');

/**
 * @typedef {PieceValidator | PuzzleValidator | NullValidator} Validator
 **/

/**
 * @callback ValidationListener
 * @param {Puzzle} puzzle
 */


class AbstractValidator {

  constructor() {
    /** @type {ValidationListener[]} */
    this.validListeners = [];
    this._valid = false;
  }

  /**
   * Validates the puzzle, firing validation events
   *
   * @param {Puzzle} puzzle
   */
  validate(puzzle) {
    // @ts-ignore
    const valid = this.isValid(puzzle);
    if (valid && !this._valid) {
      this.fireValid(puzzle);
    }
    this._valid = valid;
  }

  /**
   * @param {Puzzle} puzzle
   */
  fireValid(puzzle) {
    this.validListeners.forEach(it => it(puzzle));
  }

  /**
   * Registers a validation listener
   *
   * @param {ValidationListener} f
   */
  onValid(f) {
    this.validListeners.push(f);
  }

  get valid() {
    return this._valid;
  }
}

/**
 * @callback PieceCondition
 * @param {Piece} puzzle
 * @returns {boolean}
 */


/**
 * @callback PuzzleCondition
 * @param {Puzzle} puzzle
 * @returns {boolean}
 */

class PieceValidator extends AbstractValidator {

  /**
   * @param {PieceCondition} f
   */
  constructor(f) {
    super();
    this.condition = f;
  }

  /**
   * @param {Puzzle} puzzle
   * @returns {boolean}
   */
  isValid(puzzle) {
    return puzzle.pieces.every(it => this.condition(it));
  }
}

class PuzzleValidator extends AbstractValidator {

  /**
   * @param {PuzzleCondition} f
   */
  constructor(f) {
    super();
    this.condition = f;
  }

  /**
   * @param {Puzzle} puzzle
   */
  isValid(puzzle) {
    return this.condition(puzzle);
  }
}

const NullValidator = {
  /**
   * @param {Puzzle} puzzle
   */
  isValid(puzzle) {
    return false;
  },

  /**
   * @param {Puzzle} puzzle
   */
  validate(puzzle) {}
};


module.exports = {
  PuzzleValidator,
  PieceValidator,
  NullValidator
}
