import Piece, { PieceConfig } from './piece';
import { NullValidator, ValidationListener, Validator } from './validator';
import { radius, Size } from './size';
import {
  ForceConnection,
  ForceDisconnection,
  TryDisconnection,
} from './drag-mode';
import {
  ConnectionRequirement,
  Connector,
  noConnectionRequirements,
} from './connector';
import { Structure } from './structure';
import Shuffler from './shuffler';
import { Vector } from './vector';

export interface Settings {
  pieceRadius?: Size | number | Vector;
  proximity?: number;
}

interface PuzzleDump {
  pieceRadius: Size | number | Vector;
  proximity: number;
  pieces: any[];
}

/**
 * A puzzle primitive representation that can be easily stringified, exchanged and persisted
 *
 * @typedef {object} PuzzleDump
 * @property {Vector} pieceRadius
 * @property {number} proximity
 * @property {PieceDump[]} pieces
 */

/**
 * @typedef {object} Settings
 * @property {Vector|number} [pieceRadius]
 * @property {number} [proximity]
 */

/**
 * A set of a {@link Piece}s that can be manipulated as a whole, and that can be
 * used as a pieces factory
 */
class Puzzle {
  pieceSize: Size;
  proximity: number;
  pieces: Piece[];
  validator: NullValidator;
  dragMode: any;
  horizontalConnector: Connector;
  verticalConnector: Connector;
  /**
   * @param {Settings} [options]
   */
  constructor({ pieceRadius = 2, proximity = 1 }: Settings = {} as Settings) {
    this.pieceSize = radius(
      typeof pieceRadius === 'number'
        ? pieceRadius
        : (pieceRadius as Size).radius
    );
    this.proximity = proximity;
    /** @type {Piece[]} */
    this.pieces = [];
    /** @type {import('./validator').Validator} */
    this.validator = new NullValidator();
    /** @type {import('./drag-mode').DragMode} */
    this.dragMode = TryDisconnection;

    this.horizontalConnector = Connector.horizontal();
    this.verticalConnector = Connector.vertical();
  }

  /**
   * Creates and adds to this puzzle a new piece
   *
   * @param {Structure} [structure] the piece structure
   * @param {PieceConfig} [config] the piece config
   * @returns {Piece} the new piece
   */
  newPiece(structure: Structure = {}, config: PieceConfig = {}): Piece {
    const piece = new Piece(structure, config);
    this.addPiece(piece);
    return piece;
  }

  /**
   * @param {Piece} piece
   */
  addPiece(piece: Piece) {
    this.pieces.push(piece);
    piece.belongTo(this);
  }

  /**
   * @param {Piece[]} pieces
   */
  addPieces(pieces: Piece[]) {
    pieces.forEach((it) => this.addPiece(it));
  }

  /**
   * Annotates all the pieces with the given list of metadata
   *
   * @param {object[]} metadata
   */
  annotate(metadata: object[]) {
    this.pieces.forEach((piece, index) => piece.annotate(metadata[index]));
  }

  /**
   * Relocates all the pieces to the given list of points
   *
   * @param {import('./pair').Pair[]} points
   */
  relocateTo(points: import('./pair').Pair[]) {
    this.pieces.forEach((piece, index) => piece.relocateTo(...points[index]));
  }

  /**
   * Tries to connect pieces in their current positions
   * This method is O(n^2)
   */
  autoconnect() {
    this.pieces.forEach((it) => this.autoconnectWith(it));
  }

  /**
   * Disconnects all pieces
   */
  disconnect() {
    this.pieces.forEach((it) => it.disconnect());
  }

  /**
   * Tries to connect the given piece to the rest of the set
   * This method is O(n)
   * @param {Piece} piece
   */
  autoconnectWith(piece: Piece) {
    this.pieces
      .filter((it) => it !== piece)
      .forEach((other) => {
        piece.tryConnectWith(other);
        other.tryConnectWith(piece, true);
      });
  }

  /**
   * @param {number} maxX
   * @param {number} maxY
   */
  shuffle(maxX: number, maxY: number) {
    this.shuffleWith(Shuffler.random(maxX, maxY));
  }

  /**
   * @param {import('./shuffler').Shuffler} shuffler
   */
  shuffleWith(shuffler: import('./shuffler').Shuffler) {
    this.disconnect();
    shuffler(this.pieces).forEach(({ x, y }, index) => {
      this.pieces[index].relocateTo(x, y);
    });
    this.autoconnect();
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  translate(dx: number, dy: number) {
    this.pieces.forEach((it) => it.translate(dx, dy));
  }

  /**
   * Translates all the puzzle pieces so that are completely
   * within the given bounds, if possible.
   *
   * If pieces can not be completly places within the given
   * bounding box, the the `max` param is ignored.
   *
   * @param {Vector} min
   * @param {Vector} max
   */
  reframe(min: Vector, max: Vector) {
    let dx;
    const leftOffstage =
      min.x - Math.min(...this.pieces.map((it) => it.leftAnchor?.x ?? 0));
    if (leftOffstage > 0) {
      dx = leftOffstage;
    } else {
      const rightOffstage =
        max.x - Math.max(...this.pieces.map((it) => it.rightAnchor?.x ?? 0));
      if (rightOffstage < 0) {
        dx = rightOffstage;
      } else {
        dx = 0;
      }
    }

    let dy;
    const upOffstage =
      min.y - Math.min(...this.pieces.map((it) => it.upAnchor?.y ?? 0));
    if (upOffstage > 0) {
      dy = upOffstage;
    } else {
      const downOffstage =
        max.y - Math.max(...this.pieces.map((it) => it.downAnchor.y));
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
  onTranslate(f: import('./piece').TranslationListener) {
    this.pieces.forEach((it) => it.onTranslate(f));
  }

  /**
   * @param {import('./piece').ConnectionListener} f
   */
  onConnect(f: import('./piece').ConnectionListener) {
    this.pieces.forEach((it) => it.onConnect(f));
  }

  /**
   * @param {import('./piece').ConnectionListener} f
   */
  onDisconnect(f: import('./piece').ConnectionListener) {
    this.pieces.forEach((it) => it.onDisconnect(f));
  }

  /**
   * @param {ValidationListener} f
   */
  onValid(f: ValidationListener) {
    this.validator.onValid(f);
  }

  /**
   * Answers the list of points where
   * central anchors of pieces are located
   *
   * @type {import('./pair').Pair[]}
   */
  get points() {
    return this.pieces.map((it) => it.centralAnchor?.asPair() ?? [0, 0]);
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
      const defaultDiameter = { x: 1, y: 1 };
      const actualDiameter = diameter ?? defaultDiameter;
      return [x / actualDiameter.x, y / actualDiameter.y];
    });
  }

  /**
   * @type {any[]}
   */
  get metadata() {
    return this.pieces.map((it) => it.metadata);
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
   * Returns the attached vertical ConnectionRequirement
   * function.
   *
   * @returns {ConnectionRequirement}
   */
  get verticalRequirement(): ConnectionRequirement {
    return this.verticalConnector.requirement;
  }

  /**
   * Returns the attached horizontal ConnectionRequirement
   * function.
   *
   * @returns {import('./connector').ConnectionRequirement}
   */
  get horizontalRequirement(): import('./connector').ConnectionRequirement {
    return this.horizontalConnector.requirement;
  }

  /**
   * Attaches a connection requirement function that will be used to check whether
   * two horizontally close and matching pieces can be actually connected.
   *
   * By default no horizontal connection requirement is imposed which means that any horizontally
   * close and matching pieces will be connected.
   *
   * @param {import('./connector').ConnectionRequirement} requirement
   */
  attachHorizontalConnectionRequirement(
    requirement: import('./connector').ConnectionRequirement
  ) {
    this.horizontalConnector.attachRequirement(requirement);
  }

  /**
   * Attaches a connection requirement function that will be used to check whether
   * two vertically close and matching pieces can be actually connected.
   *
   * By default no vertical connection requirement is imposed which means that any vertically
   * close and matching pieces will be connected.
   *
   * @param {import('./connector').ConnectionRequirement} requirement
   */
  attachVerticalConnectionRequirement(
    requirement: import('./connector').ConnectionRequirement
  ) {
    this.verticalConnector.attachRequirement(requirement);
  }

  /**
   * Attaches the given connection requirement as both a vertical and horizontal requirement.
   *
   * @see {@link Puzzle#attachVerticalConnectionRequirement}
   * @see {@link Puzzle#attachHorizontalConnectionRequirement}
   *
   * @param {import('./connector').ConnectionRequirement} requirement
   */
  attachConnectionRequirement(
    requirement: import('./connector').ConnectionRequirement
  ) {
    this.attachHorizontalConnectionRequirement(requirement);
    this.attachVerticalConnectionRequirement(requirement);
  }

  /**
   * Removes the vertical and horizontal connection requirements, if any.
   */
  clearConnectionRequirements() {
    this.attachConnectionRequirement(noConnectionRequirements);
  }

  /**
   * @param {Validator} validator
   */
  attachValidator(validator: Validator) {
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
  isValid(): boolean {
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
    return this.pieces.every((it) => it.connected);
  }

  /**
   * The piece width, from edge to edge.
   * This is the double of the {@link Puzzle#pieceRadius}
   *
   * @type {Vector}
   */
  get pieceDiameter() {
    return this.pieceSize.diameter;
  }

  /**
   * The piece width, from center to edge
   *
   * @type {Vector}
   */
  get pieceRadius() {
    return this.pieceSize.radius;
  }

  /** Prevents pieces from disconnecting */
  forceConnectionWhileDragging() {
    this.dragMode = ForceConnection;
  }

  /** Forces pieces to disconnect */
  forceDisconnectionWhileDragging() {
    this.dragMode = ForceDisconnection;
  }

  /** Forces pieces to disconnect */
  tryDisconnectionWhileDragging() {
    this.dragMode = TryDisconnection;
  }

  /**
   * @param {Piece} piece
   * @param {number} dx
   * @param {number} dy
   * @see {@link Piece#dragShouldDisconnect}
   */
  dragShouldDisconnect(piece: Piece, dx: number, dy: number) {
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
  export(options: { compact?: boolean } = {}): PuzzleDump {
    return {
      pieceRadius: this.pieceRadius,
      proximity: this.proximity,
      pieces: this.pieces.map((it) => it.export(options)),
    };
  }

  /**
   * @param {PuzzleDump} dump
   * @returns {Puzzle}
   */
  static import(dump: PuzzleDump): Puzzle {
    const puzzle = new Puzzle({
      pieceRadius:
        typeof dump.pieceRadius === 'number' || 'radius' in dump.pieceRadius
          ? dump.pieceRadius
          : 2, // default value
      proximity: dump.proximity,
    });
    puzzle.addPieces(dump.pieces.map((it) => Piece.import(it)));
    puzzle.autoconnect();
    return puzzle;
  }
}

export default Puzzle;
