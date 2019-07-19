const { fromEvent, interval } = rxjs;
const {
  map,
  mapTo,
  merge,
  scan,
  tap,
  filter,
  takeWhile,
  finalize
} = rxjs.operators;

const boardSize = 300;
const tiles = 20;
const tileSize = boardSize / tiles;
const initialState = {
  tails: 5,
  snake: [[0, 0]],
  apple: [10, 5],
  vx: 1,
  vy: 0
};

const startGame = () => {
  clear();
  const render = createRender();

  const ticks = interval(100).pipe(mapTo({ type: "tick" }));

  const keys = fromEvent(document, "keydown")
    .pipe(map(keyPush))
    .pipe(filter(x => x))
    .pipe(map(d => ({ type: "speed", d })))

  ticks
    .pipe(merge(keys))
    .pipe(
      scan((state, action) => {
        if (action.type === "speed") {
          return { ...state, vx: action.d[0], vy: action.d[1] };
        } else if (action.type === "tick") {
          return game(state);
        }
        return state;
      }, initialState)
    )
    .pipe(takeWhile(state => !isCollision(state.snake)))
    .pipe(finalize(endGame))
    .subscribe(render);
};

const endGame = () => {
  alert("Game Over!");
  startGame();
};

const drawTile = ([x, y], color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize + 1, y * tileSize + 1, tileSize - 1, tileSize - 1);
};

const newApple = () => [
  Math.floor(Math.random() * tiles),
  Math.floor(Math.random() * tiles)
];
const eatApple = newApple;

const head = snake => snake[snake.length - 1];
const tail = snake => snake[0];

const move = state => {
  const [x, y] = head(state.snake);
  let [nextX, nextY] = [x + state.vx, y + state.vy];
  if (nextX >= tiles) nextX = 0;
  if (nextX < 0) nextX = tiles;
  if (nextY >= tiles) nextY = 0;
  if (nextY < 0) nextY = tiles;
  return limitSnake([...state.snake, [nextX, nextY]], state.tails);
};

const limitSnake = (snake, tails) =>
  snake.length > tails ? snake.slice(1) : snake;

const isSameTile = (tile1, tile2) =>
  tile1[0] === tile2[0] && tile1[1] === tile2[1];

const isCollision = snake => {
  const [h, ...s] = [...snake].reverse();
  return s.reduce((acc, tile) => acc || isSameTile(h, tile), false);
};

const isApple = (snake, apple) => isSameTile(head(snake), apple);

const game = state => {
  const { apple, tails } = state;
  let nextState = { ...state, snake: move(state) };
  if (isApple(nextState.snake, apple)) {
    nextState = { ...nextState, apple: eatApple(), tails: tails + 1 };
  }
  return nextState;
};

const keyPush = evt => {
  switch (evt.keyCode) {
    case 37:
      return [-1, 0];
    case 38:
      return [0, -1];
    case 39:
      return [1, 0];
    case 40:
      return [0, 1];
  }
};

window.onload = startGame;
