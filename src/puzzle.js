const vector = require('./vector');
const pivot = require('./pivot');
const {Anchor} = require('./anchor');

/**
 * @typedef {{pieceSize?: number, proximity?: number}} PuzzleStructure
 */
class Puzzle {

  /**
   * @param {PuzzleStructure?} options
   */
  constructor({pieceSize = 2, proximity = 1} = {}) {
    this.pieceSize = pieceSize;
    this.proximity = proximity;
    /** @type {Piece[]} */
    this.pieces = [];
  }

  /**
   * @param {PieceStructure?} options
   */
  newPiece(options = {}) {
    const piece = new Piece(options);
    this.pieces.push(piece);
    piece.belongsTo(this);
    return piece;
  }

  /**
   * Tries to connect pieces in their current positions
   * This method is O(n^2)
   */
  autoconnectAll() {
    this.pieces.forEach(it => this.autoconnect(it));
  }

  /**
   * Tries to connect the given piece to the rest of the set
   * This method is O(n)
   * @param {Piece} piece
   */
  autoconnect(piece) {
    this.pieces.filter(it => it !== piece).forEach(other => {
      piece.tryConnectWith(other);
      other.tryConnectWith(piece, true);
    })
  }

  get data() {
    return this.pieces.map(it => it.data);
  }
}

/**
 * @typedef {function(number, number):void} TranslationListener
 * @typedef {function(Piece):void} ConnectListener
 * @typedef {function():void} DisconnectListener
 * @typedef {{up?: Insert, down?: Insert, left?: Insert, right?: Insert}} PieceStructure
 */
class Piece {

  /**
   * @param {PieceStructure?} options
   */
  constructor({up = None, down = None, left = None, right = None} = {}) {
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    this._initializeListeners();
  }

  _initializeListeners() {
    /** @type {TranslationListener[]} */
    this.translateListeners = [];
    /** @type {ConnectListener[]} */
    this.connectListeners = [];
    /** @type {DisconnectListener[]} */
    this.disconnectListeners = [];
  }

  /**
   * @param {object} data
   */
  carry(data) {
    this.data = data;
  }

  /**
   * @param {Puzzle} puzzle
   */
  belongsTo(puzzle) {
    this.puzzle = puzzle;
  }

  /**
   * @returns {Piece[]}
   */
  get connections() {
    return [
      this.upConnection,
      this.downConnection,
      this.leftConnection,
      this.rightConnection
    ].filter(it => it);
  }

  /**
   * @param {TranslationListener} f
   */
  onTranslate(f) {
    this.translateListeners.push(f);
  }

  /**
   * @param {ConnectListener} f
   */
  onConnect(f) {
    this.connectListeners.push(f);
  }

  /**
   * @param {DisconnectListener} f
   */
  onDisconnect(f) {
    this.disconnectListeners.push(f);
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  fireOnTranslate(dx, dy) {
    this.translateListeners.forEach(it => it(dx, dy))
  }

  /**
   * @param {Piece} other
   */
  fireOnConnect(other) {
    this.connectListeners.forEach(it => it(other))
  }

  fireOnDisconnect() {
    this.disconnectListeners.forEach(it => it())
  }

  /**
   *
   * @param {Piece} other
   * @param {boolean?} back
   */
  connectVerticallyWith(other, back = false) {
    if (!this.canConnectVerticallyWith(other)) {
      throw new Error("can not connect vertically!");
    }
    other.attractVertically(this, back);
    this.downConnection = other;
    other.upConnection = this;
    this.fireOnConnect(other);
  }

  /**
   * @param {Piece} other
   */
  attractVertically(other, back = false) {
    const [iron, magnet] = pivot(this, other, back);
    let dx, dy;
    if (magnet.centralAnchor.y > iron.centralAnchor.y) {
      [dx, dy] = magnet.upAnchor.diff(iron.downAnchor)
    } else {
      [dx, dy] = magnet.downAnchor.diff(iron.upAnchor)
    }
    iron.push(dx, dy);
  }

  /**
   * @param {Piece} other
   * @param {boolean?} back
   */
  connectHorizontallyWith(other, back = false) {
    if (!this.canConnectHorizontallyWith(other)) {
      throw new Error("can not connect horizontally!");
    }
    other.attractHorizontally(this, back);
    this.rightConnection = other;
    other.leftConnection = this;
    this.fireOnConnect(other);
  }

  /**
   * @param {Piece} other
   */
  attractHorizontally(other, back = false) {
    const [iron, magnet] = pivot(this, other, back);
    let dx, dy;
    if (magnet.centralAnchor.x > iron.centralAnchor.x) {
      [dx, dy] = magnet.leftAnchor.diff(iron.rightAnchor)
    } else {
      [dx, dy] = magnet.rightAnchor.diff(iron.leftAnchor)
    }
    iron.push(dx, dy);
  }

  /**
   * @param {Piece} other
   * @param {boolean?} back
   */
  tryConnectWith(other, back = false) {
    this.tryConnectHorizontallyWith(other, back);
    this.tryConnectVerticallyWith(other, back);
  }

  /**
   *
   * @param {Piece} other
   * @param {boolean?} back
   */
  tryConnectHorizontallyWith(other, back = false) {
    if (this.canConnectHorizontallyWith(other)) {
      this.connectHorizontallyWith(other, back);
    }
  }
  /**
   *
   * @param {Piece} other
   * @param {boolean?} back
   */
  tryConnectVerticallyWith(other, back = false) {
    if (this.canConnectVerticallyWith(other)) {
      this.connectVerticallyWith(other, back);
    }
  }

  disconnect() {
    if (this.connected) {
      this.fireOnDisconnect();
    }

    if (this.upConnection) {
      this.upConnection.downConnection = null;
      /** @type {Piece} */
      this.upConnection = null;
    }

    if (this.downConnection) {
      this.downConnection.upConnection = null;
      this.downConnection = null;
    }

    if (this.leftConnection) {
      this.leftConnection.rightConnection = null;
      /** @type {Piece} */
      this.leftConnection = null;
    }

    if (this.rightConnection) {
      this.rightConnection.leftConnection = null;
      this.rightConnection = null;
    }
  }

  /**
   *
   * @param {Anchor} anchor
   */
  placeAt(anchor) {
    this.centralAnchor = anchor;
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx, dy, quiet = false) {
    if (!vector.isNull(dx, dy)) {
      this.centralAnchor.translate(dx, dy);
      if (!quiet) {
        this.fireOnTranslate(dx, dy);
      }
    }
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   * @param {boolean?} quiet
   * @param {Piece[]} pushedPieces
   */
  push(dx, dy, quiet = false, pushedPieces = [this]) {
    this.translate(dx, dy, quiet);

    const stationaries = this.connections.filter(it => pushedPieces.indexOf(it) === -1);
    pushedPieces.push(...stationaries);
    stationaries.forEach(it => it.push(dx, dy, false, pushedPieces));
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   */
  drag(dx, dy, quiet = false) {
    if (vector.isNull(dx, dy)) return;

    if (this.horizontallyOpenMovement(dx) && this.vericallyOpenMovement(dy)) {
      this.disconnect();
      this.translate(dx, dy, quiet);
    } else {
      this.push(dx, dy, quiet);
    }
  }

  drop() {
    this.puzzle.autoconnect(this);
  }

  dragAndDrop(dx, dy) {
    this.drag(dx, dy);
    this.drop();
  }

  /**
   *
   * @param {number} dy
   * @returns {boolean}
   */
  vericallyOpenMovement(dy) {
    return (dy > 0 && !this.downConnection) || (dy < 0 && !this.upConnection) || dy == 0;
  }

  /**
   *
   * @param {number} dx
   * @returns {boolean}
   */
  horizontallyOpenMovement(dx) {
    return (dx > 0 && !this.rightConnection) || (dx < 0 && !this.leftConnection) || dx == 0;
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  canConnectHorizontallyWith(other) {
    return this.horizontallyCloseTo(other) && this.horizontallyMatch(other);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  canConnectVerticallyWith(other) {
    return this.verticallyCloseTo(other) && this.verticallyMatch(other);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  verticallyCloseTo(other) {
    return this.downAnchor.closeTo(other.upAnchor, this.proximity);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  horizontallyCloseTo(other) {
    return this.rightAnchor.closeTo(other.leftAnchor, this.proximity);
  }


  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  verticallyMatch(other) {
    return this.down.match(other.up);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  horizontallyMatch(other) {
    return this.right.match(other.left);
  }

  get connected() {
    return this.upConnection || this.rightConnection || this.leftConnection || this.rightConnection;
  }

  /**
   * @return {Anchor}
   */
  get downAnchor() {
    return this.centralAnchor.translated(0, this.size);
  }

  /**
   * @return {Anchor}
   */
  get rightAnchor() {
    return this.centralAnchor.translated(this.size, 0);
  }

  /**
   * @return {Anchor}
   */
  get upAnchor() {
    return this.centralAnchor.translated(0, -this.size);
  }

  /**
   * @return {Anchor}
   */
  get leftAnchor() {
    return this.centralAnchor.translated(-this.size, 0);
  }

  /**
   * @return {number}
   */
  get size() {
    return this.puzzle.pieceSize;
  }

  /**
   * @returns {number}
   */
  get proximity() {
    return this.puzzle.proximity;
  }

}

/**
 * @typedef {(Tab|Slot|None)} Insert
 */

const Tab = {
  isSlot: () => false,
  isTab:  () => true,
  isNone:  () => false,
  match: (other) => other.isSlot()
}

const Slot = {
  isSlot: () => true,
  isTab:  () => false,
  isNone:  () => false,
  match: (other) => other.isTab()

}

const None = {
  isSlot: () => false,
  isTab:  () => false,
  isNone:  () => true,
  match: (other) => false
}

/**
 * @exports Puzzle
 */
module.exports = {
  None,
  Piece,
  Puzzle,
  Slot,
  Tab
}
