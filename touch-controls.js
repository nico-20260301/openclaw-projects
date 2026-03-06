// タッチコントロール（回転ボタンのみ）
const container = document.createElement('div');
container.id = 'touch-controls';
document.body.appendChild(container);

// 回転ボタン（右下に配置）
const btnRotate = document.createElement('button');
btnRotate.id = 'btn-rotate';
btnRotate.textContent = '→';
container.appendChild(btnRotate);

// 画面タップで左右移動
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = t.clientX - rect.left;
  const width = rect.width;
  if (x < width / 2) {
    if (!collides(-1, 0)) piece.x--;
  } else {
    if (!collides(1, 0)) piece.x++;
  }
});

btnRotate.addEventListener('click', () => {
  const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
  if (!collides(0, 0, rotated)) piece.shape = rotated;
});

// ダブルクリックでハードドロップ（canvas へのイベント）
canvas.addEventListener('dblclick', e => {
  while (!collides(0, 1)) piece.y++;
  merge();
  clearLines();
  newPiece();
});

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
container.style.display = isTouch ? 'flex' : 'none';