const PuzzleCanvas = require('./canvas');
const {Piece} = require('./puzzle');

class DummyPainter {
  /** @typedef {import('./canvas').Figure} Figure */
  /** @typedef {import('./canvas').Group} Group */

  /**
   * @param {PuzzleCanvas} canvas
   * @param {string} id
   */
  initialize(canvas, id) {
    canvas['__nullLayer__'] = {drawn: false, figures: 0};
  }

  /**
   * @param {PuzzleCanvas} canvas
   */
  draw(canvas) {
    canvas['__nullLayer__'].drawn = true;
  }

  /**
   *
   * @param {PuzzleCanvas} canvas
   * @param {Piece} _piece
   * @param {Figure} _figure
   */
  sketch(canvas, _piece, _figure) {
    canvas['__nullLayer__'].figures++;
  }

  /**
   *
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} _piece
   * @param {Figure} _figure
   */
  label(_canvas, _piece, _figure) {
  }

  /**
   *
   * @param {PuzzleCanvas} _canvas
   * @param {Group} _group
   * @param {Piece} _piece
   */
  physicalTranslate(_canvas, _group, _piece) {
  }

  /**
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} _piece
   * @param {*} _group
   */
  logicalTranslate(_canvas, _piece, _group) {
  }

  /**
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} _piece
   * @param {Group} _group
   * @param {(dx: number, dy: number) => void} f
   */
  onDrag(_canvas, _piece, _group, f) {
  }

  /**
   * @param {PuzzleCanvas} _canvas
   * @param {Piece} _piece
   * @param {Group} _group
   * @param {() => void} _f
   */
  onDragEnd(_canvas, _piece, _group, _f) {
  }
}

/**
 * @module DummyPainter
 */
module.exports = DummyPainter;
