import { loadConfig, DEFAULT_CONFIG } from "./game/config";
import {
  changeDirection,
  createInitialState,
  handleSpace,
  tick,
} from "./game/logic";
import type { Direction } from "./game/types";
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
const statusElement = requireElement("#status", HTMLSpanElement);
const configErrorElement = requireElement("#config-error", HTMLParagraphElement);
const context = canvas.getContext("2d");

if (context === null) {
  throw new Error("Canvas 2D kontekst nije dostupan");
}
const canvasContext: CanvasRenderingContext2D = context;

const params = new URLSearchParams(window.location.search);
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

let state = createInitialState(config, Math.random);

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

  if (scoreElement.textContent !== scoreText) {
    scoreElement.textContent = scoreText;
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
  if (event.code === "Space") {
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    state = handleSpace(state, Math.random);
    draw();
    return;
  }

  const direction = KEY_DIRECTIONS[event.key] ?? KEY_DIRECTIONS[event.key.toLowerCase()];
  if (direction === undefined) {
    return;
  }

  event.preventDefault();
  state = changeDirection(state, direction);
  draw();
});

window.setInterval(() => {
  state = tick(state, Math.random);
  draw();
}, config.tickMs);

draw();
