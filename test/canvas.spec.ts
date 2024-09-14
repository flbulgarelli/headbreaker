import { describe, assert, test } from 'vitest';
import {
  diameter,
  vector,
  Slot,
  Tab,
  None,
  painters,
  generators,
  Puzzle,
  Canvas,
  Template,
  Anchor,
} from '../src/headbreaker/index';

declare const global: any;

global.HTMLImageElement = function () {};
global.HTMLCanvasElement = function () {};

describe('Canvas', () => {
  const painter = new painters.Dummy();

  test('can create a single-piece puzzle', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'black',
      painter: painter,
    });

    canvas.sketchPiece({
      structure: { right: Tab, down: Tab, left: Slot },
      size: diameter({ x: 50, y: 40 }),
      metadata: {
        id: 'a',
        currentPosition: { x: 50, y: 50 },
        color: 'red',
      },
    });

    canvas.draw();

    assert.equal(canvas['__nullLayer__']!.figures, 1);
    assert.equal(canvas['__nullLayer__']!.drawn, true);

    assert.equal(!!(canvas.figures ?? {})[1], false);
    assert.equal(!!(canvas.figures ?? {})['a'], true);

    assert.equal(canvas.puzzle?.pieces.length, 1);
    assert.deepEqual(canvas.puzzle?.head.centralAnchor, {
      x: 50,
      y: 50,
    } as Anchor);
  });

  test('can not draw a canvas twice', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      painter: painter,
    });

    canvas.sketchPiece({
      structure: { right: Tab, down: Tab, left: Slot },
      size: diameter({ x: 50, y: 40 }),
      metadata: {},
    });

    canvas.draw();
    assert.throws(() => canvas.draw());
  });

  test('can create a single-piece puzzle with size overriden ', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      painter: painter,
    });

    canvas.sketchPiece({
      structure: { right: Tab, down: Tab, left: Slot },
      size: diameter({ x: 50, y: 40 }),
      metadata: {
        id: 'a',
        currentPosition: { x: 50, y: 50 },
        color: 'red',
      },
    });

    canvas.draw();
    assert.deepEqual(canvas.puzzle?.head.centralAnchor, {
      x: 50,
      y: 50,
    } as Anchor);
    assert.deepEqual(canvas.puzzle?.head.size, diameter({ x: 50, y: 40 }));
  });

  test('can create a non-homogenous two-pieces canvas', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'black',
      painter: painter,
    });

    canvas.sketchPiece({
      structure: '-T--',
      metadata: { id: 'a', currentPosition: { x: 50, y: 50 } },
    } as Template);

    canvas.sketchPiece({
      structure: '---S',
      metadata: { id: 'b', currentPosition: { x: 200, y: 200 } },
      size: diameter(vector(200, 100)),
    });

    canvas.draw();

    assert.equal(canvas['__nullLayer__']!.figures, 2);
    assert.equal(canvas['__nullLayer__']!.drawn, true);

    assert.deepEqual(canvas.puzzle?.pieces[0].diameter, vector(100, 100));
    assert.deepEqual(canvas.puzzle?.pieces[1].diameter, vector(200, 100));

    assert.equal(canvas.pieceDiameter.x, 100);
    assert.equal(canvas.pieceDiameter.y, 100);
  });

  test('initializes the validity on draw', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'black',
      painter: painter,
    });

    canvas.sketchPiece({
      structure: '----',
      metadata: { id: 'a' },
    } as Template);
    canvas.draw();

    assert.deepEqual(canvas.puzzle?.valid, false);
  });

  test('can create a single-piece puzzle with no current nor target positions', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      painter: painter,
    });

    canvas.sketchPiece({
      structure: '----',
      metadata: { id: 'a' },
    } as Template);

    canvas.draw();

    const head = canvas.puzzle!.head;

    assert.deepEqual(head.metadata.targetPosition, { x: 0, y: 0 });
    assert.deepEqual(
      head.metadata.currentPosition,
      head.metadata.targetPosition
    );
    assert.notEqual(
      head.metadata.currentPosition,
      head.metadata.targetPosition
    );
  });

  test('can create a single-piece puzzle with no current but target positions', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      painter: painter,
    });

    canvas.sketchPiece({
      structure: '----',
      metadata: {
        id: 'a',
        targetPosition: { x: 10, y: 15 },
      },
    } as Template);

    canvas.draw();

    const head = canvas.puzzle!.head;

    assert.deepEqual(head.metadata.targetPosition, { x: 10, y: 15 });
    assert.deepEqual(
      head.metadata.currentPosition,
      head.metadata.targetPosition
    );
    assert.notEqual(
      head.metadata.currentPosition,
      head.metadata.targetPosition
    );
  });

  test('can create a single-piece puzzle with strings', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'black',
      painter: painter,
    });

    canvas.sketchPiece({
      structure: 'STS-',
      metadata: {
        id: 'a',
        currentPosition: { x: 50, y: 50 },
        color: 'red',
      },
    } as Template);

    canvas.draw();

    assert.equal(canvas['__nullLayer__']!.figures, 1);
    assert.equal(canvas['__nullLayer__']!.drawn, true);

    assert.equal(!!canvas.figures![1], false);
    assert.equal(!!canvas.figures!['a'], true);

    const [piece] = canvas.puzzle!.pieces;

    assert.equal(piece.right, Slot);
    assert.equal(piece.down, Tab);
    assert.equal(piece.left, Slot);
    assert.equal(piece.up, None);
  });

  test('can create an autogenerated puzzle', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'red',
      painter: painter,
    });

    canvas.autogenerate({
      verticalPiecesCount: 4,
      horizontalPiecesCount: 4,
      insertsGenerator: generators.flipflop,
    });
    canvas.draw();

    assert.equal(canvas['__nullLayer__']!.figures, 16);
    assert.equal(canvas['__nullLayer__']!.drawn, true);

    assert.equal(!!canvas.figures![0], false);
    assert.equal(!!canvas.figures![1], true);
    assert.equal(!!canvas.figures![16], true);
    assert.equal(!!canvas.figures![17], false);

    assert.equal(canvas.puzzle!.pieces.length, 16);
  });

  test('can shuffle a puzzle', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      painter: painter,
    });

    canvas.autogenerate();
    canvas.shuffle();

    assert.equal(canvas.autoconnected, true);
  });

  test('can solve a puzzle', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      painter: painter,
    });

    canvas.autogenerate();
    canvas.shuffle();
    canvas.solve();

    canvas.puzzle!.pieces.forEach((it) => {
      assert.deepEqual(it.metadata.currentPosition, it.metadata.targetPosition);
      assert.notEqual(it.metadata.currentPosition, it.metadata.targetPosition);
      assert.deepEqual(it.centralAnchor, it.metadata.currentPosition);
    });
    assert.equal(canvas.autoconnected, true);
  });

  test('can clear canvas', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'red',
      painter: painter,
    });

    canvas.autogenerate();
    canvas.draw();
    canvas.clear();

    assert.equal(canvas._drawn, false);
    assert.equal(canvas.getPainter(), painter);
    assert.equal(canvas._puzzle, null);
    assert.equal(canvas.puzzle!.pieces.length, 0);
    assert.deepEqual(canvas.figures, {});
    assert.doesNotThrow(() => canvas.draw());
  });

  test('can sketch a whole puzzle', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      painter: painter,
    });
    const puzzle = new Puzzle({ pieceRadius: 13, proximity: 7 });
    puzzle.newPiece({ right: Tab }).locateAt(0, 0);
    puzzle.newPiece({ left: Slot, right: Tab }).locateAt(3, 0);

    canvas.renderPuzzle(puzzle);
    canvas.draw();

    assert.equal(canvas['__nullLayer__']!.figures, 2);
    assert.equal(canvas['__nullLayer__']!.drawn, true);

    assert.deepEqual(canvas.pieceDiameter, { x: 26, y: 26 });
    assert.equal(canvas.proximity, 14);
  });

  test('can create an autogenerated puzzle with metadata list', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: 100,
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'red',
      painter: painter,
    });

    canvas.autogenerate({
      verticalPiecesCount: 2,
      horizontalPiecesCount: 2,
      metadata: [
        { label: { text: 'a' } },
        { label: { text: 'b' } },
        { label: { text: 'c' } },
        { label: { text: 'd' } },
      ],
    });
    canvas.draw();

    assert.equal(canvas.puzzle!.pieces[0].metadata.label.text, 'a');
    assert.equal(canvas.puzzle!.pieces[1].metadata.label.text, 'b');
    assert.equal(canvas.puzzle!.pieces[2].metadata.label.text, 'c');
    assert.equal(canvas.puzzle!.pieces[3].metadata.label.text, 'd');

    assert.equal(canvas.puzzleDiameter.x, 204);
    assert.equal(canvas.pieceDiameter.x, 100);

    assert.equal(canvas.puzzleDiameter.y, 204);
    assert.equal(canvas.pieceDiameter.y, 100);
  });

  test('can create an autogenerated puzzle with rectangular pieces', () => {
    const canvas = new Canvas('canvas', {
      width: 800,
      height: 800,
      pieceSize: { x: 100, y: 50 },
      proximity: 20,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.12,
      strokeColor: 'red',
      painter: painter,
    });

    canvas.autogenerate({
      verticalPiecesCount: 2,
      horizontalPiecesCount: 2,
    });
    canvas.draw();

    assert.equal(canvas.puzzleDiameter.x, 204);
    assert.equal(canvas.pieceDiameter.x, 100);

    assert.equal(canvas.puzzleDiameter.y, 104);
    assert.equal(canvas.pieceDiameter.y, 50);
  });

  test('can listen to connect events with figures', async () => {
    await new Promise<void>((resolve) => {
      const canvas = new Canvas('canvas', {
        width: 800,
        height: 800,
        pieceSize: 100,
        proximity: 20,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.12,
        strokeColor: 'red',
        painter: painter,
      });

      canvas.autogenerate({
        verticalPiecesCount: 2,
        horizontalPiecesCount: 2,
        insertsGenerator: generators.flipflop,
      });
      canvas.draw();

      assert.equal(canvas['__nullLayer__']!.figures, 4);
      assert.equal(canvas['__nullLayer__']!.drawn, true);

      const [first, second] = canvas.puzzle!.pieces;

      canvas.onConnect((piece, figure, target, targetFigure) => {
        assert.equal(canvas.getFigure(piece), figure);
        assert.equal(first, piece);

        assert.equal(canvas.getFigure(target), targetFigure);
        assert.equal(second, target);
        resolve();
      });

      first.disconnect();
      first.connectHorizontallyWith(second);
    });
  });

  test('can listen to disconnect events with figures', async () => {
    await new Promise<void>((resolve) => {
      const canvas = new Canvas('canvas', {
        width: 800,
        height: 800,
        pieceSize: 100,
        proximity: 20,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.12,
        strokeColor: 'red',
        painter: painter,
      });

      canvas.autogenerate({
        verticalPiecesCount: 1,
        horizontalPiecesCount: 2,
        insertsGenerator: generators.flipflop,
      });
      canvas.draw();

      assert.equal(canvas['__nullLayer__']!.figures, 2);
      assert.equal(canvas['__nullLayer__']!.drawn, true);

      const [first, second] = canvas.puzzle!.pieces;

      canvas.onDisconnect((piece, figure) => {
        assert.equal(canvas.getFigure(piece), figure);
        assert.equal(first, piece);
        resolve();
      });

      first.connectHorizontallyWith(second);
      first.disconnect();
    });
  });

  test('can listen to multiple disconnect events with figures', async () => {
    await new Promise<void>((resolve) => {
      const canvas = new Canvas('canvas', {
        width: 800,
        height: 800,
        pieceSize: 100,
        proximity: 20,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.12,
        strokeColor: 'red',
        painter: painter,
      });

      canvas.autogenerate({
        verticalPiecesCount: 3,
        horizontalPiecesCount: 3,
        insertsGenerator: generators.flipflop,
      });
      canvas.draw();

      assert.equal(canvas['__nullLayer__']!.figures, 9);
      assert.equal(canvas['__nullLayer__']!.drawn, true);

      const center = canvas.puzzle!.pieces[4];

      let count = 0;
      canvas.onDisconnect(() => {
        count++;
        if (count === 4) {
          resolve();
        }
      });
      center.disconnect();
    });
  });
});
