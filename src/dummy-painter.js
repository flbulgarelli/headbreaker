const Canvas = require('./canvas');
const Piece = require('./piece');

/**
 * @implements {Painter}
 */
class DummyPainter {
  /**
   * @param {Canvas} canvas
   * @param {string} id
   */
  initialize(canvas, id) {
    canvas['__nullLayer__'] = {drawn: false, figures: 0};
  }

  /**
   * @param {Canvas} canvas
   */
  draw(canvas) {
    canvas['__nullLayer__'].drawn = true;
  }

  /**
   *
   * @param {Canvas} canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Figure} _figure
   */
  sketch(canvas, _piece, _figure) {
    canvas['__nullLayer__'].figures++;
  }

  /**
   *
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Figure} _figure
   */
  label(_canvas, _piece, _figure) {
  }

  /**
   *
   * @param {Canvas} _canvas
   * @param {import('./canvas').Group} _group
   * @param {Piece} _piece
   */
  physicalTranslate(_canvas, _group, _piece) {
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {*} _group
   */
  logicalTranslate(_canvas, _piece, _group) {
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Group} _group
   * @param {import('./canvas').VectorAction} f
   */
  onDrag(_canvas, _piece, _group, f) {
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Group} _group
   * @param {import('./canvas').Action} _f
   */
  onDragEnd(_canvas, _piece, _group, _f) {
  }
}

/**
 * A {@link Painter} for testing purpouses that does not perform rendering
 *
 * @module DummyPainter
 */
module.exports = DummyPainter;
