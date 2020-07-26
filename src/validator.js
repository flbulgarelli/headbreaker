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


class AbstractValidator {

  constructor() {
    /** @type {ValidationListener[]} */
    this.validListeners = [];
    this._valid = undefined;
  }

  /**
   * Validates the puzzle, firing validation events
   *
   * @param {Puzzle} puzzle
   */
  validate(puzzle) {
    const wasValid = this._valid;
    // @ts-ignore
    this._valid = this.isValid(puzzle);
    if (this._valid && !wasValid) {
      this.fireValid(puzzle);
    }
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
   * @returns {boolean}
   */
  get valid() {
    return this._valid;
  }

  /**
   * Answers wether this is the {@link NullValidator}
   *
   * @returns {boolean}
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
      const [x2, y2] = expected[index];
      return Pair.diff(x, y, x2 * puzzle.pieceWidth, y2 * puzzle.pieceWidth);
    }
    const points = puzzle.points;
    const [x0, y0] = points[0];
    const [dx, dy] = diff(x0, y0, 0);
    return points.every(([x, y], index) => Pair.equal(dx, dy, ...diff(x, y, index)))
  };
};

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
  validate(puzzle) {},

  /**
   * @param {ValidationListener} f
   */
  onValid(f) {},

  /**
   * @returns {boolean}
   */
  get valid() {
    return false;
  },

  /**
   * Answers wether this is the {@link NullValidator}
   *
   * @returns {boolean}
   */
  get isNull() {
    return true;
  }
};


module.exports = {
  PuzzleValidator,
  PieceValidator,
  NullValidator
}
