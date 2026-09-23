export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type Status = "ready" | "running" | "paused" | "over" | "won";
export type GameMode = "classic" | "arcade";
export type Rng = () => number; // vraća broj u [0, 1)

export type GameConfig = {
  gridSize: number;
  tickMs: number;
  startLength: number;
  winScore: number;
};

export type GameState = {
  config: GameConfig;
  mode: GameMode;
  snake: Point[]; // snake[0] je glava
  direction: Direction;
  food: Point | null;
  obstacles: Point[];
  bonus: { position: Point; value: number; ticksLeft: number; ticksTotal: number } | null;
  bonusPoints: number;
  score: number;
  status: Status;
};
