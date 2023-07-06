const {Anchor} = require('./anchor');
import Piece from './piece';
import {Vector} from './vector';

export type Shuffler = (pieces: Piece[]) => Vector[];

/**
 * @private
 */
function sampleIndex(list) {
  return Math.round(Math.random() * (list.length - 1));
}

/**
 * @param {number} maxX
 * @param {number} maxY
 *
 * @returns {Shuffler}
 */
function random(maxX: number, maxY: number): Shuffler {
  return (pieces) => pieces.map(_it => Anchor.atRandom(maxX, maxY));
}

/**
 * @type {Shuffler}
 * */
const grid: Shuffler = (pieces) => {
  const destinations = pieces.map(it => it.centralAnchor.asVector());
  for (let i = 0; i < destinations.length; i++) {
    const j = sampleIndex(destinations);
    const temp = destinations[j];
    destinations[j] = destinations[i];
    destinations[i] = temp;
  }
  return destinations;
};

/**
 * @type {Shuffler}
 * */
const columns: Shuffler = (pieces) => {
  const destinations = pieces.map(it => it.centralAnchor.asVector());
  const columns = new Map();

  for (let destination of destinations) {
    if (!columns.get(destination.x)) {
      columns.set(destination.x, destinations.filter(it => it.x == destination.x));
    }
    const column = columns.get(destination.x);

    const j = sampleIndex(column);
    const temp = column[j].y
    column[j].y = destination.y;
    destination.y = temp;
  }
  return destinations;
};


/**
 * @type {Shuffler}
 * */
const line: Shuffler = (pieces) => {
  const destinations = pieces.map(it => it.centralAnchor.asVector());
  const columns = new Set(destinations.map(it => it.x));
  const maxX = Math.max(...columns);
  const minX = Math.min(...columns);
  const width = (maxX - minX) / (columns.size - 1);
  const pivot = minX + (width / 2);

  const lineLength = destinations.length * width;
  const linePivot = destinations.filter(it => it.x < pivot).length * width;

  const init = [];
  const tail = [];

  for (let i = 0; i < linePivot; i += width) {
    init.push(i);
  }

  for (let i = init[init.length - 1] + width; i < lineLength; i += width) {
    tail.push(i);
  }

  for (let destination of destinations) {
    const source = destination.x < pivot ? init : tail;
    const index = sampleIndex(source);

    destination.y = 0;
    destination.x = source[index];
    source.splice(index, 1);
  }
  return destinations;
};

/**
 * @param {number} padding
 * @param {number} width
 * @param {number} height
 * @returns {Shuffler}
 * */
function padder(padding: number, width: number, height: number): Shuffler {
  return (pieces) => {
    const destinations = pieces.map(it => it.centralAnchor.asVector());
    let dx = 0;
    let dy = 0;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const destination = destinations[i + width * j];
        destination.x += dx;
        destination.y += dy;

        dx += padding;
      }
      dx = 0;
      dy += padding;
    }
    return destinations;
  }
}

/**
 * @param {import('./vector').Vector} maxDistance
 * @returns {Shuffler}
 */
function noise(maxDistance: import('./vector').Vector): Shuffler {
  return (pieces) => {
    return pieces.map(it =>
      Anchor
        .atRandom(2 * maxDistance.x, 2 * maxDistance.y)
        .translate(-maxDistance.x, -maxDistance.y)
        .translate(it.centralAnchor.x, it.centralAnchor.y)
        .asVector());
  }
}

/**
 * @type {Shuffler}
 * */
const noop: Shuffler = (pieces) => pieces.map(it => it.centralAnchor);

export {
  random,
  grid,
  columns,
  line,
  noop,
  padder,
  noise
}
