import Konva from 'konva';
import Piece from './piece';
import Pair from './pair';
import Painter from './painter';
import Canvas, { Figure } from './canvas';
import { Outline } from './outline';
import vector from './vector';

function currentPositionDiff(model: Piece, group: Konva.Group) {
  return Pair.diff(
    group.x(),
    group.y(),
    model.metadata.currentPosition?.x ?? 0,
    model.metadata.currentPosition?.y ?? 0
  );
}

/**
 * A {@link Painter} that uses Konva.js as rendering backend
 * @implements {Painter}
 */
class KonvaPainter extends Painter {
  /**
   * @param {Canvas} canvas
   * @param {string} id
   */
  initialize(canvas: Canvas, id: string): void {
    const stage = new Konva.Stage({
      container: id,
      width: canvas.width,
      height: canvas.height,
      draggable: !canvas.fixed,
    });

    this._initializeLayer(stage, canvas);
  }

  _initializeLayer(stage: Konva.Stage, canvas: Canvas): void {
    const layer = new Konva.Layer();
    stage.add(layer);
    canvas['__konvaLayer__'] = layer;
  }

  /**
   * @param {Canvas} canvas
   */
  draw(canvas: Canvas): void {
    canvas['__konvaLayer__']?.draw();
  }

  /**
   * @param {Canvas} canvas
   */
  reinitialize(canvas: Canvas): void {
    const layer = canvas['__konvaLayer__'] as Konva.Layer;
    const stage = layer.getStage();
    layer.destroy();

    this._initializeLayer(stage, canvas);
  }

  /**
   * @param {Canvas} canvas
   * @param {number} width
   * @param {number} height
   */
  resize(canvas: Canvas, width: number, height: number): void {
    const layer = canvas['__konvaLayer__'] as Konva.Layer;
    const stage = layer.getStage();

    stage.width(width);
    stage.height(height);
  }

  /**
   * @param {Canvas} canvas
   * @param {import('./vector').Vector} factor
   */
  scale(canvas: Canvas, factor: any): void {
    const layer = canvas['__konvaLayer__'];
    if (layer) {
      layer.getStage().scale(factor);
    }
  }

  /**
   * @param {Canvas} canvas
   * @param {Piece} piece
   * @param {Figure} figure
   * @param {import('./outline').Outline} outline
   */
  sketch(canvas: Canvas, piece: Piece, figure: any, outline: Outline): void {
    figure.group = new Konva.Group({
      x: piece.metadata.currentPosition?.x ?? 0,
      y: piece.metadata.currentPosition?.y ?? 0,
      draggable: !piece.metadata.fixed,
      dragBoundFunc: canvas.preventOffstageDrag
        ? (position) => {
            const furthermost = vector.minus(
              vector(canvas.width, canvas.height),
              piece.size?.radius ?? 0
            );
            return vector.max(
              vector.min(position, furthermost),
              piece.size?.radius ?? 0
            );
          }
        : undefined,
    });

    figure.shape = new Konva.Line({
      points: outline.draw(piece, piece.diameter, canvas.borderFill),
      bezier: outline.isBezier(),
      tension: outline.isBezier() ? undefined : canvas.lineSoftness,
      stroke: piece.metadata.strokeColor || canvas.strokeColor,
      strokeWidth: canvas.strokeWidth,
      closed: true,
      ...(piece.radius ? vector.multiply(piece.radius, -1) : { x: 0, y: 0 }),
    });
    this.fill(canvas, piece, figure);
    figure.group.add(figure.shape);

    const layer = canvas['__konvaLayer__'];
    if (layer) {
      layer.add(figure.group);
    }
  }

  /**
   * @param {Canvas} canvas
   * @param {Piece} piece
   * @param {Figure} figure
   */
  fill(canvas: Canvas, piece: Piece, figure: any): void {
    const image = canvas.imageMetadataFor(piece);
    figure.shape.fill(!image ? piece.metadata.color || 'black' : null);
    figure.shape.fillPatternImage(image && image.content);
    figure.shape.fillPatternScale(image && { x: image.scale, y: image.scale });
    figure.shape.fillPatternOffset(
      image && vector.divide(image.offset, image.scale)
    );
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} piece
   * @param {Figure} figure
   */
  label(_canvas: Canvas, piece: Piece, figure: Figure): void {
    figure.label = new Konva.Label({
      ...vector.minus(
        {
          x: piece.metadata.label?.x || (figure.group?.width() ?? 0) / 2,
          y: piece.metadata.label?.y || (figure.group?.height() ?? 0) / 2,
        },
        piece.radius ?? { x: 0, y: 0 }
      ),
      text: piece.metadata.label?.text,
      fontSize: piece.metadata.label?.fontSize,
      fontFamily: piece.metadata.label?.fontFamily || 'Sans Serif',
      fill: piece.metadata.label?.color || 'white',
    });
    figure.group?.add(figure.label);
  }

  /**
   * @param {Canvas} _canvas
   * @param {Konva.Group} group
   * @param {Piece} piece
   */
  physicalTranslate(_canvas: Canvas, group: Konva.Group, piece: Piece): void {
    group.x(piece.centralAnchor?.x ?? 0);
    group.y(piece.centralAnchor?.y ?? 0);
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} piece
   * @param {Konva.Group} group
   */
  logicalTranslate(_canvas: Canvas, piece: Piece, group: Konva.Group): void {
    vector.update(piece.metadata.currentPosition, group.x(), group.y());
  }

  /**
   * @param {Canvas} canvas
   * @param {Piece} piece
   * @param {Konva.Group} group
   * @param {import('./painter').VectorAction} f
   */
  onDrag(
    canvas: Canvas,
    piece: Piece,
    group: Konva.Group,
    f: (dx: number, dy: number) => void
  ): void {
    group.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
    });
    group.on('mouseout', () => {
      document.body.style.cursor = 'default';
    });
    group.on('dragmove', () => {
      const [dx, dy] = currentPositionDiff(piece, group);
      group.zIndex(canvas.figuresCount - 1);
      f(dx, dy);
    });
  }

  /**
   * @param {Canvas} _canvas
   * @param {Piece} _piece
   * @param {Konva.Group} group
   * @param {import('./painter').Action} f
   */
  onDragEnd(
    _canvas: Canvas,
    _piece: Piece,
    group: Konva.Group,
    f: () => void
  ): void {
    group.on('dragend', () => {
      f();
    });
  }

  /**
   * @param {Canvas} canvas
   * @param {object} gestures
   */
  registerKeyboardGestures(
    canvas: Canvas,
    gestures: Record<number, (puzzle: any) => void>
  ): void {
    const layer = canvas['__konvaLayer__'];
    if (layer) {
      const container = layer.getStage().container();
      container.tabIndex = -1;
      this._registerKeyDown(canvas, container, gestures);
      this._registerKeyUp(canvas, container, gestures);
    }
  }

  _registerKeyDown(
    canvas: Canvas,
    container: HTMLElement,
    gestures: Record<number, (puzzle: any) => void>
  ): void {
    container.addEventListener('keydown', (e) => {
      const keyCode = e.keyCode;
      if (gestures[keyCode]) {
        gestures[keyCode](canvas.puzzle);
      }
    });
  }

  _registerKeyUp(
    canvas: Canvas,
    container: HTMLElement,
    gestures: Record<number, (puzzle: any) => void>
  ): void {
    container.addEventListener('keyup', (e) => {
      const keyCode = e.keyCode;
      if (gestures[keyCode]) {
        if (canvas.puzzle) {
          canvas.puzzle.tryDisconnectionWhileDragging();
        }
      }
    });
  }
}

export default KonvaPainter;
