<script src="https://cdnjs.cloudflare.com/ajax/libs/konva/6.0.0/konva.js" integrity="sha256-F/REgXgQ84YI/OLq+RUNixRhAxFw/ShOx2A/cEpi3QA=" crossorigin="anonymous"></script>
<script src="js/headbreaker.js"></script>

<div id="container">

</div>

<script>
    function commitAnchors(model, group) {
      model.data.x = group.x();
      model.data.y = group.y();
    }

    function anchorsDelta(model, group) {
      return headbreaker.vector.diff(group.x(),group.y(), model.data.x, model.data.y);
    }

    function renderPiece(layer, model) {
      var group = new Konva.Group({
        x: model.centralAnchor.x,
        y: model.centralAnchor.y
      });

      var piece = new Konva.Line({
        points: headbreaker.ui.createPoints(model),
        fill: model.data.color,
        fillPatternImage: model.data.image,
        fillPatternOffset: { x: model.centralAnchor.x, y: model.centralAnchor.y },
        stroke: 'black',
        strokeWidth: 3,
        closed: true,
      });
      group.add(piece);
      layer.add(group);
      group.draggable('true')

      group.on('mouseover', function () {
        document.body.style.cursor = 'pointer';
      });
      group.on('mouseout', function () {
        document.body.style.cursor = 'default';
      });

      commitAnchors(model, group);

      group.on('dragmove', function () {
        let [dx, dy] = anchorsDelta(model, group);

        if (!headbreaker.vector.isNull(dx, dy)) {
          model.drag(dx, dy, true)
          commitAnchors(model, group);
          layer.draw();
        }
      });

      group.on('dragend', function () {
        model.drop();
        layer.draw();
      })

      model.onTranslate((dx, dy) => {
        group.x(model.centralAnchor.x)
        group.y(model.centralAnchor.y)
        commitAnchors(model, group);
      })

      model.onConnect((it) => console.log(`${model.data.id} connected to ${it.data.id}`))
    }

    var stage = new Konva.Stage({
      container: 'container',
      width: 900,
      height: 900
    });

    var layer = new Konva.Layer();
    stage.add(layer);

    const puzzle = new headbreaker.Puzzle(25, 10);

    function createPiece(layer, puzzle, config, x, y, data) {
      let piece = puzzle.newPiece(config);
      piece.data = data;
      piece.placeAt(headbreaker.anchor(x, y));
      renderPiece(layer, piece);
    }

    let vangogh = new Image();
    vangogh.src = '/vangogh.jpg';
    vangogh.onload = () => {
    createPiece(layer, puzzle,
      {up: headbreaker.None, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
      0, 0,
      {id: 'a', color: 'red'});
    createPiece(layer, puzzle,
      {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
      50, 0,
      {id: 'b', color: '#00D2FF'});
    createPiece(layer, puzzle,
      {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Slot},
      100, 0,
      {id: 'c', color: '#00D2FF'});
    createPiece(layer, puzzle,
      {up: headbreaker.Slot, right: headbreaker.None, down: headbreaker.Slot, left: headbreaker.Slot},
      100, 50,
      {id: 'd', color: '#00D2FF'});


    createPiece(layer, puzzle,
      {up: headbreaker.Slot, right: headbreaker.Slot, down: headbreaker.Slot, left: headbreaker.Slot},
      200, 150,
      {id: 'e', color: 'green'});
    createPiece(layer, puzzle,
      {up: headbreaker.Tab, right: headbreaker.Tab, down: headbreaker.Tab, left: headbreaker.Tab},
      300, 200,
      {id: 'f', color: 'purple'});
      createPiece(layer, puzzle,
        {up: headbreaker.Slot, right: headbreaker.Tab, down: headbreaker.Slot, left: headbreaker.Tab},
        50, 180,
        {id: 'g', image: vangogh});

      puzzle.autoconnectAll();
      layer.draw()
    }






</script>
