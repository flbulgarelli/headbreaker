const {Anchor} = require('./anchor');
const Piece = require('./piece');
const {NullValidator} = require('./validator');

 /**
 * A puzzle primitive representation that can be easily stringified, exchanged and persisted
 *
 * @typedef {object} PuzzleDump
 * @property {number} pieceSize
 * @property {number} proximity
 * @property {import('./piece').PieceDump[]} pieces
 */

/**
 * @typedef {object} Settings
 * @property {number} [pieceSize]
 * @property {number} [proximity]
 */


 /**
  * A set of a {@link Piece}s that can be manipulated as a whole, and that can be
  * used as a pieces factory
  */
class Puzzle {

  /**
   * @param {Settings} [options]
   */
  constructor({pieceSize = 2, proximity = 1} = {}) {
    this.pieceSize = pieceSize;
    this.proximity = proximity;
    /** @type {Piece[]} */
    this.pieces = [];
    /** @type {import('./validator').Validator} */
    this.validator = NullValidator;
  }

  /**
   * Creates and adds to this puzzle a new piece
   *
   * @param {import('./structure').Structure} [options] the piece structure
   * @returns {Piece} the new piece
   */
  newPiece(options = {}) {
    const piece = new Piece(options);
    this.addPiece(piece);
    return piece;
  }

  /**
   * @param {Piece} piece
   */
  addPiece(piece) {
    this.pieces.push(piece);
    piece.belongTo(this);
  }

  /**
   * @param {Piece[]} pieces
   */
  addPieces(pieces) {
    pieces.forEach(it => this.addPiece(it));
  }

  /**
   * Annotates all the pieces with the given list of metadata
   *
   * @param {object[]} metadata
   */
  annotate(metadata) {
    this.pieces.forEach((piece, index) => piece.annotate(metadata[index]));
  }

  /**
   * Tries to connect pieces in their current positions
   * This method is O(n^2)
   */
  autoconnect() {
    this.pieces.forEach(it => this.autoconnectWith(it));
  }

  disconnect() {
    this.pieces.forEach(it => it.disconnect());
  }

  /**
   * Tries to connect the given piece to the rest of the set
   * This method is O(n)
   * @param {Piece} piece
   */
  autoconnectWith(piece) {
    this.pieces.filter(it => it !== piece).forEach(other => {
      piece.tryConnectWith(other);
      other.tryConnectWith(piece, true);
    })
  }

  /**
   * @param {number} maxX
   * @param {number} maxY
   */
  shuffle(maxX, maxY) {
    this.disconnect();
    this.pieces.forEach(it => it.recenterAround(Anchor.atRandom(maxX, maxY)));
    this.autoconnect();
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx, dy) {
    this.pieces.forEach(it => it.translate(dx, dy));
  }
  /**
   * @param {import('./piece').TranslationListener} f
   */
  onTranslate(f) {
    this.pieces.forEach(it => it.onTranslate(f));
  }

  /**
   * @param {import('./piece').ConnectionListener} f
   */
  onConnect(f) {
    this.pieces.forEach(it => it.onConnect(f));
  }

  /**
   * @param {import('./piece').ConnectionListener} f
   */
  onDisconnect(f) {
    this.pieces.forEach(it => it.onDisconnect(f));
  }

  /**
   * @param {import('./validator').ValidationListener} f
   */
  onValid(f) {
    this.validator.onValid(f);
  }


  get metadata() {
    return this.pieces.map(it => it.metadata);
  }

  /**
   * Returns the first piece
   *
   * @returns {Piece}
   */
  get head() {
    return this.pieces[0];
  }

  /**
   * Returns the central anchor of the first piece
   *
   * @returns {Anchor}
   */
  get headAnchor() {
    return this.head.centralAnchor;
  }

  /**
   * @param {import('./validator').Validator} validator
   */
  attachValidator(validator) {
    this.validator = validator;
  }

  isValid() {
    return this.validator.isValid(this);
  }

  validate() {
    this.validator.validate(this);
  }

  get connected() {
    return this.pieces.every(it => it.connected);
  }

  /**
   * Converts this piece into a plain, stringify-ready object.
   * Pieces should have ids
   *
   * @param {object} options config options for export
   * @param {boolean} [options.compact] if connection information must be omitted
   * @returns {PuzzleDump}
   */
  export(options = {}) {
    return {
      pieceSize: this.pieceSize,
      proximity: this.proximity,
      pieces: this.pieces.map(it => it.export(options))
    }
  }

  /**
   * @param {PuzzleDump} dump
   * @returns {Puzzle}
   */
  static import(dump) {
    const puzzle = new Puzzle({pieceSize: dump.pieceSize, proximity: dump.proximity});
    puzzle.addPieces(dump.pieces.map(it => Piece.import(it)));
    puzzle.autoconnect();
    return puzzle;
  }
}

module.exports = Puzzle;
