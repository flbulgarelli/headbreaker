let Konva;
try {
  // @ts-ignore
  Konva = require('konva');
} catch (e) {
  Konva = {
    Stage: class {
      constructor(_options) {
        throw new Error("Konva not loaded");
      }
    }
  };
}

const Canvas = require('./canvas');
const Outline = require('./outline');
const Piece = require('./piece');
const Pair = require('./pair');
const Vector = require('./vector');
const Painter = require('./painter');


/**
 * @private
 * @param {Piece} model
 * @param {*} group
 */
function currentPositionDiff(model, group) {
  return Pair.diff(group.x(),group.y(), model.metadata.currentPosition.x, model.metadata.currentPosition.y);
}

/**
 * A {@link Painter} that uses Konva.js as rendering backend
 * @implements {Painter}
 */
class KonvaPainter extends Painter {
  /** @typedef {import('./canvas').Figure} Figure */
  /** @typedef {import('./canvas').Group} Group */

  /**
   * @param {Canvas} canvas
   * @param {string} id
   */
  initialize(canvas, id) {
    var stage = new Konva.Stage({
      container: id,
      width: canvas.width,
      height: canvas.height,
      draggable: !canvas.fixed,
    });

    this._initializeLayer(stage, canvas);
  }

  _initializeLayer(stage, canvas) {
    var layer = new Konva.Layer();
    stage.add(layer);
    canvas['__konvaLayer__'] = layer;
  }

  /**
   * @param {Canvas} canvas
   */
  draw(canvas) {
    canvas['__konvaLayer__'].draw();
  }

  /**
   * @param {Canvas} canvas
   */
  reinitialize(canvas) {
    const layer = canvas['__konvaLayer__'];
    layer.destroy();

    this._initializeLayer(layer.getStage(), canvas);
  }

  /**
   * @param {Canvas} canvas
   * @param {number} width
   * @param {number} height
   */
  resize(canvas, width, height) {
    const layer = canvas['__konvaLayer__'];
    const stage = layer.getStage();

    stage.width(width);
    stage.height(height);
  }

  /**
   * @param {Canvas} canvas
   * @param {import('./vector').Vector} factor
   */
  scale(canvas, factor) {
    canvas['__konvaLayer__'].getStage().scale(factor);
  }

  /**
   *
   * @param {Canvas} canvas
   * @param {Piece} piece
   * @param {Figure} figure
   */
  sketch(canvas, piece, figure) {
    figure.group = new Konva.Group({
      x: piece.metadata.currentPosition.x,
      y: piece.metadata.currentPosition.y,
      draggable: !piece.metadata.fixed
    });

    figure.shape = new Konva.Line({
      points: Outline.draw(piece, piece.diameter, canvas.borderFill),
      tension: canvas.lineSoftness,
      stroke: piece.metadata.strokeColor || canvas.strokeColor,
      strokeWidth: canvas.strokeWidth,
      closed: true,
    });
    this.fill(canvas, piece, figure);
    figure.group.add(figure.shape);

    canvas['__konvaLayer__'].add(figure.group);
  }

  /**
   * @param {Canvas} canvas
   * @param {Piece} piece
   * @param {Figure} figure
   */
  fill(canvas, piece, figure) {
    const image = canvas.imageMetadataFor(piece);
    figure.shape.fill(!image ? piece.metadata.color || 'black' : null);
    figure.shape.fillPatternImage(image && image.content);
    figure.shape.fillPatternScale(image && {x: image.scale, y: image.scale});
    figure.shape.fillPatternOffset(image && Vector.divide(image.offset, image.scale));
  }

  /**
   *
   * @param {Canvas} _canvas
   * @param {Piece} piece
   * @param {Figure} figure
   */
  label(_canvas, piece, figure) {
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
   * @param {Canvas} _canvas
   * @param {Group} group
   * @param {Piece} piece
   */
  physicalTranslate(_canvas, group, piece) {
    group.x(piece.centralAnchor.x);
    group.y(piece.centralAnchor.y);
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} piece
   * @param {*} group
   */
  logicalTranslate(_canvas, piece, group) {
    Vector.update(piece.metadata.currentPosition, group.x(), group.y());
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} piece
   * @param {Group} group
   * @param {import('./painter').VectorAction} f
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
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {Group} group
   * @param {import('./painter').Action} f
   */
  onDragEnd(_canvas, _piece, group, f) {
    group.on('dragend', () => {
      f()
    });
  }
}

module.exports = KonvaPainter;
