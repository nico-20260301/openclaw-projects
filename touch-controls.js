// タッチコントロール（回転ボタンのみ）
const container = document.createElement('div');
container.id = 'touch-controls';
document.body.appendChild(container);

// 画面タップで左右移動（スワイプ時は無視）
let touchStartX = null;
let touchStartY = null;
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});
canvas.addEventListener('touchend', e => {
  if (touchStartX === null || touchStartY === null) return;
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const diffY = endY - touchStartY;
  const diffX = endX - touchStartX;
  const swipeThreshold = 50;

  if (Math.abs(diffY) > swipeThreshold) {
    // スワイプ検出（上: 回転, 下: ハードドロップ）
    if (diffY > 0) {
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
  } else {
    // 水平移動（スワイプでない場合）
    if (Math.abs(diffX) > 10) {
      if (diffX < 0) {
        if (!collides(-1, 0)) piece.x--;
      } else {
        if (!collides(1, 0)) piece.x++;
      }
    }
  }
  touchStartX = null;
  touchStartY = null;
});

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
container.style.display = isTouch ? 'flex' : 'none';