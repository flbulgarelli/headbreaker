export { anchor, Anchor } from './anchor';
export { radius, diameter } from './size';
export { NullValidator, PieceValidator, PuzzleValidator } from './validator';
export { Horizontal, Vertical } from './axis';
export { Tab, Slot, None } from './insert';

import vector from './vector';
import Pair = require('./pair');
import Puzzle = require('./puzzle');
import Piece = require('./piece');
import Structure = require('./structure');
import Canvas = require('./canvas');
import Manufacturer = require('./manufacturer');
import Metadata = require('./metadata');
import SpatialMetadata = require('./spatial-metadata');
import Shuffler = require('./shuffler');
import * as outline from './outline';
import dragMode = require('./drag-mode');
import connector = require('./connector');
import Dummy = require('./dummy-painter');
import Konva = require('./konva-painter');

const {InsertSequence, ...generators} = require('./sequence');

export const painters = { Dummy, Konva }

export {
  vector,
  Puzzle,
  Piece,
  Canvas,
  Manufacturer,
  InsertSequence,
  Pair,
  Metadata,
  SpatialMetadata,
  Structure,
  Shuffler,
  generators,
  outline,
  dragMode,
  connector
}