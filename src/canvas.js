const Pair = require('./pair');
const Piece = require('./piece');
const Puzzle = require('./puzzle');
const Manufacturer = require('../src/manufacturer');
const {twoAndTwo} = require('./sequence');
const Structure = require('./structure');
const ImageMetadata = require('./image-metadata');
const {vector, ...Vector} = require('./vector');
const Metadata = require('./metadata');
const SpatialMetadata = require('./spatial-metadata');
const {PuzzleValidator, PieceValidator} = require('./validator');
const {Horizontal, Vertical} = require('./axis');
const Shuffler = require('./shuffler');
const {diameter} = require('./size');
const {itself} = require('./prelude');
const {Classic} = require('./outline');

/**
 * @typedef {object} Shape
 * @typedef {object} Group
 * @typedef {object} Label
 */

/**
 * @typedef {object} Figure
 * @property {Shape} shape
 * @property {Group} group
 * @property {Label} [label]
 */

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
 * @typedef {object} LabelMetadata
 * @property {string} [text]
 * @property {number} [fontSize]
 * @property {number} [x]
 * @property {number} [y]
 */

/**
 * @typedef {object} CanvasMetadata
 * @property {string} [id]
 * @property {import('./vector').Vector} [targetPosition]
 * @property {import('./vector').Vector} [currentPosition]
 * @property {string} [color]
 * @property {boolean} [fixed]
 * @property {string} [strokeColor]
 * @property {import('./image-metadata').ImageLike} [image]
 * @property {LabelMetadata} [label]
 */

/**
 * @typedef {object} Template
 * @property {import('./structure').StructureLike} structure
 * @property {import('./size').Size} [size]
 * @property {CanvasMetadata} metadata
 */

 /**
  * An HTML graphical area where puzzles and pieces can be rendered. No assumption of the rendering backend is done - it may be
  * and be a plain HTML SVG or canvas element, or a higher-level library - and this task is fully delegated to {@link Painter}
  */
class Canvas {

  /**
   * @private
   * @typedef {import('./painter')} Painter
   */

  /**
   * @param {string} id  the html id of the element where to place the canvas
   * @param {object} options
   * @param {number} options.width
   * @param {number} options.height
   * @param {import('./vector').Vector|number} [options.pieceSize] the piece size expresed as it edge-to-edge diameter
   * @param {number} [options.proximity]
   * @param {import('./vector').Vector|number} [options.borderFill] the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
   * @param {number} [options.strokeWidth]
   * @param {string} [options.strokeColor]
   * @param {number} [options.lineSoftness] how soft the line will be
   * @param {boolean} [options.preventOffstageDrag] whether dragging out of canvas is prevented
   * @param {import('./image-metadata').ImageLike} [options.image] an optional background image for the puzzle that will be split across all pieces.
   * @param {boolean} [options.fixed] whether the canvas can is fixed or can be dragged
   * @param {Painter} [options.painter] the Painter object used to actually draw figures in canvas
   * @param {import('./vector').Vector|number} [options.puzzleDiameter] the puzzle diameter used to calculate the maximal width and height
   *                                                                    You only need to specify this option when pieces are manually sketched and images must be adjusted
   * @param {import('./vector').Vector|number} [options.maxPiecesCount] the maximal amount of pieces used to calculate the maximal width and height.
   *                                                                    You only need to specify this option when pieces are manually sketched and images must be adjusted
   * @param {import('./outline').Outline} [options.outline]
   */
  constructor(id, {
      width,
      height,
      pieceSize = 50,
      proximity = 10,
      borderFill = 0,
      strokeWidth = 3,
      strokeColor = 'black',
      lineSoftness = 0,
      preventOffstageDrag = false,
      image = null,
      fixed = false,
      painter = null,
      puzzleDiameter = null,
      maxPiecesCount = null,
      outline = null
    }) {
    this.width = width;
    this.height = height;
    this.pieceSize = diameter(pieceSize);
    this.borderFill = Vector.cast(borderFill);
    this.imageMetadata = ImageMetadata.asImageMetadata(image);
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.lineSoftness = lineSoftness;
    this.preventOffstageDrag = preventOffstageDrag;
    this.proximity = proximity;
    this.fixed = fixed;
    /** @type {Painter} */
    this._painter = painter || new window['headbreaker']['painters']['Konva']();
    this._initialize();
    this._painter.initialize(this, id);
    /** @type {import('./vector').Vector} */
    this._maxPiecesCount = Vector.cast(maxPiecesCount);
    /** @type {import('./vector').Vector} */
    this._puzzleDiameter = Vector.cast(puzzleDiameter);
    /** @type {(image: import('./image-metadata').ImageMetadata) => import('./image-metadata').ImageMetadata} */
    this._imageAdjuster = itself;
    this._outline = outline || Classic;
    this._drawn = false;
  }

  _initialize() {
    /** @type {Puzzle} */
    this._puzzle = null;
    /** @type {Object<string, Figure>} */
    this.figures = {};
    /** @type {Object<string, Template>} */
    this.templates = {};
    /** @type {import('./vector').Vector} */
    this._figurePadding = null;
  }

  /**
   * Creates and renders a piece using a template, that is ready to be rendered by calling {@link Canvas#draw}
   *
   * @param {Template} options
   */
  sketchPiece({structure, size = null, metadata}) {
    SpatialMetadata.initialize(metadata, Vector.zero())
    this.renderPiece(this._newPiece(structure, size, metadata));
  }

  /**
   * Renders a previously created piece object
   *
   * @param {Piece} piece
   */
  renderPiece(piece) {
    /** @type {Figure} */
    const figure = {label: null, group: null, shape: null};
    this.figures[piece.metadata.id] = figure;

    this._painter.sketch(this, piece, figure, this._outline);

    /** @type {LabelMetadata} */
    const label = piece.metadata.label;
    if (label && label.text) {
      label.fontSize = label.fontSize || piece.diameter.y * 0.55;
      label.y = label.y || (piece.diameter.y - label.fontSize) / 2;
      this._painter.label(this, piece, figure);
    }

    this._bindGroupToPiece(figure.group, piece);
    this._bindPieceToGroup(piece, figure.group);
  }

  /**
   * Renders many previously created piece objects
   *
   * @param {Piece[]} pieces
   */
  renderPieces(pieces) {
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
  renderPuzzle(puzzle) {
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
   * @param {import('./sequence').InsertsGenerator} [options.insertsGenerator]
   * @param {CanvasMetadata[]} [options.metadata] optional list of metadata that will be attached to each generated piece
   */
  autogenerate({horizontalPiecesCount = 5, verticalPiecesCount = 5, insertsGenerator = twoAndTwo, metadata = []} = {}) {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(horizontalPiecesCount, verticalPiecesCount);
    manufacturer.withInsertsGenerator(insertsGenerator);
    manufacturer.withMetadata(metadata);
    this.autogenerateWithManufacturer(manufacturer);
  }

  /**
   * @param {Manufacturer} manufacturer
   */
  autogenerateWithManufacturer(manufacturer) {
    manufacturer.withStructure(this.settings);
    this._puzzle = manufacturer.build();
    this._maxPiecesCount = vector(manufacturer.width, manufacturer.height);
    this.renderPieces(this.puzzle.pieces);
  }

  /**
   * Creates a name piece template, that can be later instantiated using {@link Canvas#sketchPieceUsingTemplate}
   *
   * @param {string} name
   * @param {Template} template
   */
  defineTemplate(name, template) {
    this.templates[name] = template;
  }

  /**
   * Creates a new Piece with given id using a named template
   * defined with {@link Canvas#defineTemplate}
   *
   * @param {string} id
   * @param {string} templateName
   */
  sketchPieceUsingTemplate(id, templateName) {
    const options = this.templates[templateName];
    if (!options) {
      throw new Error(`Unknown template ${id}`);
    }
    const metadata = Metadata.copy(options.metadata);
    metadata.id = id;
    this.sketchPiece({structure: options.structure, metadata: metadata})
  }

  /**
   * @param {number} farness from 0 to 1, how far pieces will be placed from x = pieceDiameter.x, y = pieceDiameter.y
   */
  shuffle(farness = 1) {
    const offset = this.pieceRadio;
    this.puzzle.shuffle(farness * (this.width - offset.x), farness * (this.height - offset.y))
    this.puzzle.translate(offset.x, offset.y);
    this.autoconnected = true;
  }

  /**
   * **Warning**: this method requires {@code maxPiecesCount} to be set.
   *
   * @param {number} farness
   */
  shuffleColumns(farness = 1) {
    this.shuffleWith(farness, Shuffler.columns);
  }

  /**
   * **Warning**: this method requires {@code maxPiecesCount} to be set.
   *
   * @param {number} farness
   */
  shuffleGrid(farness = 1) {
    this.shuffleWith(farness, Shuffler.grid);
  }

  /**
   * **Warning**: this method requires {@code maxPiecesCount} to be set.
   * **Warning**: this method requires puzzle to have an even number of columns
   *
   * @param {number} farness
   */
  shuffleLine(farness = 1) {
    this.shuffleWith(farness, Shuffler.line);
  }


  /**
   * @param {number} farness
   * @param {import('./shuffler').Shuffler} shuffler
   */
  shuffleWith(farness, shuffler) {
    this.solve();
    this.puzzle.shuffleWith(Shuffler.padder(this.proximity * 3, this.maxPiecesCount.x, this.maxPiecesCount.y));
    this.puzzle.shuffleWith(shuffler)
    this.puzzle.shuffleWith(Shuffler.noise(Vector.cast(this.proximity * farness / 2)))
    this.autoconnected = true;
  }

  solve() {
    this.puzzle.pieces.forEach(it => {
      const {x, y} = it.metadata.targetPosition;
      it.relocateTo(x, y);
    });
    this.autoconnect();
  }

  autoconnect() {
    this.puzzle.autoconnect();
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
  registerKeyboardGestures(gestures = {
    16: (puzzle) => puzzle.forceConnectionWhileDragging(),
    17: (puzzle) => puzzle.forceDisconnectionWhileDragging()
  }) {
    this._painter.registerKeyboardGestures(this, gestures);
  }

  /**
   * Draws this canvas for the first time
   */
  draw() {
    if (this._drawn) {
      throw new Error("This canvas has already been drawn. Call redraw instead");
    }

    if (!this.autoconnected) {
      this.autoconnect();
    }
    this.puzzle.updateValidity();
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
    this.puzzle.pieces.forEach(piece => {
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
   * Sets a validator for the canvas' puzzle. Only one validator
   * can be attached, so subsequent calls of this method will override the previously
   * attached validator
   *
   * @param {import('./validator').Validator} validator
   */
  attachValidator(validator) {
    this.puzzle.attachValidator(validator);
  }

  /**
   * Sets a validator that will report when puzzle has been solved,
   * overriding any previously configured validator
   */
  attachSolvedValidator() {
    this.puzzle.attachValidator(new PuzzleValidator(SpatialMetadata.solved));
  }

  /**
   * Sets a validator that will report when puzzle pieces are in their expected relative
   * positions, overriding any previously configured validator
   */
  attachRelativePositionValidator() {
    this.puzzle.attachValidator(new PuzzleValidator(SpatialMetadata.relativePosition));
  }

  /**
   * Sets a validator that will report when puzzle are at the expected given
   * relative refs
   *
   * @param {[number, number][]} expected
   */
  attachRelativeRefsValidator(expected) {
    this.puzzle.attachValidator(new PuzzleValidator(PuzzleValidator.relativeRefs(expected)));
  }

  /**
   * Sets a validator that will report when puzzle pieces are in their expected absolute
   * positions, overriding any previously configured validator
   */
  attachAbsolutePositionValidator() {
    this.puzzle.attachValidator(new PieceValidator(SpatialMetadata.absolutePosition));
  }

  /**
   * Registers a listener for connect events
   *
   * @param {CanvasConnectionListener} f
   */
  onConnect(f) {
    this.puzzle.onConnect((piece, target) => {
      f(piece, this.getFigure(piece), target, this.getFigure(target));
    });
  }

  /**
   * Registers a listener for disconnect events
   *
   * @param {CanvasConnectionListener} f
   */
  onDisconnect(f) {
    this.puzzle.onDisconnect((piece, target) => {
      f(piece, this.getFigure(piece), target, this.getFigure(target));
    });
  }

  /**
   * @param {CanvasTranslationListener} f
   */
  onTranslate(f) {
    this.puzzle.onTranslate((piece, dx, dy) => {
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
    if (!this.fixed) throw new Error("Only fixed canvas can be reframed")

    this.puzzle.reframe(
      this.figurePadding,
      Vector.minus(vector(this.width, this.height), this.figurePadding));
  }

  /**
   * @param {import('./validator').ValidationListener} f
   */
  onValid(f) {
    this.puzzle.onValid(f);
  }

  /**
   * Returns the current validation status
   *
   * @type {boolean}
   */
  get valid() {
    return this.puzzle.valid;
  }

  /**
   * Answers the visual representation for the given piece.
   * This method uses piece's id.
   *
   * @param {Piece} piece
   * @returns {Figure}
   */
  getFigure(piece) {
    return this.getFigureById(piece.metadata.id);
  }

  /**
   * Answers the visual representation for the given piece id.
   *
   * @param {string} id
   * @returns {Figure}
   */
  getFigureById(id) {
    return this.figures[id];
  }

  /**
   * Sets the new width and height of the canvas
   *
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    this._painter.resize(this, width, height);
  }

  /**
   * Scales the canvas contents to the given factor
   * @param {import('./vector').Vector|number} factor
   */
  scale(factor) {
    this._painter.scale(this, Vector.cast(factor));
  }

  /**
   * @param {Piece} piece
   */
  _annotatePiecePosition(piece) {
    const p = piece.centralAnchor.asVector();
    SpatialMetadata.initialize(piece.metadata, p, Vector.copy(p));
  }

  /**
   * Configures updates from piece into group
   * @param {Group} group
   * @param {Piece} piece
   */
  _bindGroupToPiece(group, piece) {
    piece.onTranslate((_dx, _dy) => {
      this._painter.physicalTranslate(this, group, piece);
      this._painter.logicalTranslate(this, piece, group);
    });
  }

  /**
   * * Configures updates from group into piece
   * @param {Piece} piece
   * @param {Group} group
   */
  _bindPieceToGroup(piece, group) {
    this._painter.onDrag(this, piece, group, (dx, dy) => {
      if (!Pair.isNull(dx, dy)) {
        piece.drag(dx, dy, true);
        this._painter.logicalTranslate(this, piece, group);
        this.redraw();
      }
    });
    this._painter.onDragEnd(this, piece, group, () => {
      piece.drop();
      this.puzzle.validate();
      this.redraw();
    })
  }

  /**
   * @param {Piece} piece
   * @returns {import('./image-metadata').ImageMetadata}
   */
  _baseImageMetadataFor(piece) {
    if (this.imageMetadata) {
      const scale = piece.metadata.scale || this.imageMetadata.scale || 1;
      const offset = Vector.plus(
        piece.metadata.targetPosition || Vector.zero(),
        this.imageMetadata.offset || Vector.zero());
      return { content: this.imageMetadata.content, offset, scale };
    } else {
      return ImageMetadata.asImageMetadata(piece.metadata.image);
    }
  }

  /**
   * @param {Piece} piece
   *
   * @returns {import('./image-metadata').ImageMetadata}
   */
  imageMetadataFor(piece) {
    return this._imageAdjuster(this._baseImageMetadataFor(piece));
  }

  /**
   * Configures canvas to adjust images axis to puzzle's axis.
   *
   * **Warning**: this method requires {@code maxPiecesCount} or {@code puzzleDiameter} to be set.
   *
   * @param {import('./axis').Axis} axis
   */
  adjustImagesToPuzzle(axis) {
    this._imageAdjuster = (image) => {
      const scale = axis.atVector(this.puzzleDiameter) / axis.atDimension(image.content);
      const offset = Vector.plus(image.offset, Vector.minus(this.borderFill, this.pieceDiameter));
      return { content: image.content, scale, offset };
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
   * @param {import('./axis').Axis} axis
   */
  adjustImagesToPiece(axis) {
    this._imageAdjuster = (image) => {
      const scale = axis.atVector(this.pieceDiameter) / axis.atDimension(image.content);
      const offset = Vector.plus(image.offset, this.borderFill);
      return { content: image.content, scale, offset };
    }
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
   * @param {import('./structure').StructureLike} structureLike the piece structure
   * @param {import('./size').Size} size
   * @param {CanvasMetadata} metadata
   */
  _newPiece(structureLike, size, metadata) {
    let piece = this.puzzle.newPiece(
      Structure.asStructure(structureLike),
      { centralAnchor: vector(metadata.currentPosition.x, metadata.currentPosition.y), metadata, size });
    return piece;
  }

  /**
   * The puzzle diameter, using the
   * configured puzzle diameter or the estimated one, if the first is not available.
   *
   * @type {import('./vector').Vector}
   * */
  get puzzleDiameter() {
    return this._puzzleDiameter || this.estimatedPuzzleDiameter;
  }

  /**
   * The estimated puzzle diameter calculated using the the max pieces count.
   *
   * @type {import('./vector').Vector}
   * */
  get estimatedPuzzleDiameter() {
    return Vector.plus(Vector.multiply(this.pieceDiameter, this.maxPiecesCount), this.strokeWidth * 2)
  }

  get maxPiecesCount() {
    if (!this._maxPiecesCount) {
      throw new Error("max pieces count was not specified");
    }
    return this._maxPiecesCount;
  }

  /**
   * @type {import('./vector').Vector}
   */
  get pieceRadio() {
    return this.pieceSize.radio;
  }

  /**
   * @type {import('./vector').Vector}
   */
  get pieceDiameter() {
    return this.pieceSize.diameter;
  }

  /**
   * @type {import('./vector').Vector}
   */
  get figurePadding() {
    if (!this._figurePadding) {
      this._figurePadding = Vector.plus(this.strokeWidth, this.borderFill);
    }
    return this._figurePadding;
  }

  /**
   * @type {Number}
   **/
  get figuresCount() {
    return Object.values(this.figures).length;
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
   * @type {import('./puzzle').Settings}
   */
  get settings() {
    return {pieceRadio: this.pieceRadio, proximity: this.proximity}
  }
}

module.exports = Canvas
