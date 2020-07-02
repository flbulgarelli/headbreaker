const Vector = require('./vector');
const Piece = require('./piece');
const Puzzle = require('./puzzle');
const Manufacturer = require('../src/manufacturer');
const {anchor} = require('./anchor');
const {twoAndTwo} = require('./sequence');
const Structure = require('./structure');
const imageLike = require('./image-metadata');
const position = require('./position');
const Metadata = require('./metadata');

/**
 * An interface for a a rendering backend
 * for puzzle's canvas
 *
 * @interface Painter
 */
function Painter() {}
/**
 * @param {Canvas} canvas
 * @param {string} id
 */
Painter.prototype.initialize = (canvas, id) => {};
/**
 * Recreates the canvas
 *
 * @param {Canvas} canvas
 */
Painter.prototype.reinitialize = (canvas) => {};
/**
 * @param {Canvas} canvas
 */
Painter.prototype.draw = (canvas) => {};
/**
 * @param {Canvas} canvas
 * @param {Piece} piece
 * @param {Figure} figure
 */
Painter.prototype.sketch = (canvas, piece, figure) => {};
/**
 * @param {Canvas} canvas
 * @param {Piece} piece
 * @param {Figure} figure
 */
Painter.prototype.label = (canvas, piece, figure) => {};
/**
 * @param {Canvas} canvas
 * @param {Group} group
 * @param {Piece} piece
 */
Painter.prototype.physicalTranslate = (canvas, group, piece) => {};
/**
 * @param {Canvas} canvas
 * @param {Piece} piece
 * @param {Group} group
 */
Painter.prototype.logicalTranslate = (canvas, piece, group) => {};
/**
 * @param {Canvas} canvas
 * @param {Piece} piece
 * @param {Group} group
 * @param {VectorAction} f
 *
 * @callback VectorAction
 * @param {number} dx
 * @param {number} dy
 */
Painter.prototype.onDrag = (canvas, piece, group, f) => {};
/**
 * @param {Canvas} canvas
 * @param {Piece} piece
 * @param {Group} group
 * @param {Action} f
 *
 * @callback Action
 */
Painter.prototype.onDragEnd = (canvas, piece, group, f) => {};

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
class Canvas {

  /**
   * @param {string} id  the html id of the element where to place the canvas
   * @param {object} options
   * @param {number} options.width
   * @param {number} options.height
   * @param {number} [options.pieceSize]
   * @param {number} [options.proximity]
   * @param {number} [options.borderFill] the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
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
    this.pieceSize = pieceSize;
    this.borderFill = borderFill;
    this.imageMetadata = imageLike.asImageMetadata(image);
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
    metadata.targetPosition = metadata.targetPosition || position.null();
    metadata.currentPosition = metadata.currentPosition || metadata.targetPosition;
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
      label.fontSize = label.fontSize || this.pieceSize * 0.55;
      label.y = label.y || (this.pieceSize - label.fontSize) / 2;
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
   * overrides this canvas' {@link Canvas#pieceSize} and {@link Canvas#proximity}
   *
   * @param {Puzzle} puzzle
   */
  renderPuzzle(puzzle) {
    this.pieceSize = puzzle.pieceSize * 2;
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
    this.renderPieces(this._puzzle.pieces);
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
    const metadata = Metadata.clone(options.metadata);
    metadata.id = id;
    this.sketchPiece({structure: options.structure, metadata: metadata})
  }

  /**
   * @param {number} farness from 0 to 1, how far pieces will be placed from x = pieceSize, y = pieceSize
   */
  shuffle(farness = 1) {
    const offset = this.pieceSize;
    this.puzzle.shuffle(farness * (this.width - offset), farness * (this.height - offset))
    this.puzzle.translate(offset, offset);
    this.autconnected = true;
  }

  /**
   * Draws this canvas for the first time
   */
  draw() {
    if (!this.autconnected) {
      this.autconnected = true;
      this.puzzle.autoconnect();
    }
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
   * @param {Piece} piece
   */
  _annotatePiecePosition(piece) {
    const p = position(piece.centralAnchor.x, piece.centralAnchor.y);
    piece.metadata.targetPosition = p;
    piece.metadata.currentPosition = p;
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
      if (!Vector.isNull(dx, dy)) {
        piece.drag(dx, dy, true);
        this._painter.logicalTranslate(this, piece, group);
        this.redraw();
      }
    });
    this._painter.onDragEnd(this, piece, group, () => {
      piece.drop();
      this.redraw();
    })
  }

  /**
   * @param {Piece} model
   * @returns {import('./image-metadata').ImageMetadata}
   */
  _imageMetadataFor(model) {
    if (this.imageMetadata) {
      return {
        content: this.imageMetadata.content,
        offset: model.metadata.targetPosition || this.imageMetadata.offset,
        scale: model.metadata.scale || this.imageMetadata.scale
      };
    } else {
      return imageLike.asImageMetadata(model.metadata.image);
    }
  }

  _initializeEmptyPuzzle() {
    this._puzzle = new Puzzle(this.settings);
  }

  /**
   *
   * @param {import('./structure').StructureLike} structureLike
   * @param {CanvasMetadata} metadata
   */
  _newPiece(structureLike, metadata) {
    let piece = this.puzzle.newPiece(Structure.asStructure(structureLike));
    piece.annotate(metadata);
    piece.placeAt(anchor(metadata.currentPosition.x, metadata.currentPosition.y));
    return piece;
  }

  get puzzle() {
    if (!this._puzzle) {
      this._initializeEmptyPuzzle();
    }
    return this._puzzle;
  }

  /**
   * @returns {import('./puzzle').Settings}
   */
  get settings() {
    return {pieceSize: this.pieceSize / 2, proximity: this.proximity}
  }

}

Canvas.Painter = Painter;

/**
 * An HTML graphical area where puzzles and pieces can be rendered. No assumption of the rendering backend is done - it may be
 * and be a plain HTML SVG or canvas element, or a higher-level library - and this task is fully delegated to {@link Painter}
 * @module Canvas
 */
module.exports = Canvas
