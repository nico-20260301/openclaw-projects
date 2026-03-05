// タッチコントロール（ジョイスティック＋回転）
const container = document.createElement('div');
container.id = 'touch-controls';
document.body.appendChild(container);

// 回転ボタン（右矢印）
const btnRotate = document.createElement('button');
btnRotate.id = 'btn-rotate';
btnRotate.textContent = '→';
container.appendChild(btnRotate);

// ジョイスティックパッド（上下左右）
const joystick = document.createElement('div');
joystick.id = 'joystick';
container.appendChild(joystick);

let startX, startY;
joystick.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.touches[0];
  startX = t.clientX;
  startY = t.clientY;
});
joystick.addEventListener('touchmove', e => {
  e.preventDefault();
  const t = e.touches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    // 左右移動
    if (dx < -30 && !collides(-1, 0)) piece.x--;
    if (dx > 30 && !collides(1, 0)) piece.x++;
  } else {
    // 上は回転、下はハードドロップ
    if (dy < -30) {
      const rotated = piece.shape[0].map((_, i) => piece.shape.map(r => r[i]).reverse());
      if (!collides(0, 0, rotated)) piece.shape = rotated;
    } else if (dy > 30) {
      while (!collides(0, 1)) piece.y++;
      merge(); clearLines(); newPiece();
    }
  }
});

btnRotate.addEventListener('click', () => {
  const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
  if (!collides(0, 0, rotated)) piece.shape = rotated;
});

// ダブルクリックでハードドロップ（canvas へのイベント）
document.addEventListener('dblclick', e => {
  if (e.target.tagName.toLowerCase() === 'canvas') {
    while (!collides(0, 1)) piece.y++;
    merge();
    clearLines();
    newPiece();
  }
});

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
container.style.display = isTouch ? 'flex' : 'none';