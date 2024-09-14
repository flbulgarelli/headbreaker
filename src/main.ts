import './style.css';
import * as headbreaker from '@/headbreaker';

document.querySelector<HTMLDivElement>(
  '#app'
)!.innerHTML = `<div id="puzzle"></div>`;

window.headbreaker = headbreaker;

const autogen = new headbreaker.Canvas('puzzle', {
  width: 800,
  height: 650,
  pieceSize: 100,
  proximity: 20,
  borderFill: 10,
  strokeWidth: 2,
  lineSoftness: 0.18,
});
autogen.autogenerate({
  horizontalPiecesCount: 2,
  verticalPiecesCount: 2,
  metadata: [
    { color: '#B83361' },
    { color: '#B87D32' },
    { color: '#A4C234' },
    { color: '#37AB8C' },
  ],
});
autogen.draw();
