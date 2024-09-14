import Piece from './piece';
import { Vector } from './vector';
import Canvas, { Figure } from './canvas';
import { Outline } from './outline';
import Konva from 'konva';
import Puzzle from './puzzle';

/**
 * @callback VectorAction
 * @param {number} dx
 * @param {number} dy
 */
type VectorAction = (dx: number, dy: number) => void;

/**
 * @callback Action
 */
export type Action = () => void;

/**
 * An interface for a rendering backend for a {@link Canvas}, that can be implemented in
 * order to create UI representations of a puzzle.
 *
 * @interface Painter
 */
class Painter {
  /**
   * @param {Canvas} _canvas
   * @param {number} _width
   * @param {number} _height
   */
  resize(_canvas: Canvas, _width: number, _height: number): void {}

  /**
   * Creates the rendering backend, initializing all its contents.
   * After this call, painter is ready to receive any other messages.
   *
   * @param {Canvas} _canvas
   * @param {string} _id
   */
  initialize(_canvas: Canvas, _id: string): void {}

  /**
   * Recreates the rendering backend, clearing all its contents.
   * After this call, painter is ready to receive any other messages
   * as it had been just initialized.
   *
   * @param {Canvas} _canvas
   */
  reinitialize(_canvas: Canvas): void {}

  /**
   * Draws the canvas figures in the rendering backend.
   *
   * @param {Canvas} _canvas
   */
  draw(_canvas: Canvas): void {}

  /**
   * Scales the canvas contents.
   *
   * @param {Canvas} _canvas
   * @param {Vector} _factor
   */
  scale(_canvas: Canvas, _factor: Vector): void {}

  /**
   * Adds a piece to the rendering backend, so that it is ready to be drawn.
   *
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Figure} _figure the rendering backend information for this piece. This method may mutate it if necessary
   * @param {import('./outline').Outline} _outline
   */
  sketch(
    _canvas: Canvas,
    _piece: Piece,
    _figure: Figure,
    _outline: Outline
  ): void {}

  /**
   * Fills a piece using the canvas image information assigned for it.
   *
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Figure} _figure
   */
  fill(_canvas: Canvas, _piece: Piece, _figure: Figure): void {}

  /**
   * Adds the piece's label to the given figure in the rendering backend.
   *
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Figure} _figure the rendering backend information for this piece. This method may mutate it if necessary
   */
  label(_canvas: Canvas, _piece: Piece, _figure: Figure): void {}

  /**
   * Translates the given piece.
   *
   * @param {Canvas} _canvas
   * @param {import('./canvas').Group} _group
   * @param {Piece} _piece
   */
  physicalTranslate(
    _canvas: Canvas,
    _group: Konva.Group,
    _piece: Piece
  ): void {}

  /**
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Group} _group
   */
  logicalTranslate(_canvas: Canvas, _piece: Piece, _group: Konva.Group): void {}

  /**
   * Registers a drag-start callback.
   *
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {Konva.Group} _group
   * @param {VectorAction} _f
   */
  onDrag(
    _canvas: Canvas,
    _piece: Piece,
    _group: Konva.Group,
    _f: VectorAction
  ): void {}

  /**
   * Registers a drag-end callback.
   *
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {import('./canvas').Group} _group
   * @param {Action} _f
   */
  onDragEnd(
    _canvas: Canvas,
    _piece: Piece,
    _group: Konva.Group,
    _f: Action
  ): void {}

  /**
   * Registers keyboard gestures.
   *
   * @param {Canvas} _canvas
   * @param {object} _gestures a map of key strokes and puzzle actions
   */
  registerKeyboardGestures(
    _canvas: Canvas,
    _gestures: Record<number, (puzzle: Puzzle) => void>
  ): void {}
}

export default Painter;
