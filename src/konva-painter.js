const Konva = require('konva');
const PuzzleCanvas = require('./canvas');
const outline = require('./outline');
const {Piece} = require('./puzzle');
const vector = require('./vector');


/**
 * @param {Piece} model
 * @param {*} group
 */
function currentPositionDiff(model, group) {
  return vector.diff(group.x(),group.y(), model.metadata.currentPosition.x, model.metadata.currentPosition.y);
}

class KonvaPainter {
  /** @typedef {import('./canvas').Figure} Figure */
  /** @typedef {import('./canvas').Group} Group */

  /**
   * @param {PuzzleCanvas} canvas
   * @param {string} id
   */
  initialize(canvas, id) {
    // @ts-ignore
    var stage = new Konva.Stage({
      container: id,
      width: canvas.width,
      height: canvas.height
    });

    // @ts-ignore
    var layer = new Konva.Layer();
    stage.add(layer);
    canvas['__konvaLayer__'] = layer;
  }

  /**
   * @param {PuzzleCanvas} canvas
   */
  draw(canvas) {
    canvas['__konvaLayer__'].draw();
  }

  /**
   *
   * @param {PuzzleCanvas} canvas
   * @param {Piece} piece
   * @param {Figure} figure
   */
  sketch(canvas, piece, figure) {
    // @ts-ignore
    figure.group = new Konva.Group({
      x: piece.metadata.currentPosition.x,
      y: piece.metadata.currentPosition.y
    });
    const image = canvas.image || piece.metadata.image;
    // @ts-ignore
    figure.shape = new Konva.Line({
      points: outline.draw(piece, canvas.pieceSize, canvas.borderFill),
      fill: !image ? piece.metadata.color || 'black' : null,
      tension: canvas.lineSoftness,
      fillPatternImage: image,
      fillPatternOffset: canvas._imageOffsetFor(piece),
      stroke: piece.metadata.strokeColor || canvas.strokeColor,
      strokeWidth: canvas.strokeWidth,
      closed: true,
    });
    figure.group.add(figure.shape);
    figure.group.draggable('true');

    canvas['__konvaLayer__'].add(figure.group);
  }

  /**
   *
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} piece
   * @param {Figure} figure
   */
  label(_canvas, piece, figure) {
    // @ts-ignore
    figure.label = new Konva.Text({
      x: piece.metadata.label.x || (figure.group.width() / 2),
      y: piece.metadata.label.y || (figure.group.height() / 2),
      text:     piece.metadata.label.text,
      fontSize: piece.metadata.label.fontSize,
      fontFamily: piece.metadata.label.fontFamily || 'Sans Serif',
      fill: piece.metadata.label.color || 'white',
    });
    figure.group.add(figure.label);
  }

  /**
   *
   * @param {PuzzleCanvas} _canvas
   * @param {Group} group
   * @param {Piece} piece
   */
  physicalTranslate(_canvas, group, piece) {
    group.x(piece.centralAnchor.x);
    group.y(piece.centralAnchor.y);
  }

  /**
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} piece
   * @param {*} group
   */
  logicalTranslate(_canvas, piece, group) {
    piece.metadata.currentPosition.x = group.x();
    piece.metadata.currentPosition.y = group.y();
  }

  /**
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} piece
   * @param {Group} group
   * @param {(dx: number, dy: number) => void} f
   */
  onDrag(_canvas, piece, group, f) {
    group.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
    });
    group.on('mouseout', () => {
      document.body.style.cursor = 'default';
    });
    group.on('dragmove', () => {
      let [dx, dy] = currentPositionDiff(piece, group);
      f(dx, dy);
    });
  }

  /**
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} _piece
   * @param {Group} group
   * @param {() => void} f
   */
  onDragEnd(_canvas, _piece, group, f) {
    group.on('dragend', () => {
      f()
    });
  }
}

/**
 * @module KonvaPainter
 */
module.exports = KonvaPainter;
