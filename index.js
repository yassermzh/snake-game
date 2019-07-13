let vx, vy, px, py, snake, tails, apple;
let ctx, gameInterval;

const boardSize = 300;
const tiles = 20;
const tileSize = boardSize / tiles;

window.onload = function() {
  const canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  startGame();
};

function startGame() {
  ctx.fillStyle = "lightgrey";
  ctx.fillRect(0, 0, boardSize, boardSize);
  [vx, vy, px, py] = [1, 0, 10, 10];
  tails = 5;
  snake = [];
  newApple();
  document.addEventListener("keydown", keyPush);
  gameInterval = setInterval(game, 100);
}

function drawTile({ px, py }, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    px * tileSize + 1,
    py * tileSize + 1,
    tileSize - 1,
    tileSize - 1
  );
}

function endGame() {
  clearInterval(gameInterval);
  alert("Game Over!");
  startGame();
}

function newApple() {
  apple = {
    px: Math.floor(Math.random() * tiles),
    py: Math.floor(Math.random() * tiles)
  };
  drawTile(apple, "cyan");
}

function game() {
  if (snake.length >= tails) {
    const tail = snake.shift();
    drawTile(tail, "lightgrey");
  }
  [px, py] = [px + vx, py + vy];
  if (px >= tiles) px = 0;
  if (px < 0) px = tiles;
  if (py >= t) py = 0;
  if (py < 0) py = tiles;

  const collision = snake.reduce(
    (acc, s) => acc || (s.px == px && s.py == py),
    false
  );
  if (collision) endGame();
  snake.push({ px, py });
  drawTile({ px, py }, "black");

  if (px === apple.px && py === apple.py) {
    newApple();
    tails++;
  }
}

function keyPush(evt) {
  switch (evt.keyCode) {
    case 37:
      [vx, vy] = [-1, 0];
      break;
    case 38:
      [vx, vy] = [0, -1];
      break;
    case 39:
      [vx, vy] = [1, 0];
      break;
    case 40:
      [vx, vy] = [0, 1];
      break;
  }
}
