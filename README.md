[![Build Status](https://travis-ci.com/flbulgarelli/headbreaker.svg?branch=master)](https://travis-ci.com/flbulgarelli/headbreaker)
[![Code Climate](https://codeclimate.com/github/flbulgarelli/headbreaker/badges/gpa.svg)](https://codeclimate.com/github/flbulgarelli/headbreaker)
[![Test Coverage](https://codeclimate.com/github/flbulgarelli/headbreaker/badges/coverage.svg)](https://codeclimate.com/github/flbulgarelli/headbreaker)

# 🧩 🤯 Headbreaker

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

## ⏳ TL;DR sample

If you just want to see a - very basic - 2x2 puzzle in your web-browser, then create an HTML file with the following contents 😁:

```html
<script src="https://flbulgarelli.github.io/headbreaker/js/headbreaker.js"></script>
<body>
  <div id="puzzle"></div>
  <script>
    const autogen = new headbreaker.Canvas('puzzle', {
      width: 800, height: 650,
      pieceSize: 100, proximity: 20,
      borderFill: 10, strokeWidth: 2, lineSoftness: 0.18,
    });
    autogen.autogenerate({
      horizontalPiecesCount: 2,
      verticalPiecesCount: 2,
      metadata: [
        {color: '#B83361'},
        {color: '#B87D32'},
        {color: '#A4C234'},
        {color: '#37AB8C'}
      ]
    });
    autogen.draw();
  </script>
</body>
```

And voilà! 🎊

![sample puzzle](https://raw.githubusercontent.com/flbulgarelli/headbreaker/master/docs/tldr_puzzle.png)

However, there is a lot more that `headbreaker` can do for you. These are some of its coolest features:

 * Customizable pieces outlines
 * Irregular pieces
 * Image support
 * Sound support
 * Event system
 * Automatic validation
 * Data import and export

## 🏁 Quick start

`headbreaker` is a library which solves two different - but-related - problems:

  * It implements a jigsaw-like data-structure, which can be used in tasks like modelling, traversing, importing and exporting and - of course - rendering. This data-structure is 100% pure JavaScript, with no dependencies, and can be used both in browsers and headless environments.
  * It implements a simple and generic rendering system for the Web. `headbreaker` also ships a 100% functional [Konva.js](https://konvajs.org/)-based implementation, but you may want to develop and use your own implementation.

`headbreaker` is designed to be included and compiled in your project as a `node` module, but you can also import it directly in your static pages from [https://flbulgarelli.github.io/headbreaker/js/headbreaker.js](`https://flbulgarelli.github.io/headbreaker/js/headbreaker.js`).

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
  .locateAt(0, 0);
puzzle
  .newPiece({left: Slot, right: Tab})
  .locateAt(3, 0);
puzzle
  .newPiece({left: Slot, right: Tab, down: Slot})
  .locateAt(6, 0);
puzzle
  .newPiece({up: Tab})
  .locateAt(6, 3);

// Connect puzzle's nearby pieces
puzzle.autoconnect();

// Translate puzzle
puzzle.translate(10, 10);

// Shuffle pieces
puzzle.shuffle(100, 100);

// Relocate pieces to fit into a bounding box
// while preserving their relative positions, if possible
puzzle.reframe(vector(0, 0), vector(20, 20));

// Directly manipulate pieces
const [a, b, c, d] = puzzle.pieces;

// Drag a piece 10 steps right and 5 steps down
a.drag(10, 5);

// Connect two pieces (if possible)
a.tryConnectWith(b);

// Export and import puzzle
const dump = puzzle.export();
const otherPuzzle = headbreaker.Puzzle.import(dump);
```

## 👀 Demo and API Docs

See [flbulgarelli.github.io/headbreaker](https://flbulgarelli.github.io/headbreaker/)

## ❓ Questions

Do you have any questions or doubts? Please feel free to check [the existing discussions](https://github.com/flbulgarelli/headbreaker/discussions) or open a new one 🙋.

## 🏗 Develop

```bash
# install project
$ npm install
# run tests
$ npm run test
# build whole project
$ npm run all
# start docs site locally
# requires mkdocs
$ mkdocs serve
```

## Contributors

* [@flbulgarelli](https://github.com/flbulgarelli)
* [@Almo7aya](https://github.com/Almo7aya)
