import vector, { Vector } from './vector';
import Piece from './piece';
import { PuzzleValidator } from './validator';

interface SpatialMetadata {
  targetPosition?: Vector;
  currentPosition?: Vector;
}

/**
 * Functions for handling spatial metadata
 * and pieces and puzzles that are annotated with it
 */

 /**
  *
  * @param {Piece} piece
  */
function diffToTarget(piece: Piece) {
  return vector.diff(piece.metadata.targetPosition, piece.centralAnchor.asVector());
}

/**
 * @type {import('../src/validator').PuzzleCondition}
 */
const solved: import('../src/validator').PuzzleCondition = (puzzle) => relativePosition(puzzle) && PuzzleValidator.connected(puzzle);

/**
 * @type {import('../src/validator').PuzzleCondition}
 */
const relativePosition: import('../src/validator').PuzzleCondition = (puzzle) => {
  const diff0 = diffToTarget(puzzle.head);
  return puzzle.pieces.every(piece => PuzzleValidator.equalDiffs(diff0, diffToTarget(piece)));
}

/**
 *@type {import('../src/validator').PieceCondition}
 */
const absolutePosition: import('../src/validator').PieceCondition = (piece) => vector.equal(piece.centralAnchor.asVector(), piece.metadata.targetPosition);


/**
 * @param {SpatialMetadata} metadata
 * @param {Vector} target
 * @param {Vector} [current]
 */
function initialize(metadata: SpatialMetadata, target: Vector, current: Vector) {
  metadata.targetPosition = metadata.targetPosition || target;
  metadata.currentPosition = metadata.currentPosition || current || vector.copy(metadata.targetPosition);
}

module.exports = {
  initialize,
  solved,
  relativePosition,
  absolutePosition
}
