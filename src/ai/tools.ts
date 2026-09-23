import type { Direction, GameState, Point } from "../game/types";
import type { GameSnapshot, TacticalSnapshot, ToolArgs } from "./types";

const VECTORS: Readonly<Record<Direction, Point>> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function getGameState(state: GameState, args: ToolArgs): GameSnapshot {
  const summary = {
    score: state.score,
    length: state.snake.length,
    status: state.status,
    direction: state.direction,
  };

  if (args.detail === "summary") {
    return summary;
  }

  const head = state.snake[0];
  const headSnapshot = head === undefined ? { x: 0, y: 0 } : { x: head.x, y: head.y };
  const body = state.snake.slice(0, -1);
  const danger = Object.fromEntries(
    (Object.keys(VECTORS) as Direction[]).map((direction) => {
      const vector = VECTORS[direction];
      const next = { x: headSnapshot.x + vector.x, y: headSnapshot.y + vector.y };
      const outside =
        next.x < 0 ||
        next.x >= state.config.gridSize ||
        next.y < 0 ||
        next.y >= state.config.gridSize;
      const occupied = body.some((segment) => segment.x === next.x && segment.y === next.y);
      return [direction, outside || occupied];
    }),
  ) as Record<Direction, boolean>;

  const tactical: TacticalSnapshot = {
    ...summary,
    head: headSnapshot,
    food: state.food === null ? null : { x: state.food.x, y: state.food.y },
    gridSize: state.config.gridSize,
    danger,
  };

  return tactical;
}
