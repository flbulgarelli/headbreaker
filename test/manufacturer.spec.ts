const assert = require('assert');
import {Tab, Slot, None, anchor, Manufacturer, generators} from '../src/index';

describe("manufacturer", () => {
  it("create 1 x 1", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(1, 1);
    manufacturer.withStructure({pieceRadius: 10, proximity: 1});
    const puzzle = manufacturer.build();
    const first = puzzle.pieces[0];

    assert.equal(puzzle.pieces.length, 1);

    assert.equal(first.up, None);
    assert.equal(first.right, None);
    assert.equal(first.down, None);
    assert.equal(first.left, None);

    assert.equal(first.radius.x, 10);
    assert.equal(first.radius.y, 10);
    assert.equal(first.proximity, 1);

    assert.deepEqual(first.centralAnchor, anchor(20, 20));

  })

  it("create 1 x 1 with central anchor", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(1, 1);
    manufacturer.withStructure({pieceRadius: 10, proximity: 1});
    manufacturer.withHeadAt(anchor(-3, 5));
    const puzzle = manufacturer.build();

    assert.equal(puzzle.pieces.length, 1);
    assert.deepEqual(puzzle.head.centralAnchor, anchor(-3, 5));
  })

  it("create 2 x 1", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(2, 1);
    manufacturer.withStructure({pieceRadius: 10, proximity: 1});
    const puzzle = manufacturer.build();

    const first = puzzle.pieces[0];
    const second = puzzle.pieces[1];

    assert.equal(puzzle.pieces.length, 2);

    assert.equal(first.up, None);
    assert.equal(first.right, Tab);
    assert.equal(first.down, None);
    assert.equal(first.left, None);

    assert.equal(second.up, None);
    assert.equal(second.right, None);
    assert.equal(second.down, None);
    assert.equal(second.left, Slot);

    assert.deepEqual(first.centralAnchor, anchor(20, 20));
    assert.deepEqual(second.centralAnchor, anchor(40, 20));
  })

  it("create 3 x 1", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(3, 1);
    const puzzle = manufacturer.build();

    const [first, second, third] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 3);

    assert.equal(first.up, None);
    assert.equal(first.right, Tab);
    assert.equal(first.down, None);
    assert.equal(first.left, None);

    assert.equal(second.up, None);
    assert.equal(second.right, Tab);
    assert.equal(second.down, None);
    assert.equal(second.left, Slot);

    assert.equal(third.up, None);
    assert.equal(third.right, None);
    assert.equal(third.down, None);
    assert.equal(third.left, Slot);

    assert.deepEqual(first.centralAnchor, anchor(4, 4));
    assert.deepEqual(second.centralAnchor, anchor(8, 4));
    assert.deepEqual(third.centralAnchor, anchor(12, 4));
  })

  it("create 1 x 2", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(1, 2);
    const puzzle = manufacturer.build();

    const [first, second] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 2);

    assert.equal(first.up, None);
    assert.equal(first.right, None);
    assert.equal(first.down, Tab);
    assert.equal(first.left, None);

    assert.equal(second.up, Slot);
    assert.equal(second.right, None);
    assert.equal(second.down, None);
    assert.equal(second.left, None);

    assert.deepEqual(first.centralAnchor, anchor(4, 4));
    assert.deepEqual(second.centralAnchor, anchor(4, 8));
  })

  it("create 3 x 2", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(3, 2);
    const puzzle = manufacturer.build();

    const [a, b, c, d, e, f] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 6);

    assert.equal(a.up, None);
    assert.equal(a.right, Tab);
    assert.equal(a.down, Tab);
    assert.equal(a.left, None);

    assert.equal(b.up, None);
    assert.equal(b.right, Tab);
    assert.equal(b.down, Tab);
    assert.equal(b.left, Slot);

    assert.equal(c.up, None);
    assert.equal(c.right, None);
    assert.equal(c.down, Tab);
    assert.equal(c.left, Slot);

    assert.equal(d.up, Slot);
    assert.equal(d.right, Tab);
    assert.equal(d.down, None);
    assert.equal(d.left, None);

    assert.equal(e.up, Slot);
    assert.equal(e.right, Tab);
    assert.equal(e.down, None);
    assert.equal(e.left, Slot);

    assert.equal(f.up, Slot);
    assert.equal(f.right, None);
    assert.equal(f.down, None);
    assert.equal(f.left, Slot);
  })

  it("create 2 x 2 with rectangular pieces", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(2, 2);
    manufacturer.withStructure({pieceRadius: {x:  2, y: 3}})
    const puzzle = manufacturer.build();

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 4);

    assert.equal(a.up, None);
    assert.equal(a.right, Tab);
    assert.equal(a.down, Tab);
    assert.equal(a.left, None);

    assert.equal(b.up, None);
    assert.equal(b.right, None);
    assert.equal(b.down, Tab);
    assert.equal(b.left, Slot);

    assert.equal(c.up, Slot);
    assert.equal(c.right, Tab);
    assert.equal(c.down, None);
    assert.equal(c.left, None);

    assert.equal(d.up, Slot);
    assert.equal(d.right, None);
    assert.equal(d.down, None);
    assert.equal(d.left, Slot);

    assert.deepEqual(a.centralAnchor, anchor(4, 6));
    assert.deepEqual(b.centralAnchor, anchor(8, 6));
    assert.deepEqual(c.centralAnchor, anchor(4, 12));
    assert.deepEqual(d.centralAnchor, anchor(8, 12));
  })

  it("create 6 x 1 with flip flop", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(6, 1);
    manufacturer.withInsertsGenerator(generators.flipflop);
    const puzzle = manufacturer.build();
    const [a, b, c, d, e, f, g] = puzzle.pieces;

    assert.equal(puzzle.pieces.length, 6);

    assert.equal(a.right, Tab);
    assert.equal(b.right, Slot);
    assert.equal(c.right, Tab);
    assert.equal(d.right, Slot);
    assert.equal(e.right, Tab);
    assert.equal(f.right, None);

    assert.equal(a.left, None);
    assert.equal(b.left, Slot);
    assert.equal(c.left, Tab);
    assert.equal(d.left, Slot);
    assert.equal(e.left, Tab);
    assert.equal(f.left, Slot);
  })


  it("create 2 x 2 without metadata", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(2, 2);
    const puzzle = manufacturer.build();

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(a.metadata.id, 1);
    assert.equal(b.metadata.id, 2);
    assert.equal(c.metadata.id, 3);
    assert.equal(d.metadata.id, 4);
  })

  it("create 2 x 2 with metadata", () => {
    const manufacturer = new Manufacturer();
    manufacturer.withDimensions(2, 2);
    manufacturer.withMetadata([{foo: 'a'}, {foo: 'b'}, {foo: 'c'}, {id: 'X'}]);
    const puzzle = manufacturer.build();

    const [a, b, c, d] = puzzle.pieces;

    assert.equal(a.metadata.id, 1);
    assert.equal(a.metadata.foo,  'a');
    assert.equal(b.metadata.id, 2);
    assert.equal(b.metadata.foo, 'b');
    assert.equal(c.metadata.id, 3);
    assert.equal(c.metadata.foo, 'c');
    assert.equal(d.metadata.id, 'X');
    assert.equal(d.metadata.foo, null);
  })
})
