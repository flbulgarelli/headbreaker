const Puzzle = require('./puzzle');
const Piece = require('./piece');
const Pair = require('./pair');

/**
 * @typedef {PieceValidator | PuzzleValidator | NullValidator} Validator
 **/

/**
 * @callback ValidationListener
 * @param {Puzzle} puzzle
 */

/** An abstract base validator */
class AbstractValidator {

  constructor() {
    /** @type {ValidationListener[]} */
    this.validListeners = [];
    this._valid = undefined;
  }

  /**
   * Validates the puzzle, updating the validity state and
   * firing validation events
   *
   * @param {Puzzle} puzzle
   */
  validate(puzzle) {
    const wasValid = this._valid;
    this.updateValidity(puzzle);
    if (this._valid && !wasValid) {
      this.fireValid(puzzle);
    }
  }

  /**
   * Updates the valid state.
   *
   * @param {Puzzle} puzzle
   */
  updateValidity(puzzle) {
    // @ts-ignore
    this._valid = this.isValid(puzzle);
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

  /**
   * Answers the current validity status of this validator. This
   * property neither alters the current status nor triggers new validity checks
   *
   * @type {boolean}
   */
  get valid() {
    return this._valid;
  }

  /**
   * Answers wether this is the {@link NullValidator}
   *
   * @type {boolean}
   */
  get isNull() {
    return false;
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

/** A validator that evaluates each piece independently */
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

/** A validator that evaluates the whole puzzle */
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

  /**
   * Compares two pairs
   *
   * @param {import('./pair').Pair} param0
   * @param {import('./pair').Pair} param1
   *
   * @returns {boolean}
   */
  static equalDiffs([dx0, dy0], [dx, dy]) {
    return Pair.equal(dx0, dy0, dx, dy, PuzzleValidator.DIFF_DELTA);
  }
}

/** A validator that always is invalid */
class NullValidator extends AbstractValidator {

  /**
   * @param {Puzzle} puzzle
   */
  isValid(puzzle) {
    return false;
  }

  /**
   * @type {boolean}
   */
  get isNull() {
    return true;
  }
};

/**
 * The delta used to compare distances
 *
 * @type {number}
 */
PuzzleValidator.DIFF_DELTA = 0.01;

/**
* @type {PuzzleCondition}
*/
PuzzleValidator.connected = (puzzle) => puzzle.connected;

/**
 * @param {import('./pair').Pair[]} expected the expected relative refs
 * @returns {PuzzleCondition}
 */
PuzzleValidator.relativeRefs = (expected) => {
  return (puzzle) => {
    function diff(x, y, index) {
      return Pair.diff(x, y, ...expected[index]);
    }
    const refs = puzzle.refs;
    const [x0, y0] = refs[0];
    const diff0 = diff(x0, y0, 0);
    return refs.every(([x, y], index) => PuzzleValidator.equalDiffs(diff0, diff(x, y, index)));
  };
};

module.exports = {
  PuzzleValidator,
  PieceValidator,
  NullValidator
}
