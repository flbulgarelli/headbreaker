/**
 * An Anchor is a mutable 2D point that
 * is used to locate pieces and pieces inserts
 */
declare class Anchor {
    constructor(x: number, y: number);
    equal(other: Anchor): boolean;
    isAt(x: number, y: number): boolean;
    /**
     * Creates a translated copy of this Anchor
     * according to a vector
     */
    translated(dx: number, dy: number): Anchor;
    /**
     * Translates this anchor given to a vector
     */
    translate(dx: number, dy: number): void;
    /**
     * Answers whether this Anchor is near to another given a tolerance
     * @param tolerance - the max distance within its radius is considered to be "close"
     */
    closeTo(other: Anchor, tolerance: number): boolean;
    copy(): Anchor;
    /**
     * Calculates the difference between this anchor and another
     */
    diff(other: Anchor): Pair;
    /**
     * Converts this anchor into a point
     */
    asPair(): Pair;
    /**
     * Converts this anchor into a vector
     */
    asVector(): Vector;
    export(): Vector;
    static atRandom(maxX: number, maxY: number): Anchor;
    static import(vector: Vector): Anchor;
}

/**
 * Creates a new {@link Anchor}
 */
declare function anchor(x: number, y: number): Anchor;

declare type Label = any;

declare type Figure = {
    shape: Shape;
    group: Group;
    label?: Label;
};

/**
 * @param piece - the connecting piece
 * @param figure - the visual representation of the connecting piece
 * @param targetPiece - the target connected piece
 * @param targetFigure - the visual representation of the target connected
 */
declare type CanvasConnectionListener = (piece: Piece, figure: Figure, targetPiece: Piece, targetFigure: Figure) => void;

/**
 * @param piece - the translated piece
 * @param figure - the visual representation of the translated piece
 * @param dx - the horizontal displacement
 * @param dy - the vertical displacement
 */
declare type CanvasTranslationListener = (piece: Piece, figure: Figure, dx: number, dy: number) => void;

declare type LabelMetadata = {
    text?: string;
    fontSize?: number;
    x?: number;
    y?: number;
};

declare type CanvasMetadata = {
    id?: string;
    targetPosition?: Vector;
    currentPosition?: Vector;
    color?: string;
    strokeColor?: string;
    image?: ImageLike;
    label?: LabelMetadata;
};

declare type Template = {
    structure: StructureLike;
    metadata: CanvasMetadata;
};

/**
 * An HTML graphical area where puzzles and pieces can be rendered. No assumption of the rendering backend is done - it may be
 * and be a plain HTML SVG or canvas element, or a higher-level library - and this task is fully delegated to {@link Painter}
 * @param id - the html id of the element where to place the canvas
 * @param [options.borderFill] - the broder fill of the pieces, expresed in pixels. 0 means no border fill, 0.5 * pieceSize means full fill
 * @param [options.lineSoftness] - how soft the line will be
 * @param [options.image] - an optional background image for the puzzle that will be split across all pieces.
 * @param [options.painter] - the Painter object used to actually draw figures in canvas
 */
declare class Canvas {
    constructor(id: string, options: {
        width: number;
        height: number;
        pieceSize?: Vector | number;
        proximity?: number;
        borderFill?: Vector | number;
        strokeWidth?: number;
        strokeColor?: string;
        lineSoftness?: number;
        image?: ImageLike;
        painter?: Painter;
    });
    _painter: Painter;
    _puzzle: Puzzle;
    figures: {
        [key: string]: Figure;
    };
    templates: {
        [key: string]: Template;
    };
    /**
     * Creates and renders a piece using a template, that is ready to be rendered by calling {@link Canvas#draw}
     */
    sketchPiece(options: Template): void;
    /**
     * Renders a previously created piece object
     */
    renderPiece(piece: Piece): void;
    /**
     * Renders many previously created piece objects
     */
    renderPieces(pieces: Piece[]): void;
    /**
     * Renders a previously created puzzle object. This method
     * overrides this canvas' {@link Canvas#pieceDiameter} and {@link Canvas#proximity}
     */
    renderPuzzle(puzzle: Puzzle): void;
    /**
     * Automatically creates and renders pieces given some configuration paramters
     * @param [options.metadata] - optional list of metadata that will be attached to each generated piece
     */
    autogenerate(options: {
        horizontalPiecesCount?: number;
        verticalPiecesCount?: number;
        insertsGenerator?: InsertsGenerator;
        metadata?: CanvasMetadata[];
    }): void;
    autogenerateWithManufacturer(manufacturer: Manufacturer): void;
    /**
     * Creates a name piece template, that can be later instantiated using {@link Canvas#sketchPieceUsingTemplate}
     */
    defineTemplate(name: string, template: Template): void;
    /**
     * Creates a new Piece with given id using a named template
     * defined with {@link Canvas#defineTemplate}
     */
    sketchPieceUsingTemplate(id: string, templateName: string): void;
    /**
     * @param farness - from 0 to 1, how far pieces will be placed from x = pieceDiameter.x, y = pieceDiameter.y
     */
    shuffle(farness?: number): void;
    /**
     * Draws this canvas for the first time
     */
    draw(): void;
    /**
     * Re-draws this canvas. This method is useful when the canvas {@link Figure}s have
     * being modified and you need changes to become visible
     */
    redraw(): void;
    /**
     * Clears the canvas, clearing the rendering backend and discarding all the created templates, figures, and pieces
     */
    clear(): void;
    /**
     * Sets a validator for the canvas' puzzle. Only one validator
     * can be attached, so subsequent calls of this method will override the previously
     * attached validator
     */
    attachValidator(validator: Validator): void;
    /**
     * Sets a validator that will report when puzzle has been solved,
     * overriding any previously configured validator
     */
    attachSolvedValidator(): void;
    /**
     * Sets a validator that will report when puzzle pieces are in their expected relative
     * positions, overriding any previously configured validator
     */
    attachRelativePositionValidator(): void;
    /**
     * Sets a validator that will report when puzzle are at the expected given
     * relative refs
     */
    attachRelativeRefsValidator(expected: any): void;
    /**
     * Sets a validator that will report when puzzle pieces are in their expected absolute
     * positions, overriding any previously configured validator
     */
    attachAbsolutePositionValidator(): void;
    /**
     * Registers a listener for connect events
     */
    onConnect(f: CanvasConnectionListener): void;
    /**
     * Registers a listener for disconnect events
     */
    onDisconnect(f: CanvasConnectionListener): void;
    onTranslate(f: CanvasTranslationListener): void;
    onValid(f: ValidationListener): void;
    /**
     * Returns the current validation status
     */
    valid: boolean;
    /**
     * Answers the visual representation for the given piece.
     * This method uses piece's id.
     */
    getFigure(piece: Piece): Figure;
    /**
     * Answers the visual representation for the given piece id.
     */
    getFigureById(id: string): Figure;
    /**
     * Sets the new width and height of the canvas
     */
    resize(width: number, height: number): void;
    _annotatePiecePosition(piece: Piece): void;
    /**
     * Configures updates from piece into group
     */
    _bindGroupToPiece(group: Group, piece: Piece): void;
    /**
     * * Configures updates from group into piece
     */
    _bindPieceToGroup(piece: Piece, group: Group): void;
    _imageMetadataFor(piece: Piece): ImageMetadata;
    _newPiece(structureLike: StructureLike, metadata: CanvasMetadata): void;
    pieceRadio: Vector;
    /**
     * The puzzle rendered by this canvas
     */
    puzzle: Puzzle;
    settings: Settings;
}

declare interface DummyPainter extends Painter {
}

/**
 * A {@link Painter} for testing purpouses that does not perform rendering
 */
declare class DummyPainter implements Painter {
    initialize(canvas: Canvas, id: string): void;
    draw(canvas: Canvas): void;
    sketch(canvas: Canvas, _piece: Piece, _figure: Figure): void;
}

declare type ImageMetadata = {
    content: HTMLImageElement;
    offset?: Vector;
    scale?: number;
};

declare type ImageLike = HTMLImageElement | ImageMetadata;

declare module "ImageMetadata" {
    /**
     * Converts an image-like object into a true {@link ImageMetadata} object
     */
    function asImageMetadata(imageLike: ImageLike): ImageMetadata;
}

declare module "headbreaker" { }

/**
 * A connection element of a piece
 */
declare type Insert = Tab | Slot | None;

declare interface KonvaPainter extends Painter {
}

/**
 * A {@link Painter} that uses Konva.js as rendering backend
 */
declare class KonvaPainter implements Painter {
    initialize(canvas: Canvas, id: string): void;
    draw(canvas: Canvas): void;
    reinitialize(canvas: Canvas): void;
    resize(canvas: Canvas, width: number, height: number): void;
    sketch(canvas: Canvas, piece: Piece, figure: Figure): void;
    label(_canvas: Canvas, piece: Piece, figure: Figure): void;
    physicalTranslate(_canvas: Canvas, group: Group, piece: Piece): void;
    logicalTranslate(_canvas: Canvas, piece: Piece, group: any): void;
    onDrag(_canvas: Canvas, piece: Piece, group: Group, f: VectorAction): void;
    onDragEnd(_canvas: Canvas, _piece: Piece, group: Group, f: Action): void;
}

declare type Figure = {
    shape: Shape;
    group: Group;
    label?: Label;
};

declare type Group = Group;

declare class Manufacturer {
    headAnchor: Anchor;
    /**
     * Attach metadata to each piece
     * @param metadata - list of metadata that will be attached to each generated piece
     */
    withMetadata(metadata: object[]): void;
    withInsertsGenerator(generator: InsertsGenerator): void;
    /**
     * Sets the central anchor. If not specified, puzzle will be positioned
     * at the distance of a whole piece from the origin
     */
    withHeadAt(anchor: Anchor): void;
    /**
     * If nothing is configured, default Puzzle structured is assumed
     */
    withStructure(structure: Settings): void;
    withDimmensions(width: number, height: number): void;
    build(): Puzzle;
    _annotateAll(pieces: Piece[]): void;
    _annotate(piece: Piece, index: number): void;
    _buildPiece(puzzle: Puzzle, horizontalSequence: InsertSequence, verticalSequence: InsertSequence): void;
}

declare class Positioner {
    constructor(puzzle: Puzzle, headAnchor: Anchor);
    initializeOffset(headAnchor: Anchor): void;
    offset: Vector;
    naturalAnchor(x: number, y: number): void;
}

/**
 * This module exposes metadata-handling functions you can override to have better performance
 */
declare module "Metadata" {
    /**
     * Copies a metadata object. The default implementation uses {@link JSON#parse}. Override it to have better performance
     */
    function copy(metadata: T): T;
}

/**
 * This module contains the draw function. Override it change pieces drawing strategy
 */
declare module "Outline" {
    function select(insert: Insert, t: number, s: number, n: number): void;
    function draw(piece: Piece, size?: Vector | number, borderFill?: Vector | number): number[];
}

declare type VectorAction = (dx: number, dy: number) => void;

declare type Action = () => void;

/**
 * An interface for a a rendering backend for a {@link Canvas}, that can be implemented in
 * order to create UI representations of a puzzle.
 */
declare interface Painter {
    resize(canvas: Canvas, width: number, height: number): void;
    /**
     * Creates the rendering backend, initializig all its contents.
     * After this call, painter is ready to receive any other messages
     */
    initialize(canvas: Canvas, id: string): void;
    /**
     * Recreates the rendering backend, clearing all its contents
     * After this call, painter is ready to receive any other messages
     * as it had been just initialized.
     */
    reinitialize(canvas: Canvas): void;
    /**
     * Draws the canvas figures in the rendering backend
     */
    draw(canvas: Canvas): void;
    /**
     * Adds a piece to the rendering backend, so that it is ready to be drawn
     * @param figure - the rendering backend information for this piece. This method may mutate it if necessary
     */
    sketch(canvas: Canvas, piece: Piece, figure: Figure): void;
    /**
     * Adds piece's label to the given figure in the rendering backend
     * @param figure - the rendering backend information for this piece. This method may mutate it if necessary
     */
    label(canvas: Canvas, piece: Piece, figure: Figure): void;
    /**
     * Translates th given piece
     */
    physicalTranslate(canvas: Canvas, group: Group, piece: Piece): void;
    logicalTranslate(canvas: Canvas, piece: Piece, group: Group): void;
    /**
     * Registers a drag-start callback
     */
    onDrag(canvas: Canvas, piece: Piece, group: Group, f: VectorAction): void;
    /**
     * Registers a drag-end callback
     */
    onDragEnd(canvas: Canvas, piece: Piece, group: Group, f: Action): void;
}

/**
 * Utilities for handling 2D vectors, expressed a two-elements list
 */
declare module "Pair" {
    /**
     * Tells whether this pair is (0, 0)
     */
    function isNull(x: number, y: number): boolean;
    function equal(x1: number, y1: number, x2: number, y2: number): boolean;
    /**
     * Calculates the difference of two vectors
     */
    function diff(x1: number, y1: number, x2: number, y2: number): Pair;
}

declare type TranslationListener = (piece: Piece, dx: number, dy: number) => void;

declare type ConnectionListener = (piece: Piece, target: Piece) => void;

/**
 * A piece primitive representation that can be easily stringified, exchanged and persisted
 */
declare type PieceDump = {
    centralAnchor: Vector;
    structure: string;
    connections?: Orthogonal<object>;
    metadata: any;
};

/**
 * A jigsaw piece
 */
declare class Piece {
    constructor(options?: Structure);
    centralAnchor: Anchor;
    translateListeners: TranslationListener[];
    connectListeners: ConnectionListener[];
    disconnectListeners: ConnectionListener[];
    /**
     * Adds unestructured user-defined metadata on this piece.
     */
    annotate(metadata: any): void;
    /**
     * Sets unestructured user-defined metadata on this piece.
     *
     * This object has no strong requirement, but it is recommended to have an
     * id property.
     */
    reannotate(metadata: any): void;
    belongTo(puzzle: any): void;
    presentConnections: Piece[];
    connections: Piece[];
    inserts: Insert[];
    /**
     * @param f - the callback
     */
    onTranslate(f: TranslationListener): void;
    /**
     * @param f - the callback
     */
    onConnect(f: ConnectionListener): void;
    /**
     * @param f - the callback
     */
    onDisconnect(f: ConnectionListener): void;
    fireTranslate(dx: number, dy: number): void;
    fireConnect(other: Piece): void;
    fireDisconnect(others: Piece[]): void;
    connectVerticallyWith(other: Piece, back?: boolean): void;
    attractVertically(other: Piece): void;
    connectHorizontallyWith(other: Piece, back?: boolean): void;
    attractHorizontally(other: Piece): void;
    tryConnectWith(other: Piece, back?: boolean): void;
    tryConnectHorizontallyWith(other: Piece, back?: boolean): void;
    tryConnectVerticallyWith(other: Piece, back?: boolean): void;
    upConnection: Piece;
    leftConnection: Piece;
    /**
     * Sets the centralAnchor for this piece.
     */
    centerAround(anchor: Anchor): void;
    /**
     * Sets the initial position of this piece. This method is similar to {@link Piece#centerAround},
     * but takes a pair instead of an anchor.
     */
    locateAt(x: number, y: number): void;
    /**
     * Tells whether this piece central anchor is at given point
     */
    isAt(x: number, y: number): boolean;
    /**
     * Moves this piece to the given position, firing translation events.
     * Piece must be already centered.
     * @param anchor - the new central anchor
     * @param [quiet = false] - indicates whether events should be suppressed
     */
    recenterAround(anchor: Anchor, quiet?: boolean): void;
    /**
     * Moves this piece to the given position, firing translation events.
     * Piece must be already centered. This method is similar to {@link Piece#recenterAround},
     * but takes a pair instead of an anchor.
     * @param x - the final x position
     * @param y - the final y position
     * @param [quiet = false] - indicates whether events should be suppressed
     */
    relocateTo(x: number, y: number, quiet?: boolean): void;
    /**
     * Move this piece a given distance, firing translation events
     * @param dx - the x distance
     * @param dy - the y distance
     * @param [quiet = false] - indicates whether events should be suppressed
     */
    translate(dx: number, dy: number, quiet?: boolean): void;
    push(dx: number, dy: number, quiet?: boolean, pushedPieces?: Piece[]): void;
    drag(dx: number, dy: number): void;
    vericallyOpenMovement(dy: number): boolean;
    horizontallyOpenMovement(dx: number): boolean;
    canConnectHorizontallyWith(other: Piece): boolean;
    canConnectVerticallyWith(other: Piece): boolean;
    verticallyCloseTo(other: Piece): boolean;
    horizontallyCloseTo(other: Piece): boolean;
    verticallyMatch(other: Piece): boolean;
    horizontallyMatch(other: Piece): boolean;
    downAnchor: Anchor;
    rightAnchor: Anchor;
    upAnchor: Anchor;
    leftAnchor: Anchor;
    radio: Vector;
    proximity: number;
    /**
     * This piece id. It is extracted from metadata
     */
    id: string;
    /**
     * Converts this piece into a plain, stringify-ready object.
     * Connections should have ids
     */
    export(options: {
        compact?: boolean;
    }): PieceDump;
    /**
     * Converts this piece back from a dump. Connections are not restored. {@link Puzzle#autoconnect} method should be used
     * after importing all them
     */
    static import(dump: PieceDump): Piece;
}

declare type Orthogonal = {
    up: A;
    down: A;
    left: A;
    right: A;
};

declare type Mapper = (value: A) => B;

/**
 * Misc generic functions
 */
declare module "Prelude" {
    function pivot(one: T, other: T, back?: boolean): any;
    function orthogonalMap(values: A[], mapper: Mapper<A, B>, replacement: A): B[];
    function orthogonalTransform(values: A[], mapper: Mapper<A, B>, replacement: A): Orthogonal<B>;
    function itself(arg: A): A;
}

/**
 * A puzzle primitive representation that can be easily stringified, exchanged and persisted
 */
declare type PuzzleDump = {
    pieceRadio: Vector;
    proximity: number;
    pieces: PieceDump[];
};

declare type Settings = {
    pieceRadio?: Vector | number;
    proximity?: number;
};

/**
 * A set of a {@link Piece}s that can be manipulated as a whole, and that can be
 * used as a pieces factory
 */
declare class Puzzle {
    constructor(options?: Settings);
    pieces: Piece[];
    validator: Validator;
    /**
     * Creates and adds to this puzzle a new piece
     * @param [options] - the piece structure
     * @returns the new piece
     */
    newPiece(options?: Structure): Piece;
    addPiece(piece: Piece): void;
    addPieces(pieces: Piece[]): void;
    /**
     * Annotates all the pieces with the given list of metadata
     */
    annotate(metadata: object[]): void;
    /**
     * Relocates all the pieces to the given list of points
     */
    relocateTo(points: Pair[]): void;
    /**
     * Tries to connect pieces in their current positions
     * This method is O(n^2)
     */
    autoconnect(): void;
    /**
     * Disconnects all pieces
     */
    disconnect(): void;
    /**
     * Tries to connect the given piece to the rest of the set
     * This method is O(n)
     */
    autoconnectWith(piece: Piece): void;
    shuffle(maxX: number, maxY: number): void;
    translate(dx: number, dy: number): void;
    onTranslate(f: TranslationListener): void;
    onConnect(f: ConnectionListener): void;
    onDisconnect(f: ConnectionListener): void;
    onValid(f: ValidationListener): void;
    /**
     * Answers the list of points where
     * central anchors of pieces are located
     */
    points: Pair[];
    /**
     * Answers a list of points whose coordinates are scaled
     * to the {@link Puzzle#pieceWidth}
     */
    refs: Pair[];
    metadata: any[];
    /**
     * Returns the first piece
     */
    head: Piece;
    /**
     * Returns the central anchor of the first piece
     */
    headAnchor: Anchor;
    attachValidator(validator: Validator): void;
    /**
     * Checks whether this puzzle is valid.
     *
     * Calling this method will not fire any validation listeners nor update the
     * valid property.
     */
    isValid(): boolean;
    /**
     * Returns the current validation status
     *
     * Calling this property will not fire any validation listeners.
     */
    valid: boolean;
    /**
     * Checks whether this puzzle is valid, updating valid property
     * and firing validation listeners if becomes valid
     */
    validate(): void;
    /**
     * Checks whether this puzzle is valid, updating valid property.
     *
     * Validations listeners are NOT fired.
     */
    updateValidity(): void;
    /**
     * Wether all the pieces in this puzzle are connected
     */
    connected: boolean;
    /**
     * The piece width, from edge to edge.
     * This is the double of the {@link Puzzle#pieceRadio}
     */
    pieceDiameter: Vector;
    /**
     * Converts this piece into a plain, stringify-ready object.
     * Pieces should have ids
     * @param options - config options for export
     * @param [options.compact] - if connection information must be omitted
     */
    export(options: {
        compact?: boolean;
    }): PuzzleDump;
    static import(dump: PuzzleDump): Puzzle;
}

/**
 * A function for generating {@link Insert}s sequentially
 * @param index - the position of the element to be generated in the sequence
 */
declare type InsertsGenerator = (index: number) => Insert;

/**
 * This module exports several {@link Insert}s sequences strategies: {@link fixed}, {@link flipflop}, {@link twoAndTwo} and {@link random}
 */
declare module "sequence" {
    function fixed(): void;
    /**
     * Generates slots and tabs alternately
     */
    function flipflop(): void;
    /**
     * Generates sequences of two slots and then two tabs
     */
    function twoAndTwo(): void;
    /**
     * Generates tabs and slots in a psuedo-random way
     */
    function random(): void;
    /**
     * An InsertSequence is a statefull object that
     * allows to generate {@link Insert}s sequences using an {@link InsertsGenerator} as strategy
     * @param generator - the generator used by this sequence to produce inserts
     */
    class InsertSequence {
        constructor(generator: InsertsGenerator);
        /**
         * The previously generated insert
         */
        previousComplement(): Insert;
        /**
         * Answers the last Insert generated by {@link InsertSequence#next}
         */
        current(): Insert;
        next(): Insert;
    }
}

declare type SpatialMetadata = {
    targetPosition?: Vector;
    currentPosition?: Vector;
};

/**
 * Functions for handling spatial metadata
 * and pieces and puzzles that are annotated with it
 */
declare module "SpatialMetadata" {
    function diffToTarget(piece: Piece): void;
    function solved(): void;
    function relativePosition(): void;
    function absolutePosition(): void;
    function initialize(metadata: SpatialMetadata, target: Vector, current?: Vector): void;
}

declare type Structure = {
    up?: Insert;
    left?: Insert;
    down?: Insert;
    right?: Insert;
};

declare module "Structure" {
    function serialize(structure: Structure): string;
    function deserialize(string: string): Structure;
    type StructureLike = Structure | string;
    function asStructure(structureLike: StructureLike): Structure;
}

declare type Validator = PieceValidator | PuzzleValidator | NullValidator;

declare type ValidationListener = (puzzle: Puzzle) => void;

declare class AbstractValidator {
    validListeners: ValidationListener[];
    /**
     * Validates the puzzle, updating the validity state and
     * firing validation events
     */
    validate(puzzle: Puzzle): void;
    /**
     * Updates the valid state.
     */
    updateValidity(puzzle: Puzzle): void;
    fireValid(puzzle: Puzzle): void;
    /**
     * Registers a validation listener
     */
    onValid(f: ValidationListener): void;
    /**
     * Answers the current validity status of this validator. This
     * property neither alters the current status nor triggers new validity checks
     */
    valid: boolean;
    /**
     * Answers wether this is the {@link NullValidator}
     */
    isNull: boolean;
}

declare type PieceCondition = (puzzle: Piece) => boolean;

declare type PuzzleCondition = (puzzle: Puzzle) => boolean;

/**
 * A validator that evaluates each piece independently
 */
declare class PieceValidator {
    constructor(f: PieceCondition);
    isValid(puzzle: Puzzle): boolean;
}

/**
 * A validator that evaluates the whole puzzle
 */
declare class PuzzleValidator {
    constructor(f: PuzzleCondition);
    isValid(puzzle: Puzzle): void;
    static connected(): void;
    /**
     * @param expected - the expected relative refs
     */
    static relativeRefs(expected: Pair[]): PuzzleCondition;
}

/**
 * A validator that always is invalid
 */
declare class NullValidator {
    isValid(puzzle: Puzzle): void;
    isNull: boolean;
}

declare type Vector = {
    x: number;
    y: number;
};

declare function vector(x: number, y: number): Vector;

declare function cast(value: Vector | number): Vector;

/**
 * This module contains functions for dealing with objects with x and y
 * coordinates that represent or include point data
 */
declare module "Vector" {
    /**
     * Returns a new (0, 0) vector
     */
    function origin(): Vector;
    /**
     * Compares two points
     */
    function equal(one: Vector, other: Vector): boolean;
    /**
     * Creates a copy of the given point
     */
    function copy(one: Vector): Vector;
    function update(vector: Vector, x: any, y: any): void;
    /**
     * @returns ;
     */
    function diff(one: Vector, other: Vector): Pair;
    function multiply(one: Vector | number, other: Vector | number): Vector;
    function divide(one: Vector | number, other: Vector | number): Vector;
}

