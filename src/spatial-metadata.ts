import vector from './vector';
import * as Piece from './piece';
import { PuzzleValidator } from './validator';

interface SpatialMetadata {
  targetPosition?: import('./vector').Vector;
  currentPosition?: import('./vector').Vector;
}

/**
 * Functions for handling spatial metadata
 * and pieces and puzzles that are annotated with it
 */

 /**
  *
  * @param {Piece} piece
  */
function diffToTarget(piece) {
  return vector.diff(piece.metadata.targetPosition, piece.centralAnchor.asVector());
}

/**
 * @type {import('../src/validator').PuzzleCondition}
 */
const solved = (puzzle) => relativePosition(puzzle) && PuzzleValidator.connected(puzzle);

/**
 * @type {import('../src/validator').PuzzleCondition}
 */
const relativePosition = (puzzle) => {
  const diff0 = diffToTarget(puzzle.head);
  return puzzle.pieces.every(piece => PuzzleValidator.equalDiffs(diff0, diffToTarget(piece)));
}

/**
 *@type {import('../src/validator').PieceCondition}
 */
const absolutePosition = (piece) => vector.equal(piece.centralAnchor.asVector(), piece.metadata.targetPosition);


/**
 * @param {SpatialMetadata} metadata
 * @param {import('./vector').Vector} target
 * @param {import('./vector').Vector} [current]
 */
function initialize(metadata, target, current) {
  metadata.targetPosition = metadata.targetPosition || target;
  metadata.currentPosition = metadata.currentPosition || current || vector.copy(metadata.targetPosition);
}

module.exports = {
  initialize,
  solved,
  relativePosition,
  absolutePosition
}
