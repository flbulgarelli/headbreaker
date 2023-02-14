const {Anchor} = require('./anchor');
const Piece = require('./piece');
const {NullValidator} = require('./validator');
const {vector, ...Vector} = require('./vector')
const {radio} = require('./size')
const Shuffler = require('./shuffler');
const dragMode = require('./drag-mode');

/**
 * A puzzle primitive representation that can be easily stringified, exchanged and persisted
 *
 * @typedef {object} PuzzleDump
 * @property {import('./vector').Vector} pieceRadio
 * @property {number} proximity
 * @property {import('./piece').PieceDump[]} pieces
 */

/**
 * @typedef {object} Settings
 * @property {import('./vector').Vector|number} [pieceRadio]
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
  constructor({pieceRadio = 2, proximity = 1} = {}) {
    this.pieceSize = radio(pieceRadio);
    this.proximity = proximity;
    /** @type {Piece[]} */
    this.pieces = [];
    /** @type {import('./validator').Validator} */
    this.validator = new NullValidator();
    /** @type {import('./drag-mode').DragMode} */
    this.dragMode = dragMode.TryDisconnection;
  }

  /**
   * Creates and adds to this puzzle a new piece
   *
   * @param {import('./structure').Structure} [structure] the piece structure
   * @param {import('./piece').PieceConfig} [config] the piece config
   * @returns {Piece} the new piece
   */
  newPiece(structure = {}, config = {}) {
    const piece = new Piece(structure, config);
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
    this.shuffleWith(Shuffler.random(maxX, maxY));
  }

  /**
   * @param {import('./shuffler').Shuffler} shuffler
   */
  shuffleWith(shuffler) {
    this.disconnect();
    shuffler(this.pieces).forEach(({x, y}, index) => {
      this.pieces[index].relocateTo(x, y);
    });
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
   * Translates all the puzzle pieces so that are completely
   * within the given bounds, if possible.
   *
   * If pieces can not be completly places within the given
   * bounding box, the the `max` param is ignored.
   *
   * @param {import('./vector').Vector} min
   * @param {import('./vector').Vector} max
   */
  reframe(min, max) {
    let dx;
    const leftOffstage = min.x - Math.min(...this.pieces.map(it => it.leftAnchor.x));
    if (leftOffstage > 0) {
      dx = leftOffstage;
    } else {
      const rightOffstage = max.x - Math.max(...this.pieces.map(it => it.rightAnchor.x))
      if (rightOffstage < 0) {
        dx = rightOffstage;
      } else {
        dx = 0;
      }
    }

    let dy;
    const upOffstage = min.y - Math.min(...this.pieces.map(it => it.upAnchor.y));
    if (upOffstage > 0) {
      dy = upOffstage;
    } else {
      const downOffstage = max.y - Math.max(...this.pieces.map(it => it.downAnchor.y))
      if (downOffstage < 0) {
        dy = downOffstage;
      } else {
        dy = 0;
      }
    }

    this.translate(dx, dy);
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
    return this.pieces.map(it => it.centralAnchor.asPair());
  }

  /**
   * Answers a list of points whose coordinates are scaled
   * to the {@link Puzzle#pieceWidth}
   *
   * @type {import('./pair').Pair[]}
   */
  get refs() {
    return this.points.map(([x, y], index) => {
      const diameter = this.pieces[index].diameter;
      return [x / diameter.x, y / diameter.y]
    })
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
   * This is the double of the {@link Puzzle#pieceRadio}
   *
   * @type {import('./vector').Vector}
   */
  get pieceDiameter() {
    return this.pieceSize.diameter;
  }

  /**
   * The piece width, from center to edge
   *
   * @type {import('./vector').Vector}
   */
  get pieceRadio() {
    return this.pieceSize.radio;
  }

  /** Prevents pieces from disconnecting */
  forceConnectionWhileDragging() {
    this.dragMode = dragMode.ForceConnection;
  }

  /** Forces pieces to disconnect */
  forceDisconnectionWhileDragging() {
    this.dragMode = dragMode.ForceDisconnection;
  }

  /** Forces pieces to disconnect */
  tryDisconnectionWhileDragging() {
    this.dragMode = dragMode.TryDisconnection;
  }

  /**
   * @param {Piece} piece
   * @param {number} dx
   * @param {number} dy
   * @see {@link Piece#dragShouldDisconnect}
   */
  dragShouldDisconnect(piece, dx, dy) {
    return this.dragMode.dragShouldDisconnect(piece, dx, dy);
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
    const puzzle = new Puzzle({pieceRadio: dump.pieceRadio, proximity: dump.proximity});
    puzzle.addPieces(dump.pieces.map(it => Piece.import(it)));
    puzzle.autoconnect();
    return puzzle;
  }
}

module.exports = Puzzle;
