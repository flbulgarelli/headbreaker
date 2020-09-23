const Canvas = require('./canvas');
const Piece = require('./piece');
const Painter = require('./painter');

/**
 * A {@link Painter} for testing purpouses that does not perform rendering
 *
 * @implements {Painter}
 */
class DummyPainter extends Painter {
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
   * @param {import('./outline').Outline} outline
   */
  sketch(canvas, _piece, _figure, outline) {
    canvas['__nullLayer__'].figures++;
  }
}

module.exports = DummyPainter;
