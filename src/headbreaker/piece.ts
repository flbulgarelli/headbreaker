import structure, { Structure } from './structure';
import { Orthogonal } from './prelude';
import { anchor, Anchor } from './anchor';
import { Insert, None } from './insert';
import { Connector } from './connector';
import { itself, orthogonalTransform } from './prelude';
import { Vector } from './vector';
import { Size } from './size';

import Puzzle from './puzzle';

export type TranslationListener = (
  piece: Piece,
  dx: number,
  dy: number
) => void;

export type ConnectionListener = (piece: Piece, target: Piece) => void;

export interface PieceConfig {
  centralAnchor?: Vector;
  size?: Size;
  metadata?: any;
}

export interface PieceDump {
  centralAnchor?: Vector;
  size?: Size;
  metadata: any;
  connections?: Orthogonal<object>;
  structure: string;
}

/**
 * A jigsaw piece
 */
export default class Piece {
  up: Insert;
  down: Insert;
  left: Insert;
  right: Insert;
  metadata: any;
  centralAnchor?: Anchor;
  _size?: Size;
  _horizontalConnector?: Connector;
  _verticalConnector?: Connector;

  translateListeners?: TranslationListener[];
  connectListeners?: ConnectionListener[];
  disconnectListeners?: ConnectionListener[];
  puzzle?: Puzzle;
  rightConnection?: Piece;
  downConnection?: Piece;
  leftConnection?: Piece;
  upConnection?: Piece;

  /**
   * @param {Structure} [structure]
   * @param {PieceConfig} [config]
   */
  constructor(
    { up = None, down = None, left = None, right = None }: Structure = {},
    config: PieceConfig = {}
  ) {
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
    /** @type {any} */
    this.metadata = {};
    /** @type {Anchor} */
    this.centralAnchor = undefined;
    /** @type {Size} */
    this._size = undefined;

    /**
     * @private
     * @type {Connector}
     **/
    this._horizontalConnector = undefined;
    /**
     * @private
     * @type {Connector}
     **/
    this._verticalConnector = undefined;

    this._initializeListeners();
    this.configure(config);
  }

  _initializeListeners() {
    /** @type {TranslationListener[]} */
    this.translateListeners = [];
    /** @type {ConnectionListener[]} */
    this.connectListeners = [];
    /** @type {ConnectionListener[]} */
    this.disconnectListeners = [];
  }

  /**
   * Runs positining, sizing and metadata configurations
   * in a single step
   *
   * @param {PieceConfig} config
   */
  configure(config: PieceConfig) {
    if (config.centralAnchor) {
      this.centerAround(Anchor.import(config.centralAnchor));
    }

    if (config.metadata) {
      this.annotate(config.metadata);
    }

    if (config.size) {
      this.resize(config.size);
    }
  }

  /**
   * Adds unestructured user-defined metadata on this piece.
   *
   * @param {object} metadata
   */
  annotate(metadata?: object) {
    Object.assign(this.metadata, metadata);
  }

  /**
   * Sets unestructured user-defined metadata on this piece.
   *
   * This object has no strong requirement, but it is recommended to have an
   * id property.
   *
   * @param {object} metadata
   */
  reannotate(metadata: object) {
    this.metadata = metadata;
  }

  /**
   * @param {import('./puzzle')} puzzle
   */
  belongTo(puzzle: Puzzle) {
    this.puzzle = puzzle;
  }

  /**
   * @type {Piece[]}
   */
  get presentConnections() {
    return this.connections.filter(itself);
  }

  /**
   * @type {Piece[]}
   */
  get connections(): Piece[] {
    return [
      this.rightConnection,
      this.downConnection,
      this.leftConnection,
      this.upConnection,
    ].filter((connection): connection is Piece => connection !== undefined);
  }

  /**
   * @type {import('./insert').Insert[]}
   */
  get inserts() {
    return [this.right, this.down, this.left, this.up];
  }

  /**
   * @param {TranslationListener} f the callback
   */
  onTranslate(f: TranslationListener) {
    this.translateListeners?.push(f);
  }

  /**
   * @param {ConnectionListener} f the callback
   */
  onConnect(f: ConnectionListener) {
    this.connectListeners?.push(f);
  }

  /**
   * @param {ConnectionListener} f the callback
   */
  onDisconnect(f: ConnectionListener) {
    this.disconnectListeners?.push(f);
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  fireTranslate(dx: number, dy: number) {
    this.translateListeners?.forEach((it) => it(this, dx, dy));
  }

  /**
   * @param {Piece} other
   */
  fireConnect(other: Piece) {
    this.connectListeners?.forEach((it) => it(this, other));
  }

  /**
   * @param {Piece[]} others
   */
  fireDisconnect(others: Piece[]) {
    others.forEach((other) => {
      this.disconnectListeners?.forEach((it) => it(this, other));
    });
  }

  /**
   *
   * @param {Piece} other
   * @param {boolean} [back]
   */
  connectVerticallyWith(other: Piece, back: boolean = false) {
    this.verticalConnector.connectWith(this, other, this.proximity ?? 0, back);
  }

  /**
   * @param {Piece} other
   */
  attractVertically(other: Piece, back = false) {
    this.verticalConnector.attract(this, other, back);
  }

  /**
   * @param {Piece} other
   * @param {boolean} [back]
   */
  connectHorizontallyWith(other: Piece, back: boolean = false) {
    this.horizontalConnector.connectWith(
      this,
      other,
      this.proximity ?? 0,
      back
    );
  }

  /**
   * @param {Piece} other
   */
  attractHorizontally(other: Piece, back = false) {
    this.horizontalConnector.attract(this, other, back);
  }

  /**
   * @param {Piece} other
   * @param {boolean} [back]
   */
  tryConnectWith(other: Piece, back: boolean = false) {
    this.tryConnectHorizontallyWith(other, back);
    this.tryConnectVerticallyWith(other, back);
  }

  /**
   *
   * @param {Piece} other
   * @param {boolean} [back]
   */
  tryConnectHorizontallyWith(other: Piece, back: boolean = false) {
    if (this.canConnectHorizontallyWith(other)) {
      this.connectHorizontallyWith(other, back);
    }
  }
  /**
   *
   * @param {Piece} other
   * @param {boolean} [back]
   */
  tryConnectVerticallyWith(other: Piece, back: boolean = false) {
    if (this.canConnectVerticallyWith(other)) {
      this.connectVerticallyWith(other, back);
    }
  }

  disconnect() {
    if (!this.connected) {
      return;
    }
    const connections = this.presentConnections;

    if (this.upConnection) {
      this.upConnection.downConnection = undefined;
      /** @type {Piece} */
      this.upConnection = undefined;
    }

    if (this.downConnection) {
      this.downConnection.upConnection = undefined;
      this.downConnection = undefined;
    }

    if (this.leftConnection) {
      this.leftConnection.rightConnection = undefined;
      /** @type {Piece} */
      this.leftConnection = undefined;
    }

    if (this.rightConnection) {
      this.rightConnection.leftConnection = undefined;
      this.rightConnection = undefined;
    }

    this.fireDisconnect(connections);
  }

  /**
   * Sets the centralAnchor for this piece.
   *
   * @param {Anchor} anchor
   */
  centerAround(anchor: Anchor) {
    if (this.centralAnchor) {
      throw new Error(
        'this pieces has already being centered. Use recenterAround instead'
      );
    }
    this.centralAnchor = anchor;
  }

  /**
   * Sets the initial position of this piece. This method is similar to {@link Piece#centerAround},
   * but takes a pair instead of an anchor.
   *
   * @param {number} x
   * @param {number} y
   */
  locateAt(x: number, y: number) {
    this.centerAround(anchor(x, y));
  }

  /**
   * Tells whether this piece central anchor is at given point
   *
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  isAt(x: number, y: number): boolean {
    return this.centralAnchor ? this.centralAnchor.isAt(x, y) : false;
  }

  /**
   * Moves this piece to the given position, firing translation events.
   * Piece must be already centered.
   *
   * @param {Anchor} anchor the new central anchor
   * @param {boolean} [quiet] indicates whether events should be suppressed
   */
  recenterAround(anchor: Anchor, quiet: boolean = false) {
    if (!this.centralAnchor) {
      throw new Error('Central anchor is not defined');
    }
    const [dx, dy] = anchor.diff(this.centralAnchor);
    this.translate(dx, dy, quiet);
  }

  /**
   * Moves this piece to the given position, firing translation events.
   * Piece must be already centered. This method is similar to {@link Piece#recenterAround},
   * but takes a pair instead of an anchor.
   *
   * @param {number} x the final x position
   * @param {number} y the final y position
   * @param {boolean} [quiet] indicates whether events should be suppressed
   */
  relocateTo(x: number, y: number, quiet: boolean = false) {
    this.recenterAround(anchor(x, y), quiet);
  }

  /**
   * Move this piece a given distance, firing translation events
   *
   * @param {number} dx the x distance
   * @param {number} dy the y distance
   * @param {boolean} [quiet] indicates whether events should be suppressed
   */
  translate(dx: number, dy: number, quiet: boolean = false) {
    if (dx !== undefined && dy !== undefined) {
      this.centralAnchor?.translate(dx, dy);
      if (!quiet) {
        this.fireTranslate(dx, dy);
      }
    }
  }

  /**
   *
   * @param {number} dx
   * @param {number} dy
   * @param {boolean} [quiet]
   * @param {Piece[]} [pushedPieces]
   */
  push(
    dx: number,
    dy: number,
    quiet: boolean = false,
    pushedPieces: Piece[] = []
  ) {
    this.translate(dx, dy, quiet);

    const stationaries = this.presentConnections.filter(
      (it) => pushedPieces.indexOf(it) === -1
    );
    pushedPieces.push(...stationaries);
    stationaries.forEach((it) => it.push(dx, dy, false, pushedPieces));
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  drag(dx: number, dy: number, quiet = false) {
    if (dx === undefined || dy === undefined) return;

    if (this.dragShouldDisconnect(dx, dy)) {
      this.disconnect();
      this.translate(dx, dy, quiet);
    } else {
      this.push(dx, dy, quiet);
    }
  }

  /**
   * Whether this piece should get disconnected
   * while dragging on the given direction, according to
   * its puzzle's drag mode.
   *
   * @param {number} dx
   * @param {number} dy
   *
   * @see {@link Puzzle#dragShouldDisconnect}
   **/
  dragShouldDisconnect(dx: number, dy: number) {
    return this.puzzle?.dragShouldDisconnect(this, dx, dy);
  }

  drop() {
    this.puzzle?.autoconnectWith(this);
  }

  dragAndDrop(dx: number, dy: number) {
    this.drag(dx, dy);
    this.drop();
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  canConnectHorizontallyWith(other: Piece): boolean {
    return this.horizontalConnector.canConnectWith(
      this,
      other,
      this.proximity ?? 0
    );
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  canConnectVerticallyWith(other: Piece): boolean {
    return this.verticalConnector.canConnectWith(
      this,
      other,
      this.proximity ?? 0
    );
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  verticallyCloseTo(other: Piece): boolean {
    return this.verticalConnector.closeTo(this, other, this.proximity ?? 0);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  horizontallyCloseTo(other: Piece): boolean {
    return this.horizontalConnector.closeTo(this, other, this.proximity ?? 0);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  verticallyMatch(other: Piece): boolean {
    return this.verticalConnector.match(this, other);
  }

  /**
   *
   * @param {Piece} other
   * @returns {boolean}
   */
  horizontallyMatch(other: Piece): boolean {
    return this.horizontalConnector.match(this, other);
  }

  get connected(): boolean {
    return !!(
      this.upConnection ||
      this.downConnection ||
      this.leftConnection ||
      this.rightConnection
    );
  }

  /**
   *@type {Anchor}
   */
  get downAnchor() {
    return this.centralAnchor!.translated(0, this.radius?.y ?? 0);
  }

  /**
   *@type {Anchor}
   */
  get rightAnchor() {
    return this.centralAnchor?.translated(this.radius?.x ?? 0, 0);
  }

  /**
   *@type {Anchor}
   */
  get upAnchor() {
    return this.centralAnchor?.translated(0, -(this.radius?.y ?? 0));
  }

  /**
   *@type {Anchor}
   */
  get leftAnchor() {
    return this.centralAnchor?.translated(-(this.radius?.x ?? 0), 0);
  }

  /**
   * Defines this piece's own dimension, overriding puzzle's
   * default dimension
   *
   * @param {Size} size
   */
  resize(size: Size) {
    this._size = size;
  }

  /**
   * @type {Vector}
   */
  get radius() {
    return this.size?.radius;
  }

  /**
   * The double of the radius
   *
   * @type {Vector}
   */
  get diameter() {
    return this.size?.diameter;
  }

  get size() {
    return this._size || this.puzzle?.pieceSize;
  }

  /**
   * @type {number}
   */
  get proximity() {
    return this.puzzle?.proximity;
  }

  /**
   * This piece id. It is extracted from metadata
   *
   * @type {string}
   */
  get id() {
    return this.metadata.id;
  }

  /**
   * @returns {Connector}
   */
  get horizontalConnector(): Connector {
    return this.getConnector('horizontal');
  }

  /**
   * @returns {Connector}
   */
  get verticalConnector(): Connector {
    return this.getConnector('vertical');
  }

  /**
   * Retrieves the requested connector, initializing it if necessary.
   *
   * @param {"vertical" | "horizontal"} kind - The type of connector to retrieve.
   * @returns {Connector} - The requested connector.
   */

  getConnector(kind: 'vertical' | 'horizontal'): Connector {
    const connectorKey = `_${kind}Connector` as keyof this; // Type assertion for the key
    const puzzleConnectorKey = `${kind}Connector`; // Key for the connector in puzzle

    // If the puzzle has the connector and it's not cached locally, return the puzzle's version
    if (this.puzzle && !this[connectorKey]) {
      return this.puzzle[
        puzzleConnectorKey as keyof typeof this.puzzle
      ] as Connector;
    }

    // If not cached, create and store the connector
    if (!this[connectorKey]) {
      this[connectorKey] = Connector[kind]() as any; // Type assertion to bypass error
    }

    return this[connectorKey] as Connector; // Type assertion to ensure it's treated as a Connector
  }

  /**
   * Converts this piece into a plain, stringify-ready object.
   * Connections should have ids
   *
   * @param {object} options
   * @param {boolean} [options.compact]
   * @returns {PieceDump}
   */
  export({ compact = false }: { compact?: boolean } = {}): PieceDump {
    const base = {
      centralAnchor: this.centralAnchor && this.centralAnchor.export(),
      structure: structure.serialize(this),
      metadata: this.metadata,
    } as {
      centralAnchor: Vector | undefined;
      structure: string;
      metadata: any;
      size?: Size;
    };

    if (this._size) {
      base.size = this._size;
    }

    return compact
      ? base
      : Object.assign(base, {
          connections: orthogonalTransform(this.connections, (it) => ({
            id: it.id,
          })),
        });
  }

  /**
   * Converts this piece back from a dump. Connections are not restored. {@link Puzzle#autoconnect} method should be used
   * after importing all them
   *
   * @param {PieceDump} dump
   * @returns {Piece}
   */
  static import(dump: PieceDump): Piece {
    return new Piece(structure.deserialize(dump.structure), {
      centralAnchor: dump.centralAnchor,
      metadata: dump.metadata,
      size: dump.size,
    });
  }
}
