const vector = require('./vector');
const {Puzzle, Piece} = require('./puzzle');
const {parse} = require('./structure');
const Manufacturer = require('../src/manufacturer');
const {anchor} = require('./anchor');
const {twoAndTwo} = require('./sequence');

/**
 * @typedef {object} Painter
 * @property {(canvas: PuzzleCanvas, id: string) => void} initialize
 * @property {(canvas: PuzzleCanvas) => void} draw
 * @property {(canvas: PuzzleCanvas, piece: Piece, figure: Figure) => void} sketch
 * @property {(canvas: PuzzleCanvas, piece: Piece, figure: Figure) => void} label
 * @property {(canvas: PuzzleCanvas, group: Group, piece: Piece) => void} physicalTranslate
 * @property {(canvas: PuzzleCanvas, piece: Piece, group: Group) => void} logicalTranslate
 * @property {(canvas: PuzzleCanvas, piece: Piece, group: Group, f:(dx: number, dy: number) => void) => void} onDrag
 * @property {(canvas: PuzzleCanvas, piece: Piece, group: Group, f:() => void) => void} onDragEnd
 *
 * @typedef {object} Position
 * @property {number} x
 * @property {number} y
 *
 * @typedef {object} Shape
 * @typedef {object} Group
 * @typedef {object} Label
 *
 * @typedef {object} Figure
 * @property {Shape} shape
 * @property {Group} group
 * @property {Label} [label]
 *
 * @typedef {(piece: Piece, figure: Figure, targetPiece: Piece, targetFigure: Figure) => void} CanvasConnectionListener
 * @typedef {(piece: Piece, figure: Figure, dx: number, dy: number) => void} CanvasTranslationListener
 *
 * @typedef {import('./../src/structure').Structure|string} StructureLike
 *
 * @typedef {object} LabelData
 * @property {string} [text]
 * @property {number} [fontSize]
 *
 * @typedef {object} CanvasData
 * @property {string} [id]
 * @property {Position} [targetPosition]
 * @property {Position} [currentPosition]
 * @property {Position} [imageOffset]
 * @property {string} [color]
 * @property {Image} [image]
 * @property {string} [strokeColor]
 * @property {LabelData} [label]
 *
 * @typedef {object} Template
 * @property {StructureLike} structure
 * @property {CanvasData} data
 */
class PuzzleCanvas {

  /**
   * @param {string} id  the html id of the element where to place the canvas
   * @param {object} options
   * @param {number} options.width
   * @param {number} options.height
   * @param {number} options.pieceSize
   * @param {number} options.proximity
   * @param {number} options.borderFill the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
   * @param {number} [options.strokeWidth]
   * @param {string} [options.strokeColor]
   * @param {number} [options.lineSoftness] how soft the line will be
   * @param {Image}  [options.image] an optional background image for the puzzle that will be split across all pieces.
   * @param {Painter} [options.painter] the Painter object used to actually draw figures in canvas
   *
   */
  constructor(id, {
      width,
      height,
      pieceSize,
      proximity,
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
    this.image = image;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.lineSoftness = lineSoftness;
    this.proximity = proximity;
    /** @type {Painter} */
    this._painter = painter || new window['headbreaker']['painters']['Konva']();
    this._painter.initialize(this, id);
    /** @type {Object<string, Figure>} */
    this.figures = {};
    /** @type {Object<string, Template>} */
    this.templates = {};
  }

  /**
   * @param {Template} options
   */
  withPiece({structure, data}) {
    data.targetPosition = data.targetPosition || { x: 0, y: 0 };
    data.currentPosition = data.currentPosition || data.targetPosition;
    this._renderPiece(this._newPiece(structure, data));
  }

  /**
   * @param {object} options
   * @param {number} [options.horizontalPiecesCount]
   * @param {number} [options.verticalPiecesCount]
   * @param {import('./sequence').InsertsGenerator} [options.insertsGenerator]
   * @param {CanvasData[]} [options.data]
   */
  withPuzzle({horizontalPiecesCount = 5, verticalPiecesCount = 5, insertsGenerator = twoAndTwo, data = []}) {
    const manufacturer = new Manufacturer();
    manufacturer.withDimmensions(horizontalPiecesCount, verticalPiecesCount);
    manufacturer.withInsertsGenerator(insertsGenerator);
    this.withManufacturer(manufacturer, data);
  }

  /**
   * @param {Manufacturer} manufacturer
   * @param {CanvasData[]} [data]
   */
  withManufacturer(manufacturer, data = []) {
    manufacturer.withStructure(this.settings);

    this._puzzle = manufacturer.build();
    this._puzzle.pieces.forEach((it, index) => {
      const position = { x: it.centralAnchor.x, y: it.centralAnchor.y }
      it.carry({targetPosition: position, currentPosition: position, id: index + 1});
      this._renderPiece(it);
    });
  }

  /**
   * Creates a name piece template, that can be later instantiated using withPieceFromTemplate
   *
   * @param {string} name
   * @param {Template} template
   */
  withTemplate(name, template) {
    this.templates[name] = template;
  }

  /**
   * Creates a new Piece with given id using a named template
   *
   * @param {string} id
   * @param {string} templateName
   */
  withPieceFromTemplate(id, templateName) {
    const options = this.templates[templateName];
    if (!options) {
      throw new Error(`Unknown template ${id}`);
    }
    const data = Object.assign({}, options.data);
    data.id = id;
    this.withPiece({structure: options.structure, data: data})
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

  draw() {
    if (!this.autconnected) {
      this.autconnected = true;
      this.puzzle.autoconnect();
    }
    this.redraw();
  }

  redraw() {
    this._painter.draw(this);
  }

  /**
   * @param {CanvasConnectionListener} f
   */
  onConnect(f) {
    this.puzzle.onConnect((piece, target) => {
      f(piece, this.getFigure(piece), target, this.getFigure(target));
    });
  }

  /**
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
   * @param {Piece} piece
   * @returns {Figure}
   */
  getFigure(piece) {
    return this.figures[piece.data.id];
  }

  /**
   * @param {Piece} piece
   */
  _renderPiece(piece) {
    /** @type {Figure} */
    const figure = {label: null, group: null, shape: null};
    this.figures[piece.data.id] = figure;

    this._painter.sketch(this, piece, figure);

    const label = piece.data.label;
    if (label && label.text) {
      label.fontSize = label.fontSize || this.pieceSize * 0.55;
      label.y = label.y || (this.pieceSize - label.fontSize) / 2;
      this._painter.label(this, piece, figure);
    }

    this._bindGroupToPiece(figure.group, piece);
    this._bindPieceToGroup(piece, figure.group);
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
      if (!vector.isNull(dx, dy)) {
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
   * @returns {Position}
   */
  _imageOffsetFor(model) {
    if (this.image) {
      return model.data.targetPosition;
    } else {
      return model.data.imageOffset;
    }
  }

  _initializeEmptyPuzzle() {
    this._puzzle = new Puzzle(this.settings);
  }


  /**
   *
   * @param {StructureLike} structure
   * @param {*} data
   */
  _newPiece(structure, data) {
    if (typeof(structure) === 'string') {
      structure = parse(structure);
    }
    let piece = this.puzzle.newPiece(structure);
    piece.carry(data);
    piece.placeAt(anchor(data.currentPosition.x, data.currentPosition.y));
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

/**
 * An HTML graphical area where puzzles and pieces can be rendered. No assumption of the rendering backend is done - it may be
 * and be a plain HTML SVG or canvas element, or a higher-level library - and this task is fully delegated to `Painter`
 * @module PuzzleCanvas
 */
module.exports = PuzzleCanvas
