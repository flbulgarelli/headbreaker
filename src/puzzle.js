const {Anchor} = require('./anchor');
const Piece = require('./piece');
const {NullValidator} = require('./validator');
const {position, ...Position} = require('./position')

/**
 * A puzzle primitive representation that can be easily stringified, exchanged and persisted
 *
 * @typedef {object} PuzzleDump
 * @property {import('./position').Position} pieceRadio
 * @property {number} proximity
 * @property {import('./piece').PieceDump[]} pieces
 */

/**
 * @typedef {object} Settings
 * @property {number} [pieceSize]
 * @property {import('./position').Position} [pieceRadio]
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
  constructor({pieceSize = 2, pieceRadio = null, proximity = 1} = {}) {
    this.pieceRadio = pieceRadio || position(pieceSize, pieceSize);
    this.proximity = proximity;
    /** @type {Piece[]} */
    this.pieces = [];
    /** @type {import('./validator').Validator} */
    this.validator = new NullValidator();
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
   * Relocates all the pieces to the given list of points
   *
   * @param {import('./pair').Pair[]} points
   */
  relocateTo(points) {
    this.pieces.forEach((piece, index) => piece.relocateTo(...points[index]));
  }

  /**
   * Tries to connect pieces in their current positions
   * This method is O(n^2)
   */
  autoconnect() {
    this.pieces.forEach(it => this.autoconnectWith(it));
  }

  /**
   * Disconnects all pieces
   */
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

  /**
   * Answers the list of points where
   * central anchors of pieces are located
   *
   * @type {import('./pair').Pair[]}
   */
  get points() {
    return this.pieces.map(it => it.centralAnchor.asPoint());
  }

  /**
   * Answers a list of points whose coordinates are scaled
   * to the {@link Puzzle#pieceWidth}
   *
   * @type {import('./pair').Pair[]}
   */
  get refs() {
    return this.points.map(([x, y]) => [x / this.pieceDiameter.x, y / this.pieceDiameter.y])
  }

  /**
   * @type {any[]}
   */
  get metadata() {
    return this.pieces.map(it => it.metadata);
  }

  /**
   * Returns the first piece
   *
   * @type {Piece}
   */
  get head() {
    return this.pieces[0];
  }

  /**
   * Returns the central anchor of the first piece
   *
   * @type {Anchor}
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

  /**
   * Checks whether this puzzle is valid.
   *
   * Calling this method will not fire any validation listeners nor update the
   * valid property.
   *
   * @returns {boolean}
   */
  isValid() {
    return this.validator.isValid(this);
  }

  /**
   * Returns the current validation status
   *
   * Calling this property will not fire any validation listeners.
   *
   * @type {boolean}
   */
  get valid() {
    return this.validator.valid;
  }

  /**
   * Checks whether this puzzle is valid, updating valid property
   * and firing validation listeners if becomes valid
   */
  validate() {
    this.validator.validate(this);
  }

  /**
   * Checks whether this puzzle is valid, updating valid property.
   *
   * Validations listeners are NOT fired.
   */
  updateValidity() {
    this.validator.validate(this);
  }

  /**
   * Wether all the pieces in this puzzle are connected
   *
   * @type {boolean}
   */
  get connected() {
    return this.pieces.every(it => it.connected);
  }

  /**
   * The piece width, from edge to edge.
   * This is the double of the {@link Puzzle#pieceSize}
   *
   * @type {import('./position').Position}
   */
  get pieceDiameter() {
    return Position.multiply(this.pieceRadio, 2);
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
      pieceRadio: this.pieceRadio,
      proximity: this.proximity,
      pieces: this.pieces.map(it => it.export(options))
    }
  }

  /**
   * @param {PuzzleDump} dump
   * @returns {Puzzle}
   */
  static import(dump) {
    const puzzle = new Puzzle({pieceRadio: dump.pieceSize, proximity: dump.proximity});
    puzzle.addPieces(dump.pieces.map(it => Piece.import(it)));
    puzzle.autoconnect();
    return puzzle;
  }
}

module.exports = Puzzle;
