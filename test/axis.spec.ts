import { describe, assert, test } from 'vitest';
import { vector, Horizontal, Vertical } from '../src/headbreaker/index';

describe('axis', () => {
  test('Horizontal', () => {
    assert.equal(Horizontal.atVector(vector(1, 20)), 1);
  });

  test('Vertical', () => {
    assert.equal(Vertical.atVector(vector(1, 20)), 20);
  });
});
