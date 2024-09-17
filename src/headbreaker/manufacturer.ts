import Puzzle, { Settings } from './puzzle';
import Piece from './piece';
import { Anchor, anchor } from './anchor';
import { fixed, InsertSequence, InsertsGenerator } from './sequence';
import Metadata from './metadata';
import { Vector } from './vector';

/**
 * A manufacturer allows to create rectangular
 * puzzles by automatically generating inserts
 */
export default class Manufacturer {
  private insertsGenerator: InsertsGenerator;
  private metadata: any[];
  private headAnchor: Anchor | null;
  private structure?: Settings;
  width: number = 0;
  height: number = 0;

  constructor() {
    this.insertsGenerator = fixed;
    this.metadata = [];
    this.headAnchor = null;
  }

  /**
   * Attach metadata to each piece
   *
   * @param {object[]} metadata list of metadata that will be attached to each generated piece
   */
  withMetadata(metadata: object[]): void {
    this.metadata = metadata;
  }

  /**
   * @param {InsertsGenerator} generator
   */
  withInsertsGenerator(generator: InsertsGenerator): void {
    this.insertsGenerator = generator || this.insertsGenerator;
  }

  /**
   * Sets the central anchor. If not specified, puzzle will be positioned
   * at the distance of a whole piece from the origin
   *
   * @param {Anchor} anchor
   */
  withHeadAt(anchor: Anchor): void {
    this.headAnchor = anchor;
  }

  /**
   * If nothing is configured, default Puzzle structured is assumed
   *
   * @param {Settings} structure
   */
  withStructure(structure: Settings): void {
    this.structure = structure;
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  withDimensions(width: number, height: number): void {
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
    let horizontalSequence: InsertSequence;

    for (let y = 0; y < this.height; y++) {
      horizontalSequence = this._newSequence();
      verticalSequence.next();

      for (let x = 0; x < this.width; x++) {
        horizontalSequence.next();
        const piece = this._buildPiece(
          puzzle,
          horizontalSequence,
          verticalSequence
        );
        piece.centerAround(positioner.naturalAnchor(x, y));
      }
    }
    this._annotateAll(puzzle.pieces);
    return puzzle;
  }

  private _annotateAll(pieces: Piece[]): void {
    pieces.forEach((piece, index) => this._annotate(piece, index));
  }

  private _annotate(piece: Piece, index: number): void {
    const baseMetadata = this.metadata[index];
    const metadata = baseMetadata ? Metadata.copy(baseMetadata) : {};
    metadata.id = metadata.id || String(index + 1);
    piece.annotate(metadata);
  }

  private _newSequence(): InsertSequence {
    return new InsertSequence(this.insertsGenerator);
  }

  private _buildPiece(
    puzzle: Puzzle,
    horizontalSequence: InsertSequence,
    verticalSequence: InsertSequence
  ): Piece {
    return puzzle.newPiece({
      left: horizontalSequence.previousComplement(),
      up: verticalSequence.previousComplement(),
      right: horizontalSequence.current(this.width),
      down: verticalSequence.current(this.height),
    });
  }
}

class Positioner {
  private puzzle: Puzzle;
  private offset: Vector;

  constructor(puzzle: Puzzle, headAnchor: Anchor | null) {
    this.puzzle = puzzle;
    this.offset = this.initializeOffset(headAnchor);
  }

  private initializeOffset(headAnchor: Anchor | null): Vector {
    if (headAnchor) {
      return headAnchor.asVector();
    } else {
      return this.pieceDiameter;
    }
  }

  private get pieceDiameter(): Vector {
    return this.puzzle.pieceDiameter;
  }

  naturalAnchor(x: number, y: number): Anchor {
    return anchor(
      x * this.pieceDiameter.x + this.offset.x,
      y * this.pieceDiameter.y + this.offset.y
    );
  }
}
