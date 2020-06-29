const {Anchor} = require('./anchor');
const Piece = require('./piece');

/**
 * @typedef {object} Settings
 * @property {number} [pieceSize]
 * @property {number} [proximity]
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
  }

  /**
   * @param {import('./structure').Structure} [options]
   */
  newPiece(options = {}) {
    const piece = new Piece(options);
    this.pieces.push(piece);
    piece.belongTo(this);
    return piece;
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
    this.pieces.forEach(it => it.placeAt(Anchor.atRandom(maxX, maxY)));
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

  get metadata() {
    return this.pieces.map(it => it.metadata);
  }
}

/**
 * @module Puzzle
 */
module.exports = Puzzle;
