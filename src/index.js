const vector = require('./vector')
const {anchor, Anchor} = require('./anchor')
const Puzzle = require('./puzzle');
const Piece = require('./piece');
const {Tab, Slot, None, dump, parse} = require('./structure');
const outline = require('./outline');
const Canvas = require('./canvas');
const Manufacturer = require('./manufacturer');
const sequence = require('./sequence');

module.exports = {
  anchor,
  Anchor,
  Puzzle,
  Piece,
  Canvas,
  Manufacturer,
  Tab,
  Slot,
  None,
  vector,
  outline,
  sequence,
  structure: {
    dump,
    parse
  },
  painters: {
    Dummy: require('./dummy-painter'),
    Konva: require('./konva-painter')
  }
}
