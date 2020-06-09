const Konva = require('konva');
const vector = require('./vector');
const outline = require('./outline');
const {Puzzle, Piece} = require('./puzzle');
const Manufacturer = require('../src/manufacturer');
const {anchor} = require('./anchor');
const {twoAndTwo} = require('./sequence');

/**
 *
 * @param {Piece} model
 * @param {*} group
 */
function commitCurrentPosition(model, group) {
  model.data.currentPosition.x = group.x();
  model.data.currentPosition.y = group.y();
}

/**
 * @param {Piece} model
 * @param {*} group
 */
function currentPositionDiff(model, group) {
  return vector.diff(group.x(),group.y(), model.data.currentPosition.x, model.data.currentPosition.y);
}

/**
 * @typedef {{x: number, y: number}} Position
 */
class PuzzleCanvas {

  /**
   * @param {string} id  the kanvas layer id
   * @param {object} options
   * @param {number} options.width
   * @param {number} options.height
   * @param {number} options.pieceSize
   * @param {number} options.proximity
   * @param {number} options.borderFill the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
   * @param {number?} options.strokeWidth
   * @param {string?} options.strokeColor
   * @param {number?} options.lineSoftness how soft the line will be
   * @param {Image?} options.image an optional background image for the puzzle that will be split across all pieces.
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
      image = null}) {
    this.width = width;
    this.height = height;
    this.pieceSize = pieceSize;
    this.borderFill = borderFill;
    this.image = image;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
    this.lineSoftness = lineSoftness;
    this.proximity = proximity;
    this._initializeLayer(id);
  }

  /**
   * @param {object} options
   * @param {import('./puzzle').PieceStructure} options.structure
   * @param {object}     options.data
   * @param {Position}   options.data.targetPosition
   * @param {Position?}  options.data.currentPosition
   * @param {Position?}  options.data.imageOffset
   * @param {string?}    options.data.color
   * @param {Image?}     options.data.image
   */
  newPiece({structure, data}) {
    data.currentPosition = data.currentPosition || data.targetPosition;
    this._renderPiece(this._buildPiece(structure, data));
  }

  buildPuzzle({horizontalPiecesCount = 5, verticalPiecesCount = 5}) {
    const manufacturer = new Manufacturer();
    manufacturer.configureDimmensions(horizontalPiecesCount, verticalPiecesCount);
    manufacturer.configureStructure(this.puzzleStructure);
    manufacturer.configureInsertsGenerator(twoAndTwo);
    this._puzzle = manufacturer.build();
    this.puzzle.pieces.forEach(it => {
      const position = { x: it.centralAnchor.x, y: it.centralAnchor.y }
      it.carry({targetPosition: position, currentPosition: position});
      this._renderPiece(it);
    });
  }

  /**
   * @param {number} farness from 0 to 1, how far pieces will be placed from x = 0, y = 0
   */
  shuffle(farness = 1) {
    this.puzzle.shuffle(farness * this.width, farness * this.height)
  }

  draw() {
    this.puzzle.autoconnectAll();
    this.layer.draw();
  }

  /**
   * @param {Piece} piece
   */
  _renderPiece(piece) {
    // @ts-ignore
    var group = new Konva.Group({
      x: piece.data.currentPosition.x,
      y: piece.data.currentPosition.y
    });
    // @ts-ignore
    group.add(new Konva.Line({
      points: outline.draw(piece, this.pieceSize, this.borderFill),
      fill: piece.data.color,
      tension: this.lineSoftness,
      fillPatternImage: this.image || piece.data.image,
      fillPatternOffset: this._imageOffsetFor(piece),
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      closed: true,
    }));
    group.draggable('true')

    this.layer.add(group);

    this._bindGroupToPiece(group, piece);
    this._bindPieceToGroup(piece, group);
  }

  /**
   * Configures updates from piece into group
   * @param {*} group
   * @param {Piece} piece
   */
  _bindGroupToPiece(group, piece) {
    piece.onTranslate((_dx, _dy) => {
      group.x(piece.centralAnchor.x);
      group.y(piece.centralAnchor.y);
      commitCurrentPosition(piece, group);
    });
  }

  /**
   * * Configures updates from group into piece
   * @param {Piece} piece
   * @param {*} group
   */
  _bindPieceToGroup(piece, group) {
    group.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
    });
    group.on('mouseout', () => {
      document.body.style.cursor = 'default';
    });
    group.on('dragmove', () => {
      let [dx, dy] = currentPositionDiff(piece, group);
      if (!vector.isNull(dx, dy)) {
        piece.drag(dx, dy, true);
        commitCurrentPosition(piece, group);
        this.layer.draw();
      }
    });
    group.on('dragend', () => {
      piece.drop();
      this.layer.draw();
    });
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

  /**
   * @param {string} id
   */
  _initializeLayer(id) {
    // @ts-ignore
    var stage = new Konva.Stage({
      container: id,
      width: this.width,
      height: this.height
    });

    // @ts-ignore
    var layer = new Konva.Layer();
    stage.add(layer);
    this.layer = layer;
  }

  _initializeEmptyPuzzle() {
    this._puzzle = new Puzzle(this.puzzleStructure);
  }

  _buildPiece(structure, data) {
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
   * @returns {import('./puzzle').PuzzleStructure}
   */
  get puzzleStructure() {
    return {pieceSize: this.pieceSize / 2, proximity: this.proximity}
  }

}

module.exports = PuzzleCanvas
