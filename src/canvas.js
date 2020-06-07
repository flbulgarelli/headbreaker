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
   * @param {*} layer
   * @param {object} options
   * @param {number} options.pieceSize
   * @param {number} options.proximityLevel
   * @param {number} options.borderFill the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
   * @param {Image?} options.image an optional background image for the puzzle that will be split across all pieces.
   * @param {number?} options.strokeWidth
   * @param {string?} options.strokeColor
   *
   */
  constructor(layer, {
      pieceSize, proximityLevel, borderFill = 0,
      strokeWidth = null, strokeColor = null,
      image = null}) {
    this.layer = layer;
    this.pieceSize = pieceSize;
    this.puzzle = new Puzzle(pieceSize / 2, proximityLevel);
    this.borderFill = borderFill;
    this.image = image;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
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
      fillPatternImage: this.image || model.data.image,
      fillPatternOffset: this._imageOffsetFor(model),
      stroke: this.strokeColor || 'black',
      strokeWidth: this.strokeWidth || 3,
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
}

module.exports = PuzzleCanvas
