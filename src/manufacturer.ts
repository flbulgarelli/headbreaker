import Piece from './piece';

import * as Puzzle from './puzzle';
import * as Metadata from './metadata';

import { anchor, Anchor } from './anchor';
import { fixed, InsertSequence, InsertsGenerator } from './sequence';
import { Insert } from './insert';

/**
 * A manufacturer allows to create rectangular
 * puzzles by automatically generating inserts
 */
export default class Manufacturer {
  insertsGenerator: (_n: number) => Insert;
  metadata: any[];
  headAnchor: Anchor;
  structure: any;
  width: number;
  height: number;

  constructor() {
    this.insertsGenerator = fixed;
    this.metadata = [];
    /** @type {Anchor} */
    this.headAnchor = null;
  }

  /**
   * Attach metadata to each piece
   *
   * @param {object[]} metadata list of metadata that will be attached to each generated piece
   */
  withMetadata(metadata: object[]) {
    this.metadata = metadata;
  }

  /**
   * @param {InsertsGenerator} generator
   */
  withInsertsGenerator(generator: InsertsGenerator) {
    this.insertsGenerator = generator || this.insertsGenerator;
  }

  /**
   * Sets the central anchor. If not specified, puzzle will be positioned
   * at the distance of a whole piece from the origin
   *
   * @param {Anchor} anchor
   */
  withHeadAt(anchor: Anchor) {
    this.headAnchor = anchor;
  }

  /**
   * If nothing is configured, default Puzzle structured is assumed
   *
   * @param {import('./puzzle').Settings} structure
   */
  withStructure(structure: import('./puzzle').Settings) {
    this.structure = structure
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  withDimensions(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

   /**
   * @returns {Puzzle}
   */
  build(): Puzzle {
    const puzzle = new Puzzle(this.structure);
    const positioner = new Positioner(puzzle, this.headAnchor);

    let verticalSequence = this._newSequence();
    let horizontalSequence;

    for (let y = 0; y < this.height; y++) {
      horizontalSequence = this._newSequence();
      verticalSequence.next();

      for (let x = 0; x < this.width; x++) {
        horizontalSequence.next();
        const piece = this._buildPiece(puzzle, horizontalSequence, verticalSequence);
        piece.centerAround(positioner.naturalAnchor(x, y));
      }
    }
    this._annotateAll(puzzle.pieces);
    return puzzle;
  }

  /**
   * @param {Piece[]} pieces
   */
  _annotateAll(pieces: Piece[]) {
    pieces.forEach((piece, index) => this._annotate(piece, index));
  }

  /**
   * @param {Piece} piece
   * @param {number} index
   */
  _annotate(piece: Piece, index: number) {
    const baseMetadata = this.metadata[index];
    const metadata = baseMetadata ? Metadata.copy(baseMetadata) : {};
    metadata.id = metadata.id || String(index + 1);
    piece.annotate(metadata);
  }

  _newSequence() {
    return new InsertSequence(this.insertsGenerator);
  }

  /**
   * @param {Puzzle} puzzle
   * @param {InsertSequence} horizontalSequence
   * @param {InsertSequence} verticalSequence
   */
  _buildPiece(puzzle: Puzzle, horizontalSequence: InsertSequence, verticalSequence: InsertSequence) {
    return puzzle.newPiece({
      left: horizontalSequence.previousComplement(),
      up: verticalSequence.previousComplement(),
      right: horizontalSequence.current(this.width),
      down: verticalSequence.current(this.height)
    });
  }
}

class Positioner {
  puzzle: any;
  offset: any;
  /**
   *
   * @param {Puzzle} puzzle
   * @param {Anchor} headAnchor
   */
  constructor(puzzle: Puzzle, headAnchor: Anchor) {
    this.puzzle = puzzle;
    this.initializeOffset(headAnchor);
  }

  /**
   * @param {Anchor} headAnchor
   */
  initializeOffset(headAnchor: Anchor) {
    if (headAnchor) {
      /** @type {import('./vector').Vector} */
      this.offset = headAnchor.asVector();
    }
    else {
      this.offset = this.pieceDiameter;
    }
  }

  get pieceDiameter() {
    return this.puzzle.pieceDiameter;
  }

    /**
   * @param {number} x
   * @param {number} y
   */
  naturalAnchor(x: number, y: number) {
    return anchor(
      x * this.pieceDiameter.x + this.offset.x,
      y * this.pieceDiameter.y + this.offset.y);
  }
}
