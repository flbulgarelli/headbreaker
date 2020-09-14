const Pair = require('./pair')
const {anchor, Anchor} = require('./anchor')
const Puzzle = require('./puzzle');
const Piece = require('./piece');
const {Tab, Slot, None} = require('./insert');
const {NullValidator, PieceValidator, PuzzleValidator} = require('./validator');
const {Horizontal, Vertical} = require('./axis');
const Structure = require('./structure');
const Outline = require('./outline');
const Canvas = require('./canvas');
const Manufacturer = require('./manufacturer');
const {InsertSequence, ...generators} = require('./sequence');
const Metadata = require('./metadata');
const SpatialMetadata = require('./spatial-metadata');
const {vector, ...Vector} = require('./vector');
const {radio, diameter} = require('./size');
const Shuffler = require('./shuffler');
const outline = require('./outline');

/**
 * @module headbreaker
 */
module.exports = {
  anchor,
  vector,
  radio,
  diameter,
  Anchor,
  Puzzle,
  Piece,
  Canvas,
  Manufacturer,
  InsertSequence,
  PieceValidator,
  PuzzleValidator,
  NullValidator,
  Horizontal,
  Vertical,
  Tab,
  Slot,
  None,
  Pair,
  Metadata,
  SpatialMetadata,
  Outline,
  Structure,
  Vector,
  Shuffler,
  generators,
  outline,
  painters: {
    Dummy: require('./dummy-painter'),
    Konva: require('./konva-painter')
  }
}
