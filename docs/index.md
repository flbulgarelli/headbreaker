<script src="js/headbreaker.js"></script>
<script src="js/layer.js"></script>

## Basic example

<div id="basic">
</div>

<script>
  const basic = new headbreaker.Canvas(buildLayer('basic', 500, 500), {pieceSize: 50, proximityLevel: 10});

  basic.newPiece({
      structure: {up: headbreaker.None, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
      x: 50,
      y: 50,
      data: {id: 'a', color: 'red'}
    });
  basic.newPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
    x: 100, y: 50,
    data: {id: 'b', color: '#00D2FF'}
  });
  basic.newPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
    x: 150, y: 50,
    data: {id: 'c', color: '#00D2FF'}
  });
  basic.newPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.None, down: headbreaker.Slot, left: headbreaker.Slot},
    x: 150, y: 100,
    data: {id: 'd', color: '#00D2FF'}
  });
  basic.newPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
    x: 250, y: 200,
    data: {id: 'e', color: 'green'}
  });
  basic.newPiece({
    structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Tab},
    x: 350, y: 250,
    data: {id: 'f', color: 'purple'}
  });
  basic.newPiece({
    structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab},
    x: 100, y: 230,
    data: {id: 'g', color: 'black'}
  });
  basic.draw();
</script>


## With background

<div id="background">
</div>

<script>
  const background = new headbreaker.Canvas(buildLayer('background', 500, 500), {pieceSize: 50, proximityLevel: 10});

  let vangogh = new Image();
  vangogh.src = '/vangogh.jpg';
  vangogh.onload = () => {
      background.newPiece({
        structure: {up: headbreaker.None, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.None},
        x: 50, y: 50,
        data: {id: 'a', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.None, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
        x: 100, y: 50,
        data: {id: 'b', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.None, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Tab},
        x: 150, y: 50,
        data: {id: 'c', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.None, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Tab},
        x: 200, y: 50,
        data: {id: 'c', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.None, right: headbreaker.None, down: headbreaker.Tab, left: headbreaker.Tab},
        x: 250, y: 50,
        data: {id: 'c', image: vangogh}
      });

      background.newPiece({
        structure: {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.None},
        x: 50, y: 100,
        data: {id: 'a', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.Tab, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
        x: 100, y: 100,
        data: {id: 'b', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Tab, left: headbreaker.Tab},
        x: 150, y: 100,
        data: {id: 'c', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Tab},
        x: 200, y: 100,
        data: {id: 'c', image: vangogh}
      });
      background.newPiece({
        structure: {up: headbreaker.Slot, right: headbreaker.None, down: headbreaker.Slot, left: headbreaker.Slot},
        x: 250, y: 100,
        data: {id: 'c', image: vangogh}
      });

      background.draw();
  }
</script>
