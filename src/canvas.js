const Pair = require('./pair');
const Piece = require('./piece');
const Puzzle = require('./puzzle');
const Manufacturer = require('../src/manufacturer');
const {twoAndTwo} = require('./sequence');
const Structure = require('./structure');
const ImageMetadata = require('./image-metadata');
const {position, ...Position} = require('./position');
const Metadata = require('./metadata');
const SpatialMetadata = require('./spatial-metadata');
const {PuzzleValidator, PieceValidator} = require('./validator');

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
 * @property {import('./position').Position} [targetPosition]
 * @property {import('./position').Position} [currentPosition]
 * @property {string} [color]
 * @property {string} [strokeColor]
 * @property {import('./image-metadata').ImageLike} [image]
 * @property {LabelMetadata} [label]
 */

/**
  * @typedef {object} Template
 * @property {import('./structure').StructureLike} structure
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
   * @param {import('./position').Position|number} [options.pieceSize]
   * @param {number} [options.proximity]
   * @param {import('./position').Position|number} [options.borderFill] the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
   * @param {number} [options.strokeWidth]
   * @param {string} [options.strokeColor]
   * @param {number} [options.lineSoftness] how soft the line will be
   * @param {import('./image-metadata').ImageLike} [options.image] an optional background image for the puzzle that will be split across all pieces.
   * @param {Painter} [options.painter] the Painter object used to actually draw figures in canvas
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
      image = null,
      painter = null }) {
    this.width = width;
    this.height = height;
    this.pieceDiameter = Position.cast(pieceSize);
    this.borderFill = Position.cast(borderFill);
    this.imageMetadata = ImageMetadata.asImageMetadata(image);
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.lineSoftness = lineSoftness;
    this.proximity = proximity;
    /** @type {Painter} */
    this._painter = painter || new window['headbreaker']['painters']['Konva']();
    this._initialize();
    this._painter.initialize(this, id);
  }

  _initialize() {
    /** @type {Puzzle} */
    this._puzzle = null;
    /** @type {Object<string, Figure>} */
    this.figures = {};
    /** @type {Object<string, Template>} */
    this.templates = {};
  }

  /**
   * Creates and renders a piece using a template, that is ready to be rendered by calling {@link Canvas#draw}
   *
   * @param {Template} options
   */
  sketchPiece({structure, metadata}) {
    SpatialMetadata.initialize(metadata, Position.origin())
    this.renderPiece(this._newPiece(structure, metadata));
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

    this._painter.sketch(this, piece, figure);

    /** @type {LabelMetadata} */
    const label = piece.metadata.label;
    if (label && label.text) {
      label.fontSize = label.fontSize || this.pieceDiameter.y * 0.55;
      label.y = label.y || (this.pieceDiameter.y - label.fontSize) / 2;
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
    this.pieceDiameter = puzzle.pieceDiameter;
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
    manufacturer.withDimmensions(horizontalPiecesCount, verticalPiecesCount);
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
   * Draws this canvas for the first time
   */
  draw() {
    if (!this.autoconnected) {
      this.autoconnect();
    }
    this.puzzle.updateValidity();
    this.autoconnected = false;
    this.redraw();
  }

  /**
   * Re-draws this canvas. This method is useful when the canvas {@link Figure}s have
   * being modified and you need changes to become visible
   */
  redraw() {
    this._painter.draw(this);
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
   * @param {Piece} piece
   */
  _annotatePiecePosition(piece) {
    const p = piece.centralAnchor.asPosition();
    SpatialMetadata.initialize(piece.metadata, p, Position.copy(p));
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
  _imageMetadataFor(piece) {
    if (this.imageMetadata) {
      return {
        content: this.imageMetadata.content,
        offset: piece.metadata.targetPosition || this.imageMetadata.offset,
        scale: piece.metadata.scale || this.imageMetadata.scale
      };
    } else {
      return ImageMetadata.asImageMetadata(piece.metadata.image);
    }
  }

  _initializeEmptyPuzzle() {
    this._puzzle = new Puzzle(this.settings);
  }

  /**
   * @param {import('./structure').StructureLike} structureLike
   * @param {CanvasMetadata} metadata
   */
  _newPiece(structureLike, metadata) {
    let piece = this.puzzle.newPiece(Structure.asStructure(structureLike));
    piece.annotate(metadata);
    piece.locateAt(metadata.currentPosition.x, metadata.currentPosition.y);
    return piece;
  }

  /**
   * @type {import('./position').Position}
   */
  get pieceRadio() {
    return Position.multiply(this.pieceDiameter, 0.5)
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
