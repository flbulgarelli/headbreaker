// @ts-nocheck
function buildLayer(id, width, height) {
  var stage = new Konva.Stage({
    container: id,
    width: width,
    height: height
  });

  var layer = new Konva.Layer();
  stage.add(layer);
  return layer;
}
