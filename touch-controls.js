// タッチコントロール（回転ボタンのみ）
// グローバルオブジェクトに必要な関数/変数を公開
window.collides = collides;
window.merge = merge;
window.newPiece = newPiece;
window.clearLines = clearLines;
window.piece = piece;
const container = document.createElement('div');
container.id = 'touch-controls';
document.body.appendChild(container);
// 画面タップで左右移動（スワイプ時は無視）
let touchStartX = null;
let touchStartY = null;
// Pointerup handler for both horizontal move and swipe
let swipeStartY = null;
canvas.addEventListener('pointerdown', e => {
  swipeStartY = e.clientY;
});
canvas.addEventListener('pointerup', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  // Swipe detection first
  if (swipeStartY !== null) {
    const diffY = e.clientY - swipeStartY;
    const swipeThreshold = 50;
    if (Math.abs(diffY) > swipeThreshold) {
      if (diffY > 0) {
        while (!collides(0, 1)) piece.y++;
        merge();
        clearLines();
        newPiece();
        // Skip horizontal move on hard drop
        swipeStartY = null;
        return;
      } else {
        const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
        if (!collides(0, 0, rotated)) piece.shape = rotated;
      }
    } else {
      // Non-swipe tap: handle horizontal movement
      if (x < width / 2) {
        if (!collides(-1, 0)) piece.x--;
      } else {
        if (!collides(1, 0)) piece.x++;
      }
    }
  }
  swipeStartY = null;
});
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
container.style.display = isTouch ? 'flex' : 'none';