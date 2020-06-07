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
   *
   * @param {*} layer
   * @param {{pieceSize: number, proximityLevel: number}} options
   */
  constructor(layer, {pieceSize, proximityLevel}) {
    this.layer = layer;
    this.pieceSize = pieceSize;
    this.puzzle = new Puzzle(pieceSize / 2, proximityLevel);
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
      points: outline.draw(model, this.pieceSize),
      fill: model.data.color,
      fillPatternImage: model.data.image,
      fillPatternOffset: { x: model.centralAnchor.x, y: model.centralAnchor.y },
      stroke: 'black',
      strokeWidth: 3,
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
}

module.exports = PuzzleCanvas
