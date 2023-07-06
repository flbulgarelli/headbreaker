require('mocha');
const assert = require('assert');
const {anchor, Puzzle, Manufacturer, PuzzleValidator, PieceValidator, SpatialMetadata} = require('../src/index');

describe("SpatialMetadata", () => {
  /** @type {Puzzle} */
  let puzzle;
  describe("standard validators", () => {
    beforeEach(() => {
      const manufacturer = new Manufacturer();
      manufacturer.withDimensions(2, 2);
      manufacturer.withStructure({pieceRadius: 10, proximity: 1});
      manufacturer.withHeadAt(anchor(0, 0));
      puzzle = manufacturer.build();

      puzzle.annotate(puzzle.pieces.map(it => ({
        targetPosition: it.centralAnchor.asVector()
      })));
    });

    it("connected validator", () => {
      puzzle.disconnect();
      const validator = new PuzzleValidator(PuzzleValidator.connected);
      assert.equal(validator.isValid(puzzle), false);

      puzzle.autoconnect();
      assert.equal(validator.isValid(puzzle), true);
    })

    describe("relative-position validator", () => {
      it("works when postions are exact", () => {
        const validator = new PuzzleValidator(SpatialMetadata.relativePosition);
        assert.equal(validator.isValid(puzzle), true);

        puzzle.translate(10, 23);
        assert.equal(validator.isValid(puzzle), true);

        puzzle.shuffle(200, 200);
        assert.equal(validator.isValid(puzzle), false);
      })

      it("works when postions not are exact", () => {
        const validator = new PuzzleValidator(SpatialMetadata.relativePosition);
        assert.equal(validator.isValid(puzzle), true);

        puzzle.translate(10.33333333333333333331, 23.33333333333333333331);
        assert.equal(validator.isValid(puzzle), true);

        puzzle.shuffle(200, 200);
        assert.equal(validator.isValid(puzzle), false);
      })
    })

    it("absolute-position validator", () => {
      const validator = new PieceValidator(SpatialMetadata.absolutePosition);
      assert.equal(validator.isValid(puzzle), true);

      puzzle.translate(10, 23)
      assert.equal(validator.isValid(puzzle), false);

      puzzle.shuffle(200, 200);
      assert.equal(validator.isValid(puzzle), false);
    })


    it("solved validator", () => {
      const validator = new PuzzleValidator(SpatialMetadata.solved);
      puzzle.autoconnect();
      assert.equal(validator.isValid(puzzle), true);

      puzzle.translate(10, 23)
      assert.equal(validator.isValid(puzzle), true);

      puzzle.disconnect()
      assert.equal(validator.isValid(puzzle), false);

      puzzle.autoconnect()
      puzzle.shuffle(200, 200);
      assert.equal(validator.isValid(puzzle), false);
    })
  })
})
