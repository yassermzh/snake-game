const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const clear = () => {
  ctx.fillStyle = "lightgrey";
  ctx.fillRect(0, 0, boardSize, boardSize);
};

const diff = (snake1, snake2 = []) => {
  if (snake2.length === 0) return [{ tile: head(snake1), type: "add" }];
  return [
    {
      cond: !isSameTile(tail(snake1), tail(snake2)),
      change: { tile: tail(snake2), type: "delete" }
    },
    {
      cond: !isSameTile(head(snake1), head(snake2)),
      change: { tile: head(snake1), type: "add" }
    }
  ]
    .filter(x => x.cond)
    .reduce((acc, { change }) => [...acc, change], []);
};

const createRender = () => {
  let cache = { snake: [], apple: [] };
  return state => {
    diff(state.snake, cache.snake).forEach(({ tile, type }) => {
      drawTile(tile, type === "add" ? "grey" : "lightgrey");
    });
    if (!isSameTile(state.apple, cache.apple)) drawTile(state.apple, "black");
    cache = state;
  };
};
