const Canvas = require('./canvas');
const Piece = require('./piece');

/**
 * @implements {Painter}
 */
class DummyPainter extends Canvas.Painter {
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
}

/**
 * A {@link Painter} for testing purpouses that does not perform rendering
 *
 * @module DummyPainter
 */
module.exports = DummyPainter;
