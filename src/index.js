const Vector = require('./vector')
const {anchor, Anchor} = require('./anchor')
const Puzzle = require('./puzzle');
const Piece = require('./piece');
const {Tab, Slot, None} = require('./insert');
const {NullValidator, PieceValidator, PuzzleValidator} = require('./validator');
const Structure = require('./structure');
const Outline = require('./outline');
const Canvas = require('./canvas');
const Manufacturer = require('./manufacturer');
const {InsertSequence, ...generators} = require('./sequence');
const Metadata = require('./metadata');
const {position, ...Position} = require('./position');

module.exports = {
  anchor,
  position,
  Anchor,
  Puzzle,
  Piece,
  Canvas,
  Manufacturer,
  InsertSequence,
  PieceValidator,
  PuzzleValidator,
  NullValidator,
  Tab,
  Slot,
  None,
  Vector,
  Metadata,
  Outline,
  Structure,
  Position,
  generators,
  painters: {
    Dummy: require('./dummy-painter'),
    Konva: require('./konva-painter')
  }
}
