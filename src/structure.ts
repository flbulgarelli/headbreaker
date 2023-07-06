import { Slot, Tab, None, Insert } from './insert';
import { orthogonalMap } from './prelude';

export interface Structure {
  up?: Insert;
  left?: Insert;
  down?: Insert;
  right?: Insert;
}

/**
 * @module Structure
 */

/**
 * @private
 * @param {string} insert
 * @returns {Insert}
 */
function parseInsert(insert: string): Insert {
  return insert === 'S' ? Slot : insert === 'T' ? Tab : None;
}

/**
 *
 * @param {Structure} structure
 * @returns {string}
 */
function serialize(structure: Structure): string {
  return orthogonalMap([structure.right, structure.down, structure.left, structure.up], it => it.serialize(), None).join('');
}

/**
 *
 * @param {string} string
 * @returns {Structure}
 */
function deserialize(string: string): Structure {

  if (string.length !== 4) {
    throw new Error("structure string must be 4-chars long");
  }

  return {
    right: parseInsert(string[0]),
    down: parseInsert(string[1]),
    left: parseInsert(string[2]),
    up: parseInsert(string[3]),
  };
}

export type StructureLike = Structure | string;

/**
 * @param {StructureLike} structureLike
 * @returns {Structure}
 */
function asStructure(structureLike: StructureLike): Structure {
  if (typeof(structureLike) === 'string') {
    return deserialize(structureLike);
  }
  return structureLike;
}

export default {
  serialize,
  deserialize,
  asStructure,
}