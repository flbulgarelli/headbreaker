import Pair = require('./pair');
import { anchor, Anchor } from './anchor';
import Puzzle = require('./puzzle');
import Piece = require('./piece');
import { Tab, Slot, None } from './insert';
import { NullValidator, PieceValidator, PuzzleValidator } from './validator';
import { Horizontal, Vertical } from './axis';
import Structure = require('./structure');
import Outline = require('./outline');
import Canvas = require('./canvas');
import Manufacturer = require('./manufacturer');
import Metadata = require('./metadata');
import SpatialMetadata = require('./spatial-metadata');
import { radius, diameter } from './size';
import Shuffler = require('./shuffler');
import outline from './outline';
import dragMode = require('./drag-mode');
import connector = require('./connector');

const {vector, ...Vector} = require('./vector');
const {InsertSequence, ...generators} = require('./sequence');

/**
 * @module headbreaker
 */
module.exports = {
  anchor,
  vector,
  radius,
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
  dragMode,
  connector,
  painters: {
    Dummy: require('./dummy-painter'),
    Konva: require('./konva-painter')
  }
}
