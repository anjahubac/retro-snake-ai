import type { Direction, GameConfig, GameMode, GameState, Point, Rng } from "./types";

const DIRECTIONS: Readonly<Record<Direction, Point>> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS: Readonly<Record<Direction, Direction>> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

function samePoint(left: Point, right: Point): boolean {
  return left.x === right.x && left.y === right.y;
}

export function spawnFood(
  snake: Point[],
  gridSize: number,
  rng: Rng,
): Point | null {
  const occupied = new Set(snake.map(({ x, y }) => `${x},${y}`));
  const free: Point[] = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      if (!occupied.has(`${x},${y}`)) {
        free.push({ x, y });
      }
    }
  }

  if (free.length === 0) {
    return null;
  }

  return free[Math.floor(rng() * free.length)] ?? null;
}

export function createInitialState(
  config: GameConfig,
  rng: Rng,
  mode: GameMode = "classic",
): GameState {
  const center = Math.floor(config.gridSize / 2);
  const snake: Point[] = Array.from(
    { length: config.startLength },
    (_, index) => ({ x: center - index, y: center }),
  );

  return {
    config,
    mode,
    snake,
    direction: "right",
    food: spawnFood(snake, config.gridSize, rng),
    score: 0,
    status: "ready",
  };
}

export function getLevel(score: number): number {
  return Math.floor(score / 5) + 1;
}

export function getTickMs(
  config: GameConfig,
  mode: GameMode,
  score: number,
): number {
  if (mode === "classic") return config.tickMs;
  return Math.max(60, config.tickMs - 10 * (getLevel(score) - 1));
}

export function startGame(state: GameState): GameState {
  if (state.status !== "ready") {
    return state;
  }

  return { ...state, status: "running" };
}

export function togglePause(state: GameState): GameState {
  if (state.status === "running") {
    return { ...state, status: "paused" };
  }
  if (state.status === "paused") {
    return { ...state, status: "running" };
  }

  return state;
}

export function changeDirection(
  state: GameState,
  dir: Direction,
): GameState {
  const head = state.snake[0];
  const neck = state.snake[1];
  let movementDirection = state.direction;

  if (head !== undefined && neck !== undefined) {
    const dx = head.x - neck.x;
    const dy = head.y - neck.y;

    if (dx === 1 && dy === 0) movementDirection = "right";
    else if (dx === -1 && dy === 0) movementDirection = "left";
    else if (dx === 0 && dy === 1) movementDirection = "down";
    else if (dx === 0 && dy === -1) movementDirection = "up";
  }

  if (
    state.status === "over" ||
    state.status === "won" ||
    OPPOSITE_DIRECTIONS[movementDirection] === dir
  ) {
    return state;
  }

  if (state.direction === dir) {
    return state;
  }

  return { ...state, direction: dir };
}

export function tick(state: GameState, rng: Rng): GameState {
  if (state.status !== "running") {
    return state;
  }

  const head = state.snake[0];
  const vector = DIRECTIONS[state.direction];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };
  const { gridSize, winScore } = state.config;

  if (
    nextHead.x < 0 ||
    nextHead.x >= gridSize ||
    nextHead.y < 0 ||
    nextHead.y >= gridSize
  ) {
    return { ...state, status: "over" };
  }

  const eatsFood = state.food !== null && samePoint(nextHead, state.food);
  const bodyToCheck = eatsFood ? state.snake : state.snake.slice(0, -1);

  if (bodyToCheck.some((segment) => samePoint(segment, nextHead))) {
    return { ...state, status: "over" };
  }

  if (eatsFood) {
    const snake = [nextHead, ...state.snake];
    const score = state.score + 1;

    if (state.mode === "classic" && score >= winScore) {
      return { ...state, snake, score, status: "won" };
    }

    const food = spawnFood(snake, gridSize, rng);
    return {
      ...state,
      snake,
      score,
      food,
      status: food === null ? "won" : "running",
    };
  }

  return {
    ...state,
    snake: [nextHead, ...state.snake.slice(0, -1)],
  };
}

export function handleSpace(state: GameState, rng: Rng): GameState {
  if (state.status === "ready") {
    return startGame(state);
  }

  if (state.status === "running" || state.status === "paused") {
    return togglePause(state);
  }

  return createInitialState(state.config, rng, state.mode);
}
