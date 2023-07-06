export { anchor, Anchor } from './anchor';
export { radius, diameter } from './size';
export { NullValidator, PieceValidator, PuzzleValidator } from './validator';
export { Horizontal, Vertical } from './axis';
export { Tab, Slot, None } from './insert';

import vector from './vector';
import pair from './pair';
import * as Puzzle from './puzzle';
import * as  Piece from './piece';
import * as Structure from './structure';
import * as Canvas from './canvas';
const Manufacturer = require('./manufacturer');
import * as Metadata from './metadata';
import * as SpatialMetadata from './spatial-metadata';
import * as shuffler from './shuffler';
import * as outline from './outline';
import * as dragMode from './drag-mode';
import * as connector from './connector';
const Dummy = require('./dummy-painter');
const Konva = require('./konva-painter');

const {InsertSequence, ...generators} = require('./sequence');

export const painters = { Dummy, Konva }

export {
  vector,
  Puzzle,
  Piece,
  Canvas,
  Manufacturer,
  InsertSequence,
  pair,
  Metadata,
  SpatialMetadata,
  Structure,
  shuffler,
  generators,
  outline,
  dragMode,
  connector
}