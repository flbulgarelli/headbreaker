const {Puzzle} = require('./puzzle');
const {anchor} = require('./anchor');
const {fixed, InsertSequence} = require('./sequence')

class Manufacturer {
  constructor() {
    this.insertsGenerator = fixed;
  }

  /**
   * @param {import('./sequence').InsertsGenerator} generator
   */
  configureInsertsGenerator(generator) {
    this.insertsGenerator = generator || this.insertsGenerator;
  }

  /**
   * If nothing is configured, default Puzzle structured is assumed
   *
   * @param {import('../src/puzzle').PuzzleStructure} structure
   */
  configureStructure(structure) {
    this.structure = structure
  }

  /**
   *
   * @param {number} width
   * @param {number} height
   */
  configureDimmensions(width, height) {
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
        piece.placeAt(anchor(x * puzzle.pieceSize * 2, y * puzzle.pieceSize * 2));
      }
    }
    return puzzle;
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

module.exports = Manufacturer;
