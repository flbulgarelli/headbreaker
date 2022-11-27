<script src="js/headbreaker.js"></script>
<style>

.form-group {
  margin-top: 15px;
}

#responsive-canvas .konvajs-content canvas,
#offstage-canvas .konvajs-content canvas {
  border: solid !important;
}

#validated-canvas-overlay {
  position:absolute;
  left:0;
  top: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s ease-in-out;
}

#validated-canvas-overlay.active {
  opacity: 1;
}

</style>

# Samples

## Basic

### Code

```javascript
const basic = new headbreaker.Canvas('basic-canvas', { width: 500, height: 300, pieceSize: 50, proximity: 10 });
basic.sketchPiece({
  structure: { right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot },
  metadata: { id: 'a', currentPosition: { x: 50, y: 50 }, color: '#B87D32' }
});
basic.sketchPiece({
  structure: { up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot },
  metadata: { id: 'b', currentPosition: { x: 100, y: 50 }, color: '#B83361' }
});
basic.sketchPiece({
  structure: { up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab },
  metadata: { id: 'g', currentPosition: { x: 100, y: 230 } }
});
// ... more pieces ...
basic.draw();.
```

### Demo

<div id="basic-canvas">
</div>


## Soft lines

### Code

```javascript
const soft = new headbreaker.Canvas('soft-canvas', {
  width: 500, height: 300,
  pieceSize: 50, proximity: 10,
  lineSoftness: 0.2
});
soft.sketchPiece({
  structure: { right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot },
  metadata: { id: 'a', currentPosition: { x: 50, y: 50 }, color: '#B87D32' }
});
// ... more pieces ...
soft.draw();
```

### Demo

<div id="soft-canvas">
</div>


## Rounded lines

### Code

```javascript
const rounded = new headbreaker.Canvas('rounded-canvas', {
  width: 500, height: 300,
  pieceSize: 50,
  outline: new headbreaker.outline.Rounded()
});
rounded.sketchPiece({
  structure: { right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot },
  metadata: { id: 'a', currentPosition: { x: 50, y: 50 }, color: '#B87D32' }
});
// ... more pieces ...
rounded.draw();
```

### Demo

<div id="rounded-canvas">
</div>


## Perfect match

### Code

```javascript
const perfect = new headbreaker.Canvas('perfect-canvas', {
  width: 800, height: 300,
  pieceSize: 100, proximity: 20,
  borderFill: 10,
  strokeWidth: 2, strokeColor: '#00200B',
  lineSoftness: 0.0
});

perfect.sketchPiece({
  structure: { right: headbreaker.Tab, down: headbreaker.Slot },
  metadata: { id: 'a', targetPosition: { x: 100, y: 100 }, color: '#0EC430' }
});
perfect.sketchPiece({
  structure: { right: headbreaker.Slot, left: headbreaker.Slot },
  metadata: { id: 'b', targetPosition: { x: 200, y: 100 }, color: '#098520' }
});
perfect.sketchPiece({
  structure: { down: headbreaker.Tab, left: headbreaker.Tab },
  metadata: { id: 'c', targetPosition: { x: 330, y: 80 }, color: '#04380D' }
});
// ... more pieces ...
perfect.draw();
```


### Demo

<div id="perfect-canvas">
</div>

## Irregular

### Code

```javascript
const irregular = new headbreaker.Canvas('irregular-canvas', {
  proximity: 25,
  width: 500, height: 300,
  outline: new headbreaker.outline.Rounded() });
irregular.sketchPiece({
  structure: { right: headbreaker.Slot, left: headbreaker.Slot },
  metadata: { id: 'a', color: '#B87D32' },
  size: headbreaker.diameter({x: 50, y: 50})
});
// ... more pieces ...
irregular.sketchPiece({
  structure: { up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab },
  metadata: { id: 'd', color: '#A4C234' },
  size: headbreaker.diameter({x: 100, y: 50})
});
// ... more pieces ...
irregular.sketchPiece({
  structure: { up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Tab },
  metadata: { id: 'g', color: '#B83361' },
  size: headbreaker.diameter({x: 50, y: 100})
});

irregular.draw();
```

### Demo

<div id="irregular-canvas">
</div>

## Background

### Code

```javascript
let vangogh = new Image();
vangogh.src = 'static/vangogh.jpg';
vangogh.onload = () => {
  const background = new headbreaker.Canvas('background-canvas', {
    width: 800, height: 650,
    pieceSize: 100, proximity: 20,
    borderFill: 10, strokeWidth: 2,
    lineSoftness: 0.12, image: vangogh,
    // optional, but it must be set in order to activate image scaling
    maxPiecesCount: {x: 5, y: 5}
  });

  background.adjustImagesToPuzzleHeight();
  background.sketchPiece({
    structure: 'TS--',
    metadata: { id: 'a', targetPosition: { x: 100, y: 100 } },
  });
  background.sketchPiece({
    structure: 'SSS-',
    metadata: { id: 'b', targetPosition: { x: 200, y: 100 } },
  });
  // ... more pieces ...
  background.sketchPiece({
    structure: '--TT',
    metadata: { id: 'y', targetPosition: { x: 500, y: 500 }, currentPosition: { x: 570, y: 560 } }
  });
  background.draw();
}
```

### Demo

<div id="background-canvas">
</div>
<div class="form-group">
  <button id="background-shuffle" class="btn btn-primary">Shuffle</button>
  <button id="background-shuffle-grid" class="btn btn-primary">Shuffle Grid</button>
  <button id="background-shuffle-columns" class="btn btn-primary">Shuffle Columns</button>
  <button id="background-solve" class="btn btn-primary">Solve</button>
</div>

## Autogenerated

### Code

```javascript
let xul = new Image();
xul.src = 'static/xul.jpg';
xul.onload = () => {
  const autogen = new headbreaker.Canvas('autogen-canvas', {
    width: 800, height: 650,
    pieceSize: 100, proximity: 20,
    borderFill: 10, strokeWidth: 1.5,
    lineSoftness: 0.18, image: xul,
  });

  autogen.adjustImagesToPuzzleHeight();
  autogen.autogenerate({
    horizontalPiecesCount: 6,
    verticalPiecesCount: 5
  });
  autogen.draw();
}
```

### Demo

<div id="autogen-canvas">
</div>
<div class="form-group">
  <button id="autogen-shuffle" class="btn btn-primary">Shuffle</button>
  <button id="autogen-shuffle-grid" class="btn btn-primary">Shuffle Grid</button>
  <button id="autogen-shuffle-columns" class="btn btn-primary">Shuffle Columns</button>
  <button id="autogen-solve" class="btn btn-primary">Solve</button>
</div>


## Offstage drag prevention

### Code

```javascript
let malharro = new Image();
malharro.src = 'static/malharro.jpg';
malharro.onload = () => {
  const offstage = new headbreaker.Canvas('offstage-canvas', {
    width: 400, height: 400, image: malharro,
    // ... more configs ...
    preventOffstageDrag: true,
    fixed: true
  });

  offstage.adjustImagesToPuzzleHeight();
  offstage.autogenerate({
    horizontalPiecesCount: 3,
    verticalPiecesCount: 3
  });
  offstage.shuffleGrid();
  offstage.draw();
}
```

### Demo

<div id="offstage-canvas">
</div>
<div class="form-group">
  <button id="offstage-solve" class="btn btn-primary">Solve</button>
  <button id="offstage-reframe" class="btn btn-primary">Reframe</button>
</div>

## Randomized positions

### Code

```javascript
let dali = new Image();
dali.src = 'static/dali.jpg';
dali.onload = () => {
  const randomized = new headbreaker.Canvas('randomized-canvas', {
    width: 800, height: 650,
    pieceSize: 100, proximity: 20,
    borderFill: 10, strokeWidth: 2,
    lineSoftness: 0.12, image: dali
  });
  randomized.autogenerate({
    insertsGenerator: headbreaker.generators.flipflop
  });
  randomized.shuffle(0.7);
  randomized.draw();
}
```

### Demo

<div id="randomized-canvas">
</div>

## Labels

### Code

```javascript
const labels = new headbreaker.Canvas('labels-canvas', {
  width: 400, height: 400,
  pieceSize: 80, proximity: 25,
  borderFill: 10, strokeWidth: 2,
  lineSoftness: 0.18,
});

labels.sketchPiece({
  structure: { right: headbreaker.Tab },
  metadata: {
    id: 'tree-kanji',
    color: '#23599E',
    strokeColor: '#18396B',
    label: { text: '木', fontSize: 70, x: -5, y: 5 }
  }
});

labels.sketchPiece({
  structure: { left: headbreaker.Slot },
  metadata: {
    id: 'tree-emoji',
    color: '#EBB34B',
    strokeColor: '#695024',
    label: { text: '🌳', fontSize: 70, x: 5, y: 0 }
  }
});

// ... more pieces ...
labels.shuffle(0.6);
labels.draw();
```

### Demo

<div id="labels-canvas">
</div>

## Sound and visual feedback

#### Code

```javascript
var audio = new Audio('static/connect.wav');
let berni = new Image();
berni.src = 'static/berni.jpg';
berni.onload = () => {
  const sound = new headbreaker.Canvas('sound-canvas', {
    width: 800, height: 650,
    pieceSize: 100, proximity: 20,
    borderFill: 10, strokeWidth: 1.5,
    lineSoftness: 0.18, image: berni,
    strokeColor: 'black'
  });

  sound.adjustImagesToPuzzleHeight();
  sound.autogenerate({
    horizontalPiecesCount: 6,
    insertsGenerator: headbreaker.generators.random
  });

  sound.draw();

  sound.onConnect((_piece, figure, _target, targetFigure) => {
    // play sound
    audio.play();

    // paint borders on click
    // of conecting and conected figures
    figure.shape.stroke('yellow');
    targetFigure.shape.stroke('yellow');
    sound.redraw();

    setTimeout(() => {
      // restore border colors
      // later
      figure.shape.stroke('black');
      targetFigure.shape.stroke('black');
      sound.redraw();
    }, 200);
  });

  sound.onDisconnect((it) => {
    audio.play();
  });
}
```

### Demo

<div id="sound-canvas">
</div>
<div class="form-group">
  <button id="sound-shuffle" class="btn btn-primary">Shuffle</button>
  <button id="sound-shuffle-grid" class="btn btn-primary">Shuffle Grid</button>
  <button id="sound-shuffle-columns" class="btn btn-primary">Shuffle Columns</button>
  <button id="sound-solve" class="btn btn-primary">Solve</button>
</div>


## Dynamic

### Code

```javascript
function updateLabel(piece, figure, delta) {
  piece.metadata.label.text = Number(piece.metadata.label.text) + delta;
  figure.label.text(piece.metadata.label.text);
}

const dynamic = new headbreaker.Canvas('dynamic-canvas', { width: 700, height: 700, pieceSize: 100, proximity: 20,  borderFill: 10, lineSoftness: 0.2, strokeWidth: 0 });
dynamic.defineTemplate('A', {
  structure: 'TTSS', metadata: { label: { text: '0', x: 22 }, color: '#DB7BBF' }
});
dynamic.defineTemplate('B', {
  structure: 'TTTT', metadata: { label: { text: '0', x: 22 }, color: '#438D8F' }
});
dynamic.defineTemplate('C', {
  structure: 'SSSS', metadata: { label: { text: '0', x: 22 }, color: '#DBC967' }
});
// ... more templates ...

dynamic.sketchPieceUsingTemplate('a', 'A');
dynamic.sketchPieceUsingTemplate('b', 'A');
dynamic.sketchPieceUsingTemplate('c', 'B');
dynamic.sketchPieceUsingTemplate('d', 'C');
dynamic.sketchPieceUsingTemplate('e', 'C');
dynamic.sketchPieceUsingTemplate('f', 'D');
dynamic.sketchPieceUsingTemplate('g', 'E');
dynamic.shuffle(0.7);
dynamic.onConnect((piece, figure, target, targetFigure) => {
  updateLabel(piece, figure, 1);
  updateLabel(target, targetFigure, 1);
  dynamic.redraw();
});
dynamic.onDisconnect((piece, figure, target, targetFigure) => {
  updateLabel(piece, figure, -1);
  updateLabel(target, targetFigure, -1);
  dynamic.redraw();
});
dynamic.draw();

```

### Demo


<div id="dynamic-canvas">
</div>

## Persistent

### Code

```javascript
const exportArea = document.getElementById('export-area');

function readDump() {
  return JSON.parse(exportArea.value);
}

function writeDump(dump) {
  exportArea.value = JSON.stringify(dump, null, 2);
}

const persistent = new headbreaker.Canvas('persistent-canvas', { width: 500, height: 400, strokeWidth: 0, borderFill: 4 });
persistent.autogenerate({metadata: [
  {color: '#6F04C7'}, {color: '#0498D1'}, {color: '#16BA0D'}, {color: '#D1A704'}, {color: '#C72C07'},
  {color: '#000000'}, {color: '#6F04C7'}, {color: '#0498D1'}, {color: '#16BA0D'}, {color: '#D1A704'},
  {color: '#C72C07'}, {color: '#000000'}, {color: '#6F04C7'}, {color: '#0498D1'}, {color: '#16BA0D'},
  {color: '#D1A704'}, {color: '#C72C07'}, {color: '#000000'}, {color: '#6F04C7'}, {color: '#0498D1'},
  {color: '#16BA0D'}, {color: '#D1A704'}, {color: '#C72C07'}, {color: '#000000'}, {color: '#6F04C7'}
]});
persistent.draw();

document.getElementById('persistent-import').addEventListener('click', function() {
  persistent.clear();
  persistent.renderPuzzle(headbreaker.Puzzle.import(readDump()));
  persistent.draw();
});

document.getElementById('persistent-export').addEventListener('click', function() {
  writeDump(persistent.puzzle.export({compact: true}));
});
```

<div id="persistent-canvas">
</div>
<div class="form-group">
  <textarea class="form-control" id="export-area" rows="10"></textarea>
</div>
<div class="form-group">
  <button id="persistent-export" class="btn btn-primary">Export</button>
  <button id="persistent-import" class="btn btn-primary">Import</button>
  <button id="persistent-shuffle" class="btn btn-primary">Shuffle</button>
  <button id="persistent-shuffle-grid" class="btn btn-primary">Shuffle Grid</button>
  <button id="persistent-shuffle-columns" class="btn btn-primary">Shuffle Columns</button>
  <button id="persistent-solve" class="btn btn-primary">Solve</button>
</div>

## Validated

### Code

```javascript
let pettoruti = new Image();
pettoruti.src = 'static/pettoruti.jpg';
pettoruti.onload = () => {
  const validated = new headbreaker.Canvas('validated-canvas', {
    width: 800, height: 900,
    pieceSize: 80, proximity: 18,
    borderFill: 8, strokeWidth: 1.5,
    lineSoftness: 0.18, image: pettoruti,
    // used to stick canvas to its current position
    fixed: true
  });
  validated.autogenerate({
    horizontalPiecesCount: 5,
    verticalPiecesCount: 8
  });
  validated.puzzle.pieces[4].translate(63, -56);
  validated.draw();
  validated.attachSolvedValidator();
  validated.onValid(() => {
    setTimeout(() => {
      document.getElementById('validated-canvas-overlay').setAttribute("class", "active");
    }, 1500);
  })
}
```

<div style="position:relative">
  <div id="validated-canvas">
  </div>
  <img id="validated-canvas-overlay" src="static/pettoruti.jpg">
</div>
<div class="form-group">
  <button id="validated-shuffle" class="btn btn-primary">Shuffle</button>
  <button id="validated-shuffle-grid" class="btn btn-primary">Shuffle Grid</button>
  <button id="validated-shuffle-columns" class="btn btn-primary">Shuffle Columns</button>
  <button id="validated-solve" class="btn btn-primary">Solve</button>
</div>


## Responsive

### Code

```javascript
const initialWidth = 800;
const responsive = new headbreaker.Canvas('responsive-canvas', {
  width: 800, height: 650,
  pieceSize: 100, proximity: 20,
  borderFill: 10, strokeWidth: 1.5,
  lineSoftness: 0.18,
});

responsive.autogenerate({
  horizontalPiecesCount: 3,
  verticalPiecesCount: 3,
  metadata: [
    {color: '#6F04C7'}, {color: '#0498D1'}, {color: '#16BA0D'},
    {color: '#000000'}, {color: '#6F04C7'}, {color: '#0498D1'},
    {color: '#16BA0D'}, {color: '#000000'}, {color: '#6F04C7'},
  ]
});
responsive.draw();

['resize', 'DOMContentLoaded'].forEach((event) => {
  window.addEventListener(event, () => {
    var container = document.getElementById('responsive-canvas');
    responsive.resize(container.offsetWidth, container.scrollHeight);
    responsive.scale(container.offsetWidth / initialWidth);
    responsive.redraw();
  });
});
```

### Demo

<div id="responsive-canvas">
</div>
<div class="form-group">
  <button id="responsive-shuffle" class="btn btn-primary">Shuffle</button>
  <button id="responsive-shuffle-grid" class="btn btn-primary">Shuffle Grid</button>
  <button id="responsive-shuffle-columns" class="btn btn-primary">Shuffle Columns</button>
  <button id="responsive-solve" class="btn btn-primary">Solve</button>
</div>


## Rectangular

### Code

```javascript
let quinquela = new Image();
quinquela.src = 'static/quinquela.jpg';
quinquela.onload = () => {
  const rectangular = new headbreaker.Canvas('rectangular-canvas', {
    width: 800, height: 650,
    pieceSize: {x: 200, y: 120}, proximity: 20,
    borderFill: {x: 20, y: 12}, strokeWidth: 1.5,
    lineSoftness: 0.18, image: quinquela
  });

  rectangular.adjustImagesToPuzzleWidth();
  rectangular.autogenerate({
    horizontalPiecesCount: 3,
    verticalPiecesCount: 3
  });
  rectangular.draw();
  registerButtons('rectangular', rectangular);
}
```

### Demo

<div id="rectangular-canvas">
</div>
<div class="form-group">
  <button id="rectangular-shuffle" class="btn btn-primary">Shuffle</button>
  <button id="rectangular-shuffle-grid" class="btn btn-primary">Shuffle Grid</button>
  <button id="rectangular-shuffle-columns" class="btn btn-primary">Shuffle Columns</button>
  <button id="rectangular-solve" class="btn btn-primary">Solve</button>
</div>


<script src="js/demo.js"></script>
