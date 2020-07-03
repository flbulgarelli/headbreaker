const Vector = require('./vector')
const {anchor, Anchor} = require('./anchor')
const Puzzle = require('./puzzle');
const Piece = require('./piece');
const {Tab, Slot, None} = require('./insert');
const Structure = require('./structure');
const Outline = require('./outline');
const Canvas = require('./canvas');
const Manufacturer = require('./manufacturer');
const {InsertSequence, ...generators} = require('./sequence');
const Metadata = require('./metadata');

module.exports = {
  anchor,
  Anchor,
  Puzzle,
  Piece,
  Canvas,
  Manufacturer,
  InsertSequence,
  Tab,
  Slot,
  None,
  Vector,
  Metadata,
  Outline,
  Structure,
  generators,
  painters: {
    Dummy: require('./dummy-painter'),
    Konva: require('./konva-painter')
  }
}
