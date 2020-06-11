<script src="js/headbreaker.js"></script>

# Samples

## Basic

<div id="basic">
</div>

<script>
  const basic = new headbreaker.Canvas('basic', {width: 500, height: 300, pieceSize: 50, proximity: 10});
  basic.withPiece({
      structure: {right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
      data: {id: 'a', currentPosition: {x: 50, y: 50}, color: 'red'}
    });
  basic.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
    data: {id: 'b', currentPosition: {x: 100, y: 50}, color: '#00D2FF'}
  });
  basic.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
    data: {id: 'c', currentPosition: {x: 150, y: 50}, color: '#00D2FF'}
  });
  basic.withPiece({
    structure: {up: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
    data: {id: 'd', currentPosition: {x: 150, y: 100}, color: '#00D2FF'}
  });
  basic.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
    data: {id: 'e', currentPosition: {x: 250, y: 200}, color: 'green'}
  });
  basic.withPiece({
    structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Tab},
    data: {id: 'f', currentPosition: {x: 350, y: 250}, color: 'purple'}
  });
  basic.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab},
    data: {id: 'g', currentPosition: {x: 100, y: 230}, color: 'black'}
  });
  basic.draw();
</script>

## Soft lines

<div id="soft">
</div>

<script>
  const soft = new headbreaker.Canvas('soft', {
    width: 500, height: 300,
    pieceSize: 50, proximity: 10,
    lineSoftness: 0.2
  });

  soft.withPiece({
      structure: {right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
      data: {id: 'a', targetPosition: {x: 50, y: 50}, color: 'red'}
    });
  soft.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
    data: {id: 'b', targetPosition: {x: 100, y: 50}, color: '#00D2FF'}
  });
  soft.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
    data: {id: 'c', targetPosition: {x: 150, y: 50}, color: '#00D2FF'}
  });
  soft.withPiece({
    structure: {up: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
    data: {id: 'd', targetPosition: {x: 150, y: 100}, color: '#00D2FF'}
  });
  soft.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
    data: {id: 'e', targetPosition: {x: 250, y: 200}, color: 'green'}
  });
  soft.withPiece({
    structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Tab},
    data: {id: 'f', targetPosition: {x: 350, y: 250}, color: 'purple'}
  });
  soft.withPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab},
    data: {id: 'g', targetPosition: {x: 100, y: 230}, color: 'black'}
  });
  soft.draw();
</script>



## Perfect match

<div id="perfect">
</div>

<script>
  const perfect = new headbreaker.Canvas('perfect', {
    width: 800, height: 300,
    pieceSize: 100, proximity: 20,
    borderFill: 10,
    strokeWidth: 2, strokeColor: '#00200B',
    lineSoftness: 0.0 });

  perfect.withPiece({
    structure: {right: headbreaker.Tab, down: headbreaker.Slot},
    data: {id: 'a', targetPosition: {x: 100, y: 100}, color: '#0EC430'}
  });
  perfect.withPiece({
    structure: {right: headbreaker.Slot, left: headbreaker.Slot},
    data: {id: 'b', targetPosition: {x: 200, y: 100}, color: '#098520'}
  });
  perfect.withPiece({
    structure: {down: headbreaker.Tab, left: headbreaker.Tab},
    data: {id: 'c', targetPosition: {x: 330, y: 80}, color: '#04380D'}
  });
  perfect.withPiece({
    structure: {up: headbreaker.Slot},
    data: {id: 'd', targetPosition: {x: 480, y: 130}, color: '#054511'}
  });
  perfect.withPiece({
    structure: {up: headbreaker.Tab},
    data: {id: 'e', targetPosition: {x: 530, y: 80}, color: '#04330C'}
  });

  perfect.draw();
</script>


## Background


<div id="background">
</div>

<script>
  let vangogh = new Image();
  vangogh.src = 'static/vangogh.jpg';
  vangogh.onload = () => {
    const background = new headbreaker.Canvas('background', {
      width: 800, height: 800,
      pieceSize: 100, proximity: 20,
      borderFill: 10, strokeWidth: 2,
      lineSoftness: 0.12, image: vangogh,
    });

    background.withPiece({
      structure: {right: headbreaker.Tab, down: headbreaker.Slot},
      data: {id: 'a', targetPosition: {x: 100, y: 100}},
    });
    background.withPiece({
      structure: {right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
      data: {id: 'b', targetPosition: {x: 200, y: 100}},
    });
    background.withPiece({
      structure: {right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Tab},
      data: {id: 'c', targetPosition: {x: 300, y: 100}},
    });
    background.withPiece({
      structure: {right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Tab},
      data: {id: 'd', targetPosition: {x: 400, y: 100}},
    });
    background.withPiece({
      structure: {down: headbreaker.Tab, left: headbreaker.Tab},
      data: {id: 'e', targetPosition: {x: 500, y: 100}},
    });

    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.None},
      data: {id: 'f', targetPosition: {x: 100, y: 200}},
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
      data: {id: 'g', targetPosition: {x: 200, y: 200}},
    });
    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Tab},
      data: {id: 'h', targetPosition: {x: 300, y: 200}},
    });
    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab},
      data: {id: 'i', targetPosition: {x: 400, y: 200}},
    });
    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.None, down: headbreaker.Slot, left: headbreaker.Slot},
      data: {id: 'j', targetPosition: {x: 500, y: 200}},
    });

    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.None},
      data: {id: 'k', targetPosition: {x: 100, y: 300}},
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab},
      data: {id: 'l', targetPosition: {x: 200, y: 300}},
    });
    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Slot},
      data: {id: 'm', targetPosition: {x: 300, y: 300}},
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Tab},
      data: {id: 'n', targetPosition: {x: 400, y: 300}},
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.None, down: headbreaker.Slot, left: headbreaker.Slot},
      data: {id: 'o', targetPosition: {x: 500, y: 300}},
    });

    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.None},
      data: {id: 'p', targetPosition: {x: 100, y: 400}},
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab},
      data: {id: 'q', targetPosition: {x: 200, y: 400}},
    });
    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
      data: {id: 'r', targetPosition: {x: 300, y: 400}},
    });
    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
      data: {id: 's', targetPosition: {x: 400, y: 400}},
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.None, down: headbreaker.Slot, left: headbreaker.Tab},
      data: {id: 't', targetPosition: {x: 500, y: 400}, currentPosition: {x: 613, y: 386}}
    });

    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.None, left: headbreaker.None},
      data: {id: 'u', targetPosition: {x: 100, y: 500}}
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.None, left: headbreaker.Slot},
      data: {id: 'v', targetPosition: {x: 200, y: 500}}
    });
    background.withPiece({
      structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.None, left: headbreaker.Slot},
      data: {id: 'w', targetPosition: {x: 300, y: 500}}
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.Slot, down: headbreaker.None, left: headbreaker.Slot},
      data: {id: 'x', targetPosition: {x: 400, y: 500}, currentPosition: {x: 425, y: 530}}
    });
    background.withPiece({
      structure: {up: headbreaker.Tab, right: headbreaker.None, down: headbreaker.None, left: headbreaker.Tab},
      data: {id: 'y', targetPosition: {x: 500, y: 500}, currentPosition: {x: 570, y: 560}}
    });
    background.draw();
  }
</script>


## Autogenerated

<div id="autogen">
</div>

<script>
  let xul = new Image();
  xul.src = 'static/xul.jpg';
  xul.onload = () => {
    const autogen = new headbreaker.Canvas('autogen', {
      width: 800, height: 800,
      pieceSize: 100, proximity: 20,
      borderFill: 10, strokeWidth: 1.5,
      lineSoftness: 0.18, image: xul,
    });

    autogen.withPuzzle({
      horizontalPiecesCount: 6,
      verticalPiecesCount: 5
    });
    autogen.draw();
  }
</script>



## Randomized positions

<div id="randomized">
</div>

<script>
  let dali = new Image();
  dali.src = 'static/dali.jpg';
  dali.onload = () => {
    const randomized = new headbreaker.Canvas('randomized', {
      width: 800, height: 800,
      pieceSize: 100, proximity: 20,
      borderFill: 10, strokeWidth: 2,
      lineSoftness: 0.12, image: dali
    });

    randomized.withPuzzle({
      insertSequence: headbreaker.sequence.flipflop
    });
    randomized.shuffle(0.7);
    randomized.draw();
  }
</script>


## Labels

<div id="labels">
</div>

<script>
  const labels = new headbreaker.Canvas('labels', {
    width: 400, height: 400,
    pieceSize: 80, proximity: 25,
    borderFill: 10, strokeWidth: 2,
    lineSoftness: 0.18,
  });

  labels.withPiece({
    structure: {right: headbreaker.Tab},
    data: {
      id: 'tree-kanji',
      color: '#23599E',
      strokeColor: '#18396B',
      label: { text: '木', fontSize: 70, x: -5, y: 5 }
    }
  });

  labels.withPiece({
    structure: {right: headbreaker.Tab},
    data: {
      id: 'fire-kanji',
      color: '#23599E',
      strokeColor: '#18396B',
      label: { text: '火', fontSize: 70, x: -5, y: 5 }
    }
  });

  labels.withPiece({
    structure: {right: headbreaker.Tab},
    data: {
      id: 'water-kanji',
      color: '#23599E',
      strokeColor: '#18396B',
      label: { text: '水', fontSize: 70, x: -5, y: 5 }
    }
  });

  labels.withPiece({
    structure: {left: headbreaker.Slot},
    data: {
      id: 'water-emoji',
      color: '#EBB34B',
      strokeColor: '#695024',
      label: { text: '💧', fontSize: 70, x: 5, y: 0 }
    }
  });

  labels.withPiece({
    structure: {left: headbreaker.Slot},
    data: {
      id: 'tree-emoji',
      color: '#EBB34B',
      strokeColor: '#695024',
      label: { text: '🌳', fontSize: 70, x: 5, y: 0 }
    }
  });

  labels.withPiece({
    structure: {left: headbreaker.Slot},
    data: {
      id: 'fire-emoji',
      color: '#EBB34B',
      strokeColor: '#695024',
      label: { text: '🔥', fontSize: 70, x: 5, y: 0 }
    }
  });

  labels.shuffle(0.6);
  labels.draw();
</script>



## Sound and visual feedback

<div id="sound">
</div>

<script>
  var audio = new Audio('static/connect.wav');
  let pettoruti = new Image();
    pettoruti.src = 'static/pettoruti.jpg';
    pettoruti.onload = () => {
      const sound = new headbreaker.Canvas('sound', {
        width: 800, height: 800,
        pieceSize: 100, proximity: 20,
        borderFill: 10, strokeWidth: 1.5,
        lineSoftness: 0.18, image: pettoruti,
        strokeColor: 'black'
      });

      sound.withPuzzle({
        horizontalPiecesCount: 6,
        insertSequence: headbreaker.sequence.random
      });

      sound.draw();

      sound.puzzle.onConnect((it) => {
        sound.getFigure(it).shape.stroke('yellow');
        audio.play();
        sound.redraw();
        setTimeout(() => {
          sound.getFigure(it).shape.stroke('black');
          sound.redraw();
        }, 200);
      });

      sound.puzzle.onDisconnect((it) => {
        audio.play();
      });
    }

</script>
