const Konva = require('konva');
const vector = require('./vector');
const outline = require('./outline');
const {Puzzle, Piece} = require('./puzzle');
const {anchor} = require('./anchor');

/**
 *
 * @param {Piece} model
 * @param {*} group
 */
function commitAnchors(model, group) {
  model.data.x = group.x();
  model.data.y = group.y();
}

/**
 * @param {Piece} model
 * @param {*} group
 */
function anchorsDelta(model, group) {
  return vector.diff(group.x(),group.y(), model.data.x, model.data.y);
}

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
    this._initializePuzzle(proximity);
    this._initializeLayer(id);
  }

  /**
   * @param {{structure: import('./puzzle').PieceStructure, x: number, y: number, data: *}} options
   */
  newPiece({structure, x, y, data}) {
    let piece = this.puzzle.newPiece(structure);
    piece.carry(data);
    piece.placeAt(anchor(x, y));
    this._renderPiece(piece);
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
   *
   * @param {Piece} model
   */
  _renderPiece(model) {
    // @ts-ignore
    var group = new Konva.Group({
      x: model.centralAnchor.x,
      y: model.centralAnchor.y
    });

    // @ts-ignore
    var piece = new Konva.Line({
      points: outline.draw(model, this.pieceSize, this.borderFill),
      fill: model.data.color,
      tension: this.lineSoftness,
      fillPatternImage: this.image || model.data.image,
      fillPatternOffset: this._imageOffsetFor(model),
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      closed: true,
    });

    group.add(piece);
    this.layer.add(group);
    group.draggable('true')

    group.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
    });
    group.on('mouseout', () => {
      document.body.style.cursor = 'default';
    });

    commitAnchors(model, group);

    group.on('dragmove', () => {
      let [dx, dy] = anchorsDelta(model, group);

      if (!vector.isNull(dx, dy)) {
        model.drag(dx, dy, true)
        commitAnchors(model, group);
        this.layer.draw();
      }
    });

    group.on('dragend', () => {
      model.drop();
      this.layer.draw();
    })

    model.onTranslate((_dx, _dy) => {
      group.x(model.centralAnchor.x)
      group.y(model.centralAnchor.y)
      commitAnchors(model, group);
    })
  }
  /**
   * @param {Piece} model
   */
  _imageOffsetFor(model) {
    if (this.image) {
      return { x: model.centralAnchor.x, y: model.centralAnchor.y }
    } else {
      return model.data.imageOffset
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

  /**
   * @param {number} proximity
   */
  _initializePuzzle(proximity) {
    this.puzzle = new Puzzle({ pieceSize: this.pieceSize / 2, proximity: proximity });
  }
}

module.exports = PuzzleCanvas
