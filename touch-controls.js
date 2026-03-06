// タッチコントロール（回転ボタンのみ）
const container = document.createElement('div');
container.id = 'touch-controls';
document.body.appendChild(container);

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

// スワイプ検出（上: 回転, 下: ハードドロップ）
let swipeStartY = null;
canvas.addEventListener('touchstart', e => {
  swipeStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', e => {
  if (swipeStartY === null) return;
  const endY = e.changedTouches[0].clientY;
  const diff = endY - swipeStartY;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      // 下スワイプ: ハードドロップ
      while (!collides(0, 1)) piece.y++;
      merge();
      clearLines();
      newPiece();
    } else {
      // 上スワイプ: 回転
      const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
      if (!collides(0, 0, rotated)) piece.shape = rotated;
    }
  }
  swipeStartY = null;
});

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
container.style.display = isTouch ? 'flex' : 'none';