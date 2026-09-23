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
    obstacles: [],
    bonus: null,
    bonusPoints: 0,
    score: 0,
    status: "ready",
  };
}

export function getLevel(score: number): number {
  return Math.floor(score / 5) + 1;
}

export type ArcadeLevelSettings = {
  level: number;
  obstacleTarget: number;
  bonusValue: number;
  bonusTicks: number;
};

export function getArcadeLevelSettings(level: number): ArcadeLevelSettings {
  const cappedLevel = Math.min(10, Math.max(1, Math.floor(level)));
  return {
    level: cappedLevel,
    obstacleTarget: Math.min(18, 2 * (cappedLevel - 1)),
    bonusValue: cappedLevel < 3 ? 0 : Math.floor((cappedLevel + 1) / 2) + 1,
    bonusTicks: cappedLevel < 3 ? 0 : 60 - 4 * (cappedLevel - 3),
  };
}

export function getObstacleCapacity(gridSize: number): number {
  const axisCount = Math.max(0, Math.ceil((gridSize - 4) / 2));
  return axisCount * axisCount;
}

export function getTickMs(
  config: GameConfig,
  mode: GameMode,
  score: number,
): number {
  if (mode === "classic") return config.tickMs;
  const level = getArcadeLevelSettings(getLevel(score)).level;
  return Math.max(60, config.tickMs - 10 * (level - 1));
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

// Spaced interior pillars preserve connected corridors and the outer border.
function addObstacles(state: GameState): Point[] {
  const obstacles = [...state.obstacles];
  const target = getArcadeLevelSettings(getLevel(state.score - state.bonusPoints)).obstacleTarget;
  const head = state.snake[0];
  const occupied = [...state.snake, ...obstacles];
  if (state.food) occupied.push(state.food);
  if (state.bonus) occupied.push(state.bonus.position);
  for (let y = 2; y < state.config.gridSize - 2; y += 2) {
    for (let x = 2; x < state.config.gridSize - 2; x += 2) {
      if (obstacles.length >= target) return obstacles;
      const point = { x, y };
      if (Math.abs(x - head.x) + Math.abs(y - head.y) <= 3) continue;
      if (occupied.some((cell) => samePoint(cell, point))) continue;
      obstacles.push(point);
    }
  }
  return obstacles;
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

  if (bodyToCheck.some((segment) => samePoint(segment, nextHead)) ||
      (state.mode === "arcade" && state.obstacles.some((point) => samePoint(point, nextHead)))) {
    return { ...state, status: "over" };
  }

  const eatsBonus = state.mode === "arcade" && state.bonus !== null &&
    samePoint(nextHead, state.bonus.position);
  const snake = [nextHead, ...(eatsFood ? state.snake : state.snake.slice(0, -1))];
  const bonusValue = eatsBonus ? state.bonus?.value ?? 0 : 0;
  const score = state.score + (eatsFood ? 1 : 0) + bonusValue;
  const bonusPoints = state.bonusPoints + bonusValue;
  let bonus = state.mode === "arcade" && state.bonus && !eatsBonus && state.bonus.ticksLeft > 1
    ? { ...state.bonus, ticksLeft: state.bonus.ticksLeft - 1 } : null;

  if (state.mode === "classic" && eatsFood && score >= winScore) {
    return { ...state, snake, score, status: "won" };
  }

  const obstacles = state.mode === "arcade" && eatsFood
    ? addObstacles({ ...state, snake, score, bonusPoints, bonus }) : state.obstacles;
  let food = state.food;
  if (eatsFood) {
    food = spawnFood([...snake, ...obstacles, ...(bonus ? [bonus.position] : [])], gridSize, rng);
    if (!food && bonus) {
      bonus = null;
      food = spawnFood([...snake, ...obstacles], gridSize, rng);
    }
    const progress = score - bonusPoints;
    if (state.mode === "arcade" && food && !bonus && progress >= 10 && progress % 5 === 0) {
      const position = spawnFood([...snake, ...obstacles, food], gridSize, rng);
      if (position) {
        const settings = getArcadeLevelSettings(getLevel(progress));
        bonus = {
          position,
          value: settings.bonusValue,
          ticksLeft: settings.bonusTicks,
          ticksTotal: settings.bonusTicks,
        };
      }
    }
  }
  return {
    ...state, snake, score, bonusPoints, obstacles, food, bonus,
    status: eatsFood && food === null ? "won" : "running",
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
