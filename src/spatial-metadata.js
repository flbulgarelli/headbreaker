const Position = require('./position');
const Vector = require('./vector');
const {PuzzleValidator} = require('./validator');

/**
 * @typedef {object} SpatialMetadata
 * @property {import('./position').Position} [targetPosition]
 * @property {import('./position').Position} [currentPosition]
 */

/**
 * Functions for handling spatial metadata
 * and pieces and puzzles that are annotated with it
 *
 * @module SpatialMetadata
 */

function diffToTarget(piece) {
  return Position.diff(piece.metadata.targetPosition, piece.centralAnchor.asPosition());
}

/**
 * @type {import('../src/validator').PuzzleCondition}
 */
const solved = (puzzle) => relativePosition(puzzle) && PuzzleValidator.connected(puzzle);

/**
 * @type {import('../src/validator').PuzzleCondition}
 */
const relativePosition = (puzzle) => {
  const [dx, dy] = diffToTarget(puzzle.head);
  return puzzle.pieces.every(piece => {
    return Vector.equal(dx, dy, ...diffToTarget(piece))
  });
}

/**
 *@type {import('../src/validator').PieceCondition}
 */
const absolutePosition = (piece) => Position.equal(piece.centralAnchor.asPosition(), piece.metadata.targetPosition);


/**
 * @param {SpatialMetadata} metadata
 * @param {import('./position').Position} target
 * @param {import('./position').Position} [current]
 */
function initialize(metadata, target, current) {
  metadata.targetPosition = metadata.targetPosition || target;
  metadata.currentPosition = metadata.currentPosition || current || Position.copy(metadata.targetPosition);
}

module.exports = {
  initialize,
  solved,
  relativePosition,
  absolutePosition
}
