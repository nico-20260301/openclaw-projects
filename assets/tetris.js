// canvas 初期化
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const BLOCK = 20;

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);
// ピンチ・ダブルクリック抑止
window.addEventListener('touchmove', e => { e.preventDefault(); }, { passive: false });
window.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
canvas.addEventListener('dblclick', e => { e.preventDefault(); });
// 防止页面双击缩放
document.addEventListener('dblclick', e => { e.preventDefault(); }, { passive: false });

// ゲームパラメータ
const ROWS = Math.floor(canvas.height / BLOCK);
const COLS = Math.floor(canvas.width / BLOCK);
const COLORS = ['cyan','blue','orange','yellow','green','purple','red'];
const SHAPES = [
  [[1,1,1,1]],
  [[1,1],[1,1]],
  [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[0,1,0],[1,1,1]]
];
let board = Array.from({length:ROWS},()=>Array(COLS).fill(0));
let gameOver=false;
let score=0;
let dropInterval=1000;
let lastDrop=0;
let piece={shape:null, color:null, x:0, y:0};
function newPiece(){
  const idx=Math.floor(Math.random()*SHAPES.length);
  piece.shape=SHAPES[idx];
  piece.color=COLORS[idx];
  piece.x=Math.floor((COLS-piece.shape[0].length)/2);
  piece.y=0;
  if(collides()){gameOver=true;}
}
function collides(offsetX=0, offsetY=0, shape=piece.shape){
  for(let y=0;y<shape.length;y++){
    for(let x=0;x<shape[y].length;x++){
      if(shape[y][x]){
        const newX=piece.x+x+offsetX;
        const newY=piece.y+y+offsetY;
        if(newX<0||newX>=COLS||newY>=ROWS) return true;
        if(newY>=0&&board[newY][newX]) return true;
      }
    }
  }
  return false;
}

// 予測位置を返す関数
function getGhostPosition(){
  let ghostY = piece.y;
  while(!collides(0,ghostY+1)) ghostY++;
  return ghostY;
}

// 予測ブロック描画
function drawGhost(){
  const ghostY = getGhostPosition();
  ctx.globalAlpha = 0.3;
  piece.shape.forEach((row,dy)=>{
    row.forEach((cell,dx)=>{
      if(cell){
        const x=piece.x+dx;
        const y=ghostY+dy;
        ctx.fillStyle=piece.color;
        ctx.fillRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);
        ctx.strokeStyle='#111';
        ctx.strokeRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);
      }
    });
  });
  ctx.globalAlpha = 1.0;
}

function merge(){
  piece.shape.forEach((row,dy)=>{
    row.forEach((cell,dx)=>{
      if(cell){
        const y=piece.y+dy;
        const x=piece.x+dx;
        if(y>=0) board[y][x]=piece.color;
      }
    });
  });
}
function clearLines(){
  let lines=0;
  board=board.filter(row=>{return row.some(v=>!v)});
  lines=ROWS-board.length;
  for(let i=0;i<lines;i++) board.unshift(Array(COLS).fill(0));
  score+=lines*10;
}
function draw(){
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  board.forEach((row,y)=>{
    row.forEach((color,x)=>{if(color){ctx.fillStyle=color;ctx.fillRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);ctx.strokeStyle='#111';ctx.strokeRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);}});
  });
  // Draw ghost piece
  drawGhost();
  piece.shape.forEach((row,dy)=>{
    row.forEach((cell,dx)=>{if(cell){const x=piece.x+dx;const y=piece.y+dy;ctx.fillStyle=piece.color;ctx.fillRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);ctx.strokeStyle='#111';ctx.strokeRect(x*BLOCK,y*BLOCK,BLOCK,BLOCK);}});
  });
  ctx.fillStyle='white';ctx.font='20px Arial';ctx.fillText('Score:'+score,5,20);
}
function update(time){
  const delta=time-lastDrop;
  if(delta>dropInterval){if(!collides(0,1)) piece.y++;else{merge();clearLines();newPiece();}
  lastDrop=time;}
  draw();
  if(!gameOver) requestAnimationFrame(update);else ctx.fillText('Game Over',canvas.width/2-50,canvas.height/2);
}
window.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&& !collides(-1,0)) piece.x--; if(e.key==='ArrowRight'&& !collides(1,0)) piece.x++; if(e.key==='ArrowDown'&& !collides(0,1)) piece.y++; if(e.code==='Space'){while(!collides(0,1)) piece.y++; merge(); clearLines(); newPiece(); } if(e.key==='ArrowUp'){const rotated=piece.shape[0].map((_,i)=>piece.shape.map(row=>row[i]).reverse());if(!collides(0,0,rotated)) piece.shape=rotated;}});
newPiece();requestAnimationFrame(update);