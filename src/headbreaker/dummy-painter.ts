import Canvas, { Figure } from './canvas';
import Piece from './piece';
import Painter from './painter';

import { Outline } from './outline';

/**
 * A Painter for testing purposes that does not perform rendering
 *
 * @implements {Painter}
 */
class DummyPainter extends Painter {
  /**
   * Initializes the canvas with a null layer
   *
   * @param {Canvas} canvas
   * @param {string} _id
   */
  initialize(canvas: Canvas, _id: string): void {
    canvas['__nullLayer__'] = { drawn: false, figures: 0 };
  }

  /**
   * Marks the null layer as drawn
   *
   * @param {Canvas} canvas
   */
  draw(canvas: Canvas): void {
    if (canvas['__nullLayer__']) {
      canvas['__nullLayer__'].drawn = true;
    }
  }

  /**
   * Increments the figure count in the null layer
   *
   * @param {Canvas} canvas
   * @param {Piece} _piece
   * @param {Figure} _figure
   * @param {Outline} outline
   */
  sketch(
    canvas: Canvas,
    _piece: Piece,
    _figure: Figure,
    _outline: Outline
  ): void {
    if (canvas['__nullLayer__']) {
      canvas['__nullLayer__'].figures++;
    }
  }
}

export default DummyPainter;
