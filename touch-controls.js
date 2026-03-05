// ボタン生成（既存のボタンを削除）
const container = document.createElement('div');
container.id = 'touch-controls';
document.body.appendChild(container);

['←','↓','→','↑','⇩'].forEach((label, i) => {
  const id = ['left','down','right','rotate','hard-drop'][i];
  const btn = document.createElement('button');
  btn.id = `btn-${id}`;
  btn.textContent = label;
  container.appendChild(btn);
});

const btnLeft   = document.getElementById('btn-left');
const btnRight  = document.getElementById('btn-right');
const btnDown   = document.getElementById('btn-down');
const btnRotate = document.getElementById('btn-rotate');
const btnHardDrop = document.getElementById('btn-hard-drop');

btnLeft.addEventListener('click',   () => { if(!collides(-1,0)) piece.x--; });
btnRight.addEventListener('click',  () => { if(!collides(1,0)) piece.x++; });
btnDown.addEventListener('click',   () => { if(!collides(0,1)) piece.y++; });
btnRotate.addEventListener('click', () => {
  const rotated = piece.shape[0].map((_,i)=>piece.shape.map(row=>row[i]).reverse());
  if(!collides(0,0,rotated)) piece.shape = rotated;
});
btnHardDrop.addEventListener('click', () => {
  while(!collides(0,1)) piece.y++;
  merge(); clearLines(); newPiece();
});

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
container.style.display = isTouch ? 'flex' : 'none';