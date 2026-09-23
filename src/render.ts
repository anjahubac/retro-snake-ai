import type { GameState } from "./game/types";

export const CELL = 20;

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  const boardSize = state.config.gridSize * CELL;

  ctx.fillStyle = "#1b1b1b";
  ctx.fillRect(0, 0, boardSize, boardSize);

  if (state.food !== null) {
    ctx.fillStyle = "#e04040";
    ctx.fillRect(state.food.x * CELL, state.food.y * CELL, CELL - 1, CELL - 1);
  }

  state.snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#208040" : "#40c060";
    ctx.fillRect(segment.x * CELL, segment.y * CELL, CELL - 1, CELL - 1);
  });
}
