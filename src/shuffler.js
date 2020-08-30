const {Anchor} = require('./anchor');

/**
 * @typedef {(pieces: import("./piece")[]) => import("./vector").Vector[]} Shuffler
 */

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
function random(maxX, maxY) {
  return (pieces) => pieces.map(_it => Anchor.atRandom(maxX, maxY));
}

/**
 * @type {Shuffler}
 * */
const grid = (pieces) => {
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
const columns = (pieces) => {
  const destinations = pieces.map(it => it.centralAnchor.asVector());
  const columns = [];

  for (let destination of destinations) {
    if (!columns[destination.x]) {
      columns[destination.x] = destinations.filter(it => it.x == destination.x);
    }
    const column = columns[destination.x];

    const j = sampleIndex(column);
    const temp = column[j].y
    column[j].y = destination.y;
    destination.y = temp;
  }
  return destinations;
};


/**
 * @param {number} padding
 * @param {number} width
 * @param {number} height
 * @returns {Shuffler}
 * */
function padder(padding, width, height) {
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
function noise(maxDistance) {
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
const noop = (pieces) => pieces.map(it => it.centralAnchor);

module.exports = {
  random,
  grid,
  columns,
  noop,
  padder,
  noise
}
