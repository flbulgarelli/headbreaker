const Puzzle = require('./puzzle');
const Piece = require('./piece');
const {anchor} = require('./anchor');
const {fixed, InsertSequence} = require('./sequence')

/**
 * A manufacturer allows to create rectangular
 * puzzles by automatically generating inserts
 */
class Manufacturer {
  constructor() {
    this.insertsGenerator = fixed;
    this.metadata = [];
  }

  /**
   * Attach metadata to each piece
   *
   * @param {object[]} metadata list of metadata that will be attached to each generated piece
   */
  withMetadata(metadata) {
    this.metadata = metadata;
  }

  /**
   * @param {import('./sequence').InsertsGenerator} generator
   */
  withInsertsGenerator(generator) {
    this.insertsGenerator = generator || this.insertsGenerator;
  }

  /**
   * If nothing is configured, default Puzzle structured is assumed
   *
   * @param {import('../src/puzzle').Settings} structure
   */
  withStructure(structure) {
    this.structure = structure
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  withDimmensions(width, height) {
    this.width = width;
    this.height = height;
  }

   /**
   * @returns {Puzzle}
   */
  build() {
    const puzzle = new Puzzle(this.structure);

    let verticalSequence = this._newSequence();
    let horizontalSequence;

    for (let y = 0; y < this.height; y++) {
      horizontalSequence = this._newSequence();
      verticalSequence.next();

      for (let x = 0; x < this.width; x++) {
        horizontalSequence.next();
        const piece = this._buildPiece(puzzle, horizontalSequence, verticalSequence);
        piece.placeAt(this._naturalAnchor(x, y, puzzle));
      }
    }
    this._annotateAll(puzzle.pieces);
    return puzzle;
  }

  /**
   * @param {Piece[]} pieces
   */
  _annotateAll(pieces) {
    pieces.forEach((piece, index) => this._annotate(piece, index));
  }

  /**
   * @param {Piece} piece
   * @param {number} index
   */
  _annotate(piece, index) {
    const baseMetadata = this.metadata[index];
    const metadata = baseMetadata ? Object.assign({}, baseMetadata) : {};
    metadata.id = metadata.id || String(index + 1);
    piece.annotate(metadata);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {Puzzle} puzzle
   */
  _naturalAnchor(x, y, puzzle) {
    const realSize = puzzle.pieceSize * 2;
    return anchor((x + 1) * realSize, (y + 1) * realSize)
  }

  _newSequence() {
    return new InsertSequence(this.insertsGenerator);
  }

  /**
   * @param {Puzzle} puzzle
   * @param {InsertSequence} horizontalSequence
   * @param {InsertSequence} verticalSequence
   */
  _buildPiece(puzzle, horizontalSequence, verticalSequence) {
    return puzzle.newPiece({
      left: horizontalSequence.previousComplement(),
      up: verticalSequence.previousComplement(),
      right: horizontalSequence.current(this.width),
      down: verticalSequence.current(this.height)
    });
  }
}

/**
 * @module Manufacturer
 */
module.exports = Manufacturer;
