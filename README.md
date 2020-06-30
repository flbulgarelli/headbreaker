[![Build Status](https://travis-ci.com/flbulgarelli/headbreaker.svg?branch=master)](https://travis-ci.com/flbulgarelli/headbreaker)
[![Code Climate](https://codeclimate.com/github/flbulgarelli/headbreaker/badges/gpa.svg)](https://codeclimate.com/github/flbulgarelli/headbreaker)
[![Test Coverage](https://codeclimate.com/github/flbulgarelli/headbreaker/badges/coverage.svg)](https://codeclimate.com/github/flbulgarelli/headbreaker)

# :jigsaw: :exploding_head: Headbreaker

> Jigsaw Puzzles Framework for JavaScript

`headbreaker` - a spanish pun for _rompecabezas_ - is a JavaScript framework for building all kind of jigsaw puzzles.

## ☑️ Features

 * 100% pure JavaScript
 * Headless support domain-model
 * Highly tested
 * Customizable data-model
 * Zero-dependencies - although Konva.js is used a a rendering backed, it is an optional dependency which can be replaced with custom code

## 📦 Installing

```bash
npm install --save headbreaker

# optional: manually add konva to your project if you want to use
# it as rendering backend
npm install --save konva
```

## 🏁 Quick start

### HTML Puzzle

```html
<!-- just add a div with an id... -->
<div id="my-canvas">
</div>

<script>
  // ...and a script with the following code:
  let dali = new Image();
  dali.src = 'static/dali.jpg';
  dali.onload = () => {
    const canvas = new headbreaker.Canvas('my-canvas', {
      width: 800, height: 800, image: dali
    });
    canvas.autogenerate();
    canvas.shuffle(0.7);
    canvas.draw();
  }
</script>
```

### Headless Puzzle

```javascript
// headbreaker can also be loaded on the server, which allows to
// fully manipulate its model
const headbreaker = require('headbreaker');

// Create a puzzle
const puzzle = new headbreaker.Puzzle();
puzzle
  .newPiece({right: Tab})
  .placeAt(anchor(0, 0));
puzzle
  .newPiece({left: Slot, right: Tab})
  .placeAt(anchor(3, 0));
puzzle
  .newPiece({left: Slot, right: Tab, down: Slot})
  .placeAt(anchor(6, 0));
puzzle
  .newPiece({up: Tab})
  .placeAt(anchor(6, 3));

// Connect puzzle's near pieces
puzzle.autoconnect();

// Translate puzzle
puzzle.translate(10, 10);

// Export puzzle
puzzle.export();

// Shuffle pieces
puzzle.shuffle(100, 100);

// Directly manipulate pieces
const [a, b, c, d] = puzzle.pieces;

// Drag a piece 10 steps right and 5 steps down
a.drag(10, 5);

// Connect two pieces (if possible)
a.tryConnectWith(b);
```

## 👀 Demo and API Docs

See https://flbulgarelli.github.io/headbreaker/

