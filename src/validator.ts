import * as Puzzle from './puzzle';
import Piece from './piece';
import pair, { Pair } from './pair';

/**
 * @typedef {PieceValidator | PuzzleValidator | NullValidator} Validator
 **/

type ValidationListener = (puzzle: Puzzle) => void

/** An abstract base validator */
export class AbstractValidator {
  validListeners: ValidationListener[];
  _valid: boolean | undefined;

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
  validate(puzzle: Puzzle) {
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
  updateValidity(puzzle: Puzzle) {
    // @ts-ignore
    this._valid = this.isValid(puzzle);
  }

  /**
   * @param {Puzzle} puzzle
   */
  fireValid(puzzle: Puzzle) {
    this.validListeners.forEach(it => it(puzzle));
  }

  /**
   * Registers a validation listener
   *
   * @param {ValidationListener} f
   */
  onValid(f: ValidationListener) {
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

export type PieceCondition = (piece: Piece) => boolean
export type PuzzleCondition = (puzzle: Puzzle) => boolean

/** A validator that evaluates each piece independently */
export class PieceValidator extends AbstractValidator {
  condition: PieceCondition;

  /**
   * @param {PieceCondition} f
   */
  constructor(f: PieceCondition) {
    super();
    this.condition = f;
  }

  /**
   * @param {Puzzle} puzzle
   * @returns {boolean}
   */
  isValid(puzzle: Puzzle): boolean {
    return puzzle.pieces.every(it => this.condition(it));
  }
}

/** A validator that evaluates the whole puzzle */
export class PuzzleValidator extends AbstractValidator {
  condition: PuzzleCondition;

  /**
   * The delta used to compare distances
   *
   * @type {number}
   */
  static DIFF_DELTA: number = 0.01;

  /**
  * @type {PuzzleCondition}
  */
  static connected: PuzzleCondition = (puzzle) => puzzle.connected;


  /**
   * @param {PuzzleCondition} f
   */
  constructor(f: PuzzleCondition) {
    super();
    this.condition = f;
  }

  /**
   * @param {Puzzle} puzzle
   */
  isValid(puzzle: Puzzle) {
    return this.condition(puzzle);
  }

  /**
   * Compares two pairs
   *
   * @param {Pair} param0
   * @param {Pair} param1
   *
   * @returns {boolean}
   */
  static equalDiffs([dx0, dy0]: Pair, [dx, dy]: Pair): boolean {
    return pair.equal(dx0, dy0, dx, dy, PuzzleValidator.DIFF_DELTA);
  }

  /**
   * @param {Pair[]} expected the expected relative refs
   * @returns {PuzzleCondition}
   */
  static relativeRefs(expected: Pair[]): PuzzleCondition {
    return (puzzle) => {
      function diff(x, y, index) {
        return pair.diff(x, y, ...expected[index]);
      }
      const refs = puzzle.refs;
      const [x0, y0] = refs[0];
      const diff0 = diff(x0, y0, 0);
      return refs.every(([x, y], index) => PuzzleValidator.equalDiffs(diff0, diff(x, y, index)));
    };
  }
}

/** A validator that always is invalid */
export class NullValidator extends AbstractValidator {

  /**
   * @param {Puzzle} puzzle
   */
  isValid(puzzle: Puzzle) {
    return false;
  }

  /**
   * @type {boolean}
   */
  get isNull() {
    return true;
  }
};
