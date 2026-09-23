import { loadConfig, DEFAULT_CONFIG } from "./game/config";
import {
  changeDirection,
  createInitialState,
  getArcadeLevelSettings,
  getLevel,
  getObstacleCapacity,
  getTickMs,
  handleSpace,
  tick,
} from "./game/logic";
import type { Direction, GameMode } from "./game/types";
import { CELL, render } from "./render";

function requireElement<T extends Element>(
  selector: string,
  constructor: { new (): T },
): T {
  const element = document.querySelector(selector);
  if (!(element instanceof constructor)) {
    throw new Error(`Nedostaje ili nije ispravan DOM element: ${selector}`);
  }
  return element;
}

const canvas = requireElement("#board", HTMLCanvasElement);
const scoreElement = requireElement("#score", HTMLSpanElement);
const modeElement = requireElement("#game-mode", HTMLSelectElement);
const levelElement = requireElement("#level", HTMLParagraphElement);
const levelValueElement = requireElement("#level-value", HTMLSpanElement);
const arcadeDetails = requireElement("#arcade-details", HTMLDivElement);
const arcadeProgress = requireElement("#arcade-progress", HTMLParagraphElement);
const bonusStatus = requireElement("#bonus-status", HTMLParagraphElement);
const statusElement = requireElement("#status", HTMLParagraphElement);
const configErrorElement = requireElement("#config-error", HTMLParagraphElement);
const context = canvas.getContext("2d");

if (context === null) {
  throw new Error("Canvas 2D kontekst nije dostupan");
}
const canvasContext: CanvasRenderingContext2D = context;

const params = new URLSearchParams(window.location.search);
const requestedMode = params.get("mode");
const initialMode: GameMode = requestedMode === "arcade" ? "arcade" : "classic";
let config = DEFAULT_CONFIG;

if (params.has("config")) {
  let input: unknown;
  try {
    input = JSON.parse(params.get("config") ?? "");
  } catch {
    input = "invalid-json";
  }

  const result = loadConfig(input);
  config = result.config;
  if (result.errors.length > 0) {
    configErrorElement.textContent =
      `Konfiguracija nije validna, koristi se podrazumevana: ${result.errors.join("; ")}`;
    configErrorElement.hidden = false;
  }
}

canvas.width = config.gridSize * CELL;
canvas.height = config.gridSize * CELL;

let state = createInitialState(config, Math.random, initialMode);
modeElement.value = initialMode;

const STATUS_TEXT = {
  ready: "Pritisni Space",
  running: "Igra",
  paused: "Pauza",
  over: "Kraj — Space za novu",
  won: "Pobeda! — Space za novu",
} as const;

function draw(): void {
  render(canvasContext, state);
  const scoreText = String(state.score);
  const statusText = STATUS_TEXT[state.status];
  const level = String(getLevel(state.score - state.bonusPoints));
  levelElement.hidden = state.mode !== "arcade";
  modeElement.value = state.mode;
  arcadeDetails.hidden = state.mode !== "arcade";
  const progress = state.score - state.bonusPoints;
  const difficulty = getArcadeLevelSettings(getLevel(progress));
  const obstacleTarget = Math.min(difficulty.obstacleTarget, getObstacleCapacity(state.config.gridSize));
  arcadeProgress.textContent = `${progress % 5}/5 hrane do sledećeg nivoa · Prepreke: ${state.obstacles.length}/${obstacleTarget}`;
  bonusStatus.textContent = state.bonus
    ? `Zlatni bonus +${state.bonus.value} · još ${state.bonus.ticksLeft} poteza`
    : `Bonus od nivoa 3: +${difficulty.bonusValue}, rok ${difficulty.bonusTicks} poteza.`;

  if (scoreElement.textContent !== scoreText) {
    scoreElement.textContent = scoreText;
  }
  if (levelValueElement.textContent !== level) {
    levelValueElement.textContent = level;
  }
  if (statusElement.textContent !== statusText) {
    statusElement.textContent = statusText;
  }
}

const KEY_DIRECTIONS: Readonly<Record<string, Direction>> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  a: "left",
  s: "down",
  d: "right",
};

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLSelectElement) {
    return;
  }

  const direction = KEY_DIRECTIONS[event.key] ?? KEY_DIRECTIONS[event.key.toLowerCase()];
  const isSpace = event.code === "Space";

  if (isSpace) {
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    state = handleSpace(state, Math.random);
    draw();
    syncTickTimer();
    return;
  }

  if (direction === undefined) {
    return;
  }

  event.preventDefault();
  state = changeDirection(state, direction);
  draw();
});

modeElement.addEventListener("change", () => {
  const mode: GameMode = modeElement.value === "arcade" ? "arcade" : "classic";
  state = createInitialState(config, Math.random, mode);
  draw();
  syncTickTimer();
});

let scheduledTickMs = getTickMs(state.config, state.mode, state.score - state.bonusPoints);
let tickTimer = 0;

function syncTickTimer(): void {
  const nextTickMs = getTickMs(state.config, state.mode, state.score - state.bonusPoints);
  if (nextTickMs === scheduledTickMs) return;
  window.clearInterval(tickTimer);
  scheduledTickMs = nextTickMs;
  tickTimer = window.setInterval(runTick, scheduledTickMs);
}

function runTick(): void {
  state = tick(state, Math.random);
  draw();
  syncTickTimer();
}

tickTimer = window.setInterval(runTick, scheduledTickMs);

draw();
