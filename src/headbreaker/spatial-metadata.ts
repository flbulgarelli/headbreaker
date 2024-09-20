import vector, { Vector } from './vector';
import Piece from './piece';
import { PuzzleValidator, PuzzleCondition, PieceCondition } from './validator';

export interface SpatialMetadata {
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
  return vector.diff(
    piece.metadata.targetPosition!,
    piece.centralAnchor?.asVector() ?? vector.zero()
  );
}

/**
 * @type {PuzzleCondition}
 */
const solved: PuzzleCondition = (puzzle) =>
  relativePosition(puzzle) && PuzzleValidator.connected(puzzle);

/**
 * @type {PuzzleCondition}
 */
const relativePosition: PuzzleCondition = (puzzle) => {
  const diff0 = diffToTarget(puzzle.head);
  return puzzle.pieces.every((piece) =>
    PuzzleValidator.equalDiffs(diff0, diffToTarget(piece))
  );
};

/**
 *@type {PieceCondition}
 */
const absolutePosition: PieceCondition = (piece) =>
  piece.metadata.targetPosition !== undefined &&
  vector.equal(
    piece.centralAnchor?.asVector() ?? vector.zero(),
    piece.metadata.targetPosition
  );

/**
 * @param {SpatialMetadata} metadata
 * @param {Vector} target
 * @param {Vector} [current]
 */
function initialize(
  metadata: SpatialMetadata,
  target: Vector,
  current?: Vector
) {
  metadata.targetPosition = metadata.targetPosition || target;
  metadata.currentPosition =
    metadata.currentPosition || current || vector.copy(metadata.targetPosition);
}

export default {
  initialize,
  relativePosition,
  absolutePosition,
  solved,
};
