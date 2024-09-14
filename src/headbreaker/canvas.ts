import pair from './pair';
import Piece from './piece';
import Puzzle from './puzzle';
import Manufacturer from './manufacturer';
import { InsertsGenerator, twoAndTwo } from './sequence';
import structure, { StructureLike } from './structure';
import vector, { Vector } from './vector';
import Metadata from './metadata';
import SpatialMetadata from './spatial-metadata';
import { PuzzleValidator, PieceValidator } from './validator';
import { Axis, Horizontal, Vertical } from './axis';
import Shuffler from './shuffler';
import { diameter, Size } from './size';
import { itself } from './prelude';
import { Classic, Outline } from './outline';
import Painter from './painter';
import { ConnectionRequirement } from './connector';
import asImageMetadata, { ImageLike, ImageMetadata } from './image-metadata';
import { Layer } from 'konva/lib/Layer';
import Konva from 'konva';

declare global {
  interface Window {
    headbreaker: Headbreaker;
  }
}

export interface Figure {
  shape?: Konva.Shape;
  group?: Konva.Group;
  label?: Konva.Label;
}

export interface LabelMetadata {
  text?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  x?: number;
  y?: number;
}

export interface CanvasMetadata {
  id?: string;
  targetPosition?: Vector;
  currentPosition?: Vector;
  color?: string;
  fixed?: boolean;
  strokeColor?: string;
  image?: ImageLike;
  label?: LabelMetadata;
}

export interface Template {
  structure: StructureLike;
  size: Size;
  metadata: CanvasMetadata;
}

export interface Painters {
  Konva: new () => Painter;
}

export interface Headbreaker {
  painters: Painters;
}

export interface CanvasConnectionListener {
  (
    piece: Piece,
    figure: Figure,
    targetPiece: Piece,
    targetFigure: Figure
  ): void;
}

export interface CanvasTranslationListener {
  (piece: Piece, figure: Figure, dx: number, dy: number): void;
}

/**
 * @callback CanvasConnectionListener
 * @param {Piece} piece the connecting piece
 * @param {Figure} figure the visual representation of the connecting piece
 * @param {Piece} targetPiece the target connected piece
 * @param {Figure} targetFigure the visual representation of the target connected
 */

/**
 * @callback CanvasTranslationListener
 * @param {Piece} piece the translated piece
 * @param {Figure} figure the visual representation of the translated piece
 * @param {number} dx the horizontal displacement
 * @param {number} dy the vertical displacement
 */

/**
 * An HTML graphical area where puzzles and pieces can be rendered. No assumption of the rendering backend is done - it may be
 * and be a plain HTML SVG or canvas element, or a higher-level library - and this task is fully delegated to {@link Painter}
 */
class Canvas {
  /**
   * @private
   */
  // type Painter = import('./painter');
  private _painter: Painter;
  width: number;
  height: number;
  pieceSize: Size;
  borderFill: Vector;
  imageMetadata: ImageMetadata | undefined;
  strokeWidth: number;
  strokeColor: string;
  lineSoftness: number;
  preventOffstageDrag: boolean;
  proximity: number;
  fixed: boolean;
  _maxPiecesCount: Vector;
  _puzzleDiameter: Vector;
  _imageAdjuster: (image: ImageMetadata) => ImageMetadata;
  _outline: Outline;
  _puzzle?: Puzzle;
  figures: { [key: string]: Figure } | undefined;
  templates: { [key: string]: Template } = {};
  _figurePadding: Vector | undefined;
  _drawn: boolean | undefined;
  autoconnected: boolean | undefined;
  __konvaLayer__: Layer | undefined;
  __nullLayer__: { drawn: boolean; figures: number } | undefined;

  /**
   * @param {string} id  the html id of the element where to place the canvas
   * @param {object} options
   * @param {number} options.width
   * @param {number} options.height
   * @param {Vector|number} [options.pieceSize] the piece size expresed as it edge-to-edge diameter
   * @param {number} [options.proximity]
   * @param {Vector|number} [options.borderFill] the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
   * @param {number} [options.strokeWidth]
   * @param {string} [options.strokeColor]
   * @param {number} [options.lineSoftness] how soft the line will be
   * @param {boolean} [options.preventOffstageDrag] whether dragging out of canvas is prevented
   * @param {ImageLike} [options.image] an optional background image for the puzzle that will be split across all pieces.
   * @param {boolean} [options.fixed] whether the canvas can is fixed or can be dragged
   * @param {Painter} [options.painter] the Painter object used to actually draw figures in canvas
   * @param {Vector|number} [options.puzzleDiameter] the puzzle diameter used to calculate the maximal width and height
   *                                                                    You only need to specify this option when pieces are manually sketched and images must be adjusted
   * @param {Vector|number} [options.maxPiecesCount] the maximal amount of pieces used to calculate the maximal width and height.
   *                                                                    You only need to specify this option when pieces are manually sketched and images must be adjusted
   * @param {Outline} [options.outline]
   */
  constructor(
    id: string,
    {
      width,
      height,
      pieceSize = 50,
      proximity = 10,
      borderFill = 0,
      strokeWidth = 3,
      strokeColor = 'black',
      lineSoftness = 0,
      preventOffstageDrag = false,
      image = undefined,
      fixed = false,
      painter = undefined,
      puzzleDiameter = undefined,
      maxPiecesCount = undefined,
      outline = undefined,
    }: {
      width: number;
      height: number;
      pieceSize?: Vector | number;
      proximity?: number;
      borderFill?: Vector | number;
      strokeWidth?: number;
      strokeColor?: string;
      lineSoftness?: number;
      preventOffstageDrag?: boolean;
      image?: ImageLike;
      fixed?: boolean;
      painter?: Painter;
      puzzleDiameter?: Vector | number;
      maxPiecesCount?: Vector | number;
      outline?: Outline;
    }
  ) {
    this.width = width;
    this.height = height;
    this.pieceSize = diameter(pieceSize);
    this.borderFill = vector.cast(borderFill);
    this.imageMetadata = image ? asImageMetadata(image) : undefined;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.lineSoftness = lineSoftness;
    this.preventOffstageDrag = preventOffstageDrag;
    this.proximity = proximity;
    this.fixed = fixed;
    /** @type {Painter} */
    this._painter = painter || new window.headbreaker.painters.Konva();
    this._initialize();
    this._painter.initialize(this, id);
    /** @type {Vector} */
    this._maxPiecesCount = vector.cast(maxPiecesCount || vector.zero());
    /** @type {Vector} */
    this._puzzleDiameter = vector.cast(puzzleDiameter || vector.zero());
    /** @type {(image: ImageMetadata) => ImageMetadata} */
    this._imageAdjuster = itself;
    this._outline = outline || Classic;
  }

  _initialize() {
    /** @type {Puzzle} */
    this._puzzle = undefined;
    /** @type {Object<string, Figure>} */
    this.figures = {};
    /** @type {Object<string, Template>} */
    this.templates = {};
    /** @type {Vector} */
    this._figurePadding = undefined;
    this._drawn = false;
  }

  getPainter() {
    return this._painter;
  }

  /**
   * Creates and renders a piece using a template, that is ready to be rendered by calling {@link Canvas#draw}
   *
   * @param {Template} options
   */
  sketchPiece({ structure, size, metadata }: Template) {
    SpatialMetadata.initialize(metadata, vector.zero(), vector.zero());
    const piece = this._newPiece(structure, size, metadata);
    if (piece) {
      this.renderPiece(piece);
    } else {
      throw new Error('Failed to create a new piece');
    }
  }

  /**
   * Renders a previously created piece object
   *
   * @param {Piece} piece
   */
  renderPiece(piece: Piece) {
    /** @type {Figure} */
    const figure: Figure = {
      label: undefined,
      group: undefined,
      shape: undefined,
    };
    if (!this.figures) {
      this.figures = {};
    }
    this.figures[piece.metadata.id] = figure;

    this._painter.sketch(this, piece, figure, this._outline);

    /** @type {LabelMetadata} */
    const label: LabelMetadata = piece.metadata.label;
    if (label && label.text) {
      label.fontSize =
        label.fontSize || (piece.diameter ? piece.diameter.y * 0.55 : 0);
      label.y =
        label.y ||
        (piece.diameter ? (piece.diameter.y - label.fontSize) / 2 : 0);
      this._painter.label(this, piece, figure);
    }

    if (figure.group) {
      this._bindGroupToPiece(figure.group, piece);
      this._bindPieceToGroup(piece, figure.group);
    }
  }

  /**
   * Renders many previously created piece objects
   *
   * @param {Piece[]} pieces
   */
  renderPieces(pieces: Piece[]) {
    pieces.forEach((it) => {
      this._annotatePiecePosition(it);
      this.renderPiece(it);
    });
  }

  /**
   * Renders a previously created puzzle object. This method
   * overrides this canvas' {@link Canvas#pieceDiameter} and {@link Canvas#proximity}
   *
   * @param {Puzzle} puzzle
   */
  renderPuzzle(puzzle: Puzzle) {
    this.pieceSize = puzzle.pieceSize;
    this.proximity = puzzle.proximity * 2;
    this._puzzle = puzzle;
    this.renderPieces(puzzle.pieces);
  }

  /**
   * Automatically creates and renders pieces given some configuration paramters
   *
   * @param {object} options
   * @param {number} [options.horizontalPiecesCount]
   * @param {number} [options.verticalPiecesCount]
   * @param {InsertsGenerator} [options.insertsGenerator]
   * @param {CanvasMetadata[]} [options.metadata] optional list of metadata that will be attached to each generated piece
   */
  autogenerate({
    horizontalPiecesCount = 5,
    verticalPiecesCount = 5,
    insertsGenerator = twoAndTwo,
    metadata = [],
  }: {
    horizontalPiecesCount?: number;
    verticalPiecesCount?: number;
    insertsGenerator?: InsertsGenerator;
    metadata?: CanvasMetadata[];
  } = {}) {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(horizontalPiecesCount, verticalPiecesCount);
    manufacturer.withInsertsGenerator(insertsGenerator);
    manufacturer.withMetadata(metadata);
    this.autogenerateWithManufacturer(manufacturer);
  }

  /**
   * @param {Manufacturer} manufacturer
   */
  autogenerateWithManufacturer(manufacturer: Manufacturer) {
    manufacturer.withStructure(this.settings);
    this._puzzle = manufacturer.build();
    this._maxPiecesCount = vector(manufacturer.width, manufacturer.height);
    if (this.puzzle) {
      this.renderPieces(this.puzzle.pieces);
    }
  }

  /**
   * Creates a name piece template, that can be later instantiated using {@link Canvas#sketchPieceUsingTemplate}
   *
   * @param {string} name
   * @param {Template} template
   */
  defineTemplate(name: string, template: Template) {
    if (!this.templates) {
      this.templates = {};
    }
    this.templates[name] = template;
  }

  /**
   * Creates a new Piece with given id using a named template
   * defined with {@link Canvas#defineTemplate}
   *
   * @param {string} id
   * @param {string} templateName
   */
  sketchPieceUsingTemplate(id: string, templateName: string) {
    const options = this.templates[templateName];
    if (!options) {
      throw new Error(`Unknown template ${id}`);
    }
    const metadata = Metadata.copy(options.metadata);
    metadata.id = id;
    this.sketchPiece({
      structure: options.structure,
      size: options.size,
      metadata: metadata,
    });
  }

  /**
   * @param {number} farness from 0 to 1, how far pieces will be placed from x = pieceDiameter.x, y = pieceDiameter.y
   */
  shuffle(farness: number = 1) {
    const offset = this.pieceRadius;
    this.puzzle?.shuffle(
      farness * (this.width - offset.x),
      farness * (this.height - offset.y)
    );
    this.puzzle?.translate(offset.x, offset.y);
    this.autoconnected = true;
  }

  /**
   * **Warning**: this method requires {@code maxPiecesCount} to be set.
   *
   * @param {number} farness
   */
  shuffleColumns(farness: number = 1) {
    this.shuffleWith(farness, Shuffler.columns);
  }

  /**
   * **Warning**: this method requires {@code maxPiecesCount} to be set.
   *
   * @param {number} farness
   */
  shuffleGrid(farness: number = 1) {
    this.shuffleWith(farness, Shuffler.grid);
  }

  /**
   * **Warning**: this method requires {@code maxPiecesCount} to be set.
   * **Warning**: this method requires puzzle to have an even number of columns
   *
   * @param {number} farness
   */
  shuffleLine(farness: number = 1) {
    this.shuffleWith(farness, Shuffler.line);
  }

  /**
   * @param {number} farness
   * @param {import('./shuffler').Shuffler} shuffler
   */
  shuffleWith(farness: number, shuffler: import('./shuffler').Shuffler) {
    this.solve();
    this.puzzle?.shuffleWith(
      Shuffler.padder(
        this.proximity * 3,
        this.maxPiecesCount.x,
        this.maxPiecesCount.y
      )
    );
    this.puzzle?.shuffleWith(shuffler);
    this.puzzle?.shuffleWith(
      Shuffler.noise(vector.cast((this.proximity * farness) / 2))
    );
    this.autoconnected = true;
  }

  solve() {
    this.puzzle?.pieces.forEach((it) => {
      const { x, y } = it.metadata.targetPosition;
      it.relocateTo(x, y);
    });
    this.autoconnect();
  }

  autoconnect() {
    this.puzzle?.autoconnect();
    this.autoconnected = true;
  }

  /**
   * Registers keyboard gestures. `gestures` must be an object with one or more entries with the following format:
   *
   * ```
   * { keyStrokeNumber: (puzzle) => ...change drag mode... }
   * ```
   *
   * For example, if you want to configure your canvas to force pieces to be moved together using the `alt` key, you can do the following:
   *
   * ```
   * canvas.registerKeyboardGestures({ 18: (puzzle) => puzzle.forceConnectionWhileDragging() })
   * ```
   *
   * If no gestures are given, then the following gestures are configured:
   *
   * - `16` (`shift`): drags blocks of pieces as a whole, regardless of the movement direction
   * - `17` (`ctrl`): drags pieces individually, regardless of the movement direction
   *
   *
   * @param {object} gestures
   */
  registerKeyboardGestures(
    gestures: Record<number, (puzzle: Puzzle) => void> = {
      16: (puzzle: Puzzle) => puzzle.forceConnectionWhileDragging(),
      17: (puzzle: Puzzle) => puzzle.forceDisconnectionWhileDragging(),
    }
  ) {
    this._painter.registerKeyboardGestures(this, gestures);
  }

  /**
   * Draws this canvas for the first time
   */
  draw() {
    if (this._drawn) {
      throw new Error(
        'This canvas has already been drawn. Call redraw instead'
      );
    }

    if (!this.autoconnected) {
      this.autoconnect();
    }
    this.puzzle?.updateValidity();
    this.autoconnected = false;
    this.redraw();

    this._drawn = true;
  }

  /**
   * Re-draws this canvas. This method is useful when the canvas {@link Figure}s have
   * being modified and you need changes to become visible
   */
  redraw() {
    this._painter.draw(this);
  }

  /**
   * Refreshes image metadata.
   *
   * Use this method in order adjuster updates and image changes after initial draw
   * to make effect.
   **/
  refill() {
    this.puzzle?.pieces.forEach((piece) => {
      this._painter.fill(this, piece, this.getFigure(piece));
    });
  }

  /**
   * Clears the canvas, clearing the rendering backend and discarding all the created templates, figures, and pieces
   */
  clear() {
    this._initialize();
    this._painter.reinitialize(this);
  }

  /**
   * Attaches a connection requirement function that will be used to check whether
   * two close and matching pieces can be actually connected. By default no connection
   * requirement is imposed which means that any close and matching pieces will be
   * connected.
   *
   * @param {ConnectionRequirement} requirement
   */
  attachConnectionRequirement(requirement: ConnectionRequirement) {
    this.puzzle?.attachConnectionRequirement(requirement);
  }

  /**
   * Removes the connection requirement, if any.
   */
  clearConnectionRequirements() {
    this.puzzle?.clearConnectionRequirements();
  }

  /**
   * Sets a validator for the canvas' puzzle. Only one validator
   * can be attached, so subsequent calls of this method will override the previously
   * attached validator
   *
   * @param {import('./validator').Validator} validator
   */
  attachValidator(validator: import('./validator').Validator) {
    this.puzzle?.attachValidator(validator);
  }

  /**
   * Sets a validator that will report when puzzle has been solved,
   * overriding any previously configured validator
   */
  attachSolvedValidator() {
    this.puzzle?.attachValidator(new PuzzleValidator(SpatialMetadata.solved));
  }

  /**
   * Sets a validator that will report when puzzle pieces are in their expected relative
   * positions, overriding any previously configured validator
   */
  attachRelativePositionValidator() {
    this.puzzle?.attachValidator(
      new PuzzleValidator(SpatialMetadata.relativePosition)
    );
  }

  /**
   * Sets a validator that will report when puzzle are at the expected given
   * relative refs
   *
   * @param {[number, number][]} expected
   */
  attachRelativeRefsValidator(expected: [number, number][]) {
    this.puzzle?.attachValidator(
      new PuzzleValidator(PuzzleValidator.relativeRefs(expected))
    );
  }

  /**
   * Sets a validator that will report when puzzle pieces are in their expected absolute
   * positions, overriding any previously configured validator
   */
  attachAbsolutePositionValidator() {
    this.puzzle?.attachValidator(
      new PieceValidator(SpatialMetadata.absolutePosition)
    );
  }

  /**
   * Registers a listener for connect events
   *
   * @param {CanvasConnectionListener} f
   */
  onConnect(f: CanvasConnectionListener) {
    this.puzzle?.onConnect((piece, target) => {
      f(piece, this.getFigure(piece), target, this.getFigure(target));
    });
  }

  /**
   * Registers a listener for disconnect events
   *
   * @param {CanvasConnectionListener} f
   */
  onDisconnect(f: CanvasConnectionListener) {
    this.puzzle?.onDisconnect((piece, target) => {
      f(piece, this.getFigure(piece), target, this.getFigure(target));
    });
  }

  /**
   * @param {CanvasTranslationListener} f
   */
  onTranslate(f: CanvasTranslationListener) {
    this.puzzle?.onTranslate((piece, dx, dy) => {
      f(piece, this.getFigure(piece), dx, dy);
    });
  }

  /**
   * Translates all the pieces - preserving their relative positions - so that
   * they all can be visible, if possible. If they are already fully visible,
   * this method does nothing.
   *
   * In order to prevent unexpected translations, this method will fail
   * if canvas is not `fixed`.
   */
  reframeWithinDimensions() {
    if (!this.fixed) throw new Error('Only fixed canvas can be reframed');

    const padding = this.figurePadding || vector.zero();

    this.puzzle?.reframe(
      padding,
      vector.minus(vector(this.width, this.height), padding)
    );
  }

  /**
   * @param {import('./validator').ValidationListener} f
   */
  onValid(f: import('./validator').ValidationListener) {
    this.puzzle?.onValid(f);
  }

  /**
   * Returns the current validation status
   *
   * @type {boolean}
   */
  get valid() {
    return this.puzzle?.valid;
  }

  /**
   * Answers the visual representation for the given piece.
   * This method uses piece's id.
   *
   * @param {Piece} piece
   * @returns {Figure}
   */
  getFigure(piece: Piece): Figure {
    return this.getFigureById(piece.metadata.id);
  }

  /**
   * Answers the visual representation for the given piece id.
   *
   * @param {string} id
   * @returns {Figure}
   */
  getFigureById(id: string): Figure {
    return this.figures?.[id] ?? {};
  }

  /**
   * Sets the new width and height of the canvas
   *
   * @param {number} width
   * @param {number} height
   */
  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this._painter.resize(this, width, height);
  }

  /**
   * Scales the canvas contents to the given factor
   * @param {Vector|number} factor
   */
  scale(factor: Vector | number) {
    this._painter.scale(this, vector.cast(factor));
  }

  /**
   * @param {Piece} piece
   */
  _annotatePiecePosition(piece: Piece) {
    const p = piece.centralAnchor
      ? piece.centralAnchor.asVector()
      : vector.zero();
    SpatialMetadata.initialize(piece.metadata, p, vector.copy(p));
  }

  /**
   * Configures updates from piece into group
   * @param {Konva.Group} group
   * @param {Piece} piece
   */
  _bindGroupToPiece(group: Konva.Group, piece: Piece) {
    piece.onTranslate((_dx, _dy) => {
      this._painter.physicalTranslate(this, group, piece);
      this._painter.logicalTranslate(this, piece, group);
    });
  }

  /**
   * * Configures updates from group into piece
   * @param {Piece} piece
   * @param {Konva.Group} group
   */
  _bindPieceToGroup(piece: Piece, group: Konva.Group) {
    this._painter.onDrag(this, piece, group, (dx, dy) => {
      if (!pair.isNull(dx, dy)) {
        piece.drag(dx, dy, true);
        this._painter.logicalTranslate(this, piece, group);
        this.redraw();
      }
    });
    this._painter.onDragEnd(this, piece, group, () => {
      piece.drop();
      this.puzzle?.validate();
      this.redraw();
    });
  }

  /**
   * @param {Piece} piece
   * @returns {ImageMetadata}
   */
  _baseImageMetadataFor(piece: Piece): ImageMetadata {
    if (this.imageMetadata) {
      const scale = piece.metadata.scale || this.imageMetadata.scale || 1;
      const offset = vector.plus(
        piece.metadata.targetPosition || vector.zero(),
        this.imageMetadata.offset || vector.zero()
      );
      return {
        id: this.imageMetadata.id,
        content: this.imageMetadata.content,
        offset,
        scale,
      };
    } else {
      return asImageMetadata(piece.metadata.image);
    }
  }

  /**
   * @param {Piece} piece
   *
   * @returns {ImageMetadata}
   */
  imageMetadataFor(piece: Piece): ImageMetadata {
    return this._imageAdjuster(this._baseImageMetadataFor(piece));
  }

  /**
   * Configures canvas to adjust images axis to puzzle's axis.
   *
   * **Warning**: this method requires {@code maxPiecesCount} or {@code puzzleDiameter} to be set.
   *
   * @param {Axis} axis
   */
  adjustImagesToPuzzle(axis: Axis) {
    this._imageAdjuster = (image: ImageMetadata) => {
      const scale =
        axis.atVector(this.puzzleDiameter) / axis.atDimension(image.content);
      const offset = vector.plus(
        image.offset,
        vector.minus(this.borderFill, this.pieceDiameter)
      );
      return { id: image.id, content: image.content, scale, offset };
    };
  }

  /**
   * Configures canvas to adjust images width to puzzle's width
   *
   * **Warning**: this method requires {@code maxPiecesCount} or {@code puzzleDiameter} to be set.
   */
  adjustImagesToPuzzleWidth() {
    this.adjustImagesToPuzzle(Horizontal);
  }

  /**
   * Configures canvas to adjust images height to puzzle's height
   *
   * **Warning**: this method requires {@code maxPiecesCount} or {@code puzzleDiameter} to be set.
   */
  adjustImagesToPuzzleHeight() {
    this.adjustImagesToPuzzle(Vertical);
  }

  /**
   * Configures canvas to adjust images axis to pieces's axis
   *
   * **Warning**: this method requires {@code maxPiecesCount} or {@code puzzleDiameter} to be set.
   *
   * @param {Axis} axis
   */
  adjustImagesToPiece(axis: Axis) {
    this._imageAdjuster = (image: ImageMetadata) => {
      const scale =
        axis.atVector(this.pieceDiameter) / axis.atDimension(image.content);
      const offset = vector.plus(image.offset, this.borderFill);
      return { id: image.id, content: image.content, scale, offset };
    };
  }

  /**
   * Configures canvas to adjust images width to pieces's width
   *
   * **Warning**: this method requires {@code maxPiecesCount} or {@code puzzleDiameter} to be set.
   */
  adjustImagesToPieceWidth() {
    this.adjustImagesToPiece(Horizontal);
  }

  /**
   * Configures canvas to adjust images height to pieces's height
   *
   * **Warning**: this method requires {@code maxPiecesCount} or {@code puzzleDiameter} to be set.
   */
  adjustImagesToPieceHeight() {
    this.adjustImagesToPiece(Vertical);
  }

  _initializeEmptyPuzzle() {
    this._puzzle = new Puzzle(this.settings);
  }

  /**
   * @param {StructureLike} structureLike the piece structure
   * @param {Size} size
   * @param {CanvasMetadata} metadata
   */
  _newPiece(
    structureLike: StructureLike,
    size: Size,
    metadata: CanvasMetadata
  ) {
    let piece = this.puzzle?.newPiece(structure.asStructure(structureLike), {
      centralAnchor: vector(
        metadata.currentPosition?.x ?? 0,
        metadata.currentPosition?.y ?? 0
      ),
      metadata,
      size,
    });
    return piece;
  }

  /**
   * The puzzle diameter, using the
   * configured puzzle diameter or the estimated one, if the first is not available.
   *
   * @type {Vector}
   * */
  get puzzleDiameter() {
    return this._puzzleDiameter || this.estimatedPuzzleDiameter;
  }

  /**
   * The estimated puzzle diameter calculated using the the max pieces count.
   *
   * @type {Vector}
   * */
  get estimatedPuzzleDiameter() {
    return vector.plus(
      vector.multiply(this.pieceDiameter, this.maxPiecesCount),
      this.strokeWidth * 2
    );
  }

  get maxPiecesCount() {
    if (!this._maxPiecesCount) {
      throw new Error('max pieces count was not specified');
    }
    return this._maxPiecesCount;
  }

  /**
   * @type {Vector}
   */
  get pieceRadius() {
    return this.pieceSize.radius;
  }

  /**
   * @type {Vector}
   */
  get pieceDiameter() {
    return this.pieceSize.diameter;
  }

  /**
   * @type {Vector}
   */
  get figurePadding() {
    if (!this._figurePadding) {
      this._figurePadding = vector.plus(this.strokeWidth, this.borderFill);
    }
    return this._figurePadding;
  }

  /**
   * @type {Number}
   **/
  get figuresCount() {
    return this.figures ? Object.values(this.figures).length : 0;
  }

  /**
   * The puzzle rendered by this canvas
   *
   * @type {Puzzle}
   */
  get puzzle() {
    if (!this._puzzle) {
      this._initializeEmptyPuzzle();
    }
    return this._puzzle;
  }

  /**
   * @type {Settings}
   */
  get settings() {
    return { pieceRadius: this.pieceRadius.x, proximity: this.proximity };
  }
}

export default Canvas;
