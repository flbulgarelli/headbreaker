// @ts-nocheck
class CanvasBuilder {
  constructor(id) {
    this.id = id;
  }

  withSpec(spec) {
    this.image = spec.image;
    this.horizontalPiecesCount = spec.horizontalPiecesCount;
    this.verticalPiecesCount = spec.verticalPiecesCount;
  }

  build() {
    return (root, root_id = 'canvas') => {
      root.innerHTML = `<div id="${root_id}">`;
      let image = new Image();
      image.src = this.image;
      image.onload = () => {
        const canvas = new headbreaker.Canvas(root_id, {
          width: 800, height: 650,
          pieceSize: 100, proximity: 20,
          borderFill: 10, strokeWidth: 1.5,
          lineSoftness: 0.18, image: image,
        });
        canvas.autogenerate({
          horizontalPiecesCount: this.horizontalPiecesCount,
          verticalPiecesCount: this.verticalPiecesCount
        });
        canvas.attachValidator();
        canvas.draw();
      }
    }

  }
}
