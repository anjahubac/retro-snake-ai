import { loadConfig, DEFAULT_CONFIG } from "./game/config";
import {
  changeDirection,
  createInitialState,
  togglePause,
  handleSpace,
  tick,
} from "./game/logic";
import type { Direction } from "./game/types";
import { FAKE_MODES, createFakeClient } from "./ai/fakeClient";
import type { FakeMode } from "./ai/fakeClient";
import { requestHint, SAFE_MESSAGE } from "./ai/hintFlow";
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
const statusElement = requireElement("#status", HTMLParagraphElement);
const configErrorElement = requireElement("#config-error", HTMLParagraphElement);
const hintButton = requireElement("#hint-btn", HTMLButtonElement);
const aiModeElement = requireElement("#ai-mode", HTMLSpanElement);
const hintPanel = requireElement("#hint-panel", HTMLElement);
const hintLabel = requireElement("#hint-label", HTMLParagraphElement);
const hintElement = requireElement("#hint", HTMLParagraphElement);
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

const requestedMode = params.get("ai");
const mode: FakeMode = FAKE_MODES.find((candidate) => candidate === requestedMode) ?? "success";
const client = createFakeClient(mode);
aiModeElement.textContent = `AI: fake (${mode})`;

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

let hintPending = false;

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.target instanceof HTMLButtonElement) {
    return;
  }

  const direction = KEY_DIRECTIONS[event.key] ?? KEY_DIRECTIONS[event.key.toLowerCase()];
  const isSpace = event.code === "Space";

  if (hintPending) {
    if (isSpace || direction !== undefined) {
      event.preventDefault();
    }
    return;
  }

  if (isSpace) {
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    state = handleSpace(state, Math.random);
    draw();
    return;
  }

  if (direction === undefined) {
    return;
  }

  event.preventDefault();
  state = changeDirection(state, direction);
  draw();
});

hintButton.addEventListener("click", async () => {
  if (hintPending) return;

  const restoreButtonFocus = document.activeElement === hintButton;
  hintPending = true;
  hintButton.disabled = true;
  hintElement.setAttribute("aria-busy", "true");
  hintPanel.dataset.state = "pending";
  hintLabel.textContent = "Savet se priprema";
  hintElement.textContent = "Razmišljam…";

  if (state.status === "running") {
    state = togglePause(state);
    draw();
  }

  try {
    const result = await requestHint({ client, getState: () => state });
    if (result.ok) {
      hintElement.textContent = `${result.hint.hint} → ${result.hint.suggestedAction} (${result.hint.urgency})`;
      hintPanel.dataset.state = "success";
      hintLabel.textContent = "Savet spreman";
    } else {
      hintElement.textContent = result.message;
      hintPanel.dataset.state = "error";
      hintLabel.textContent = "Savet nije dostupan";
    }
  } catch {
    hintElement.textContent = SAFE_MESSAGE;
    hintPanel.dataset.state = "error";
    hintLabel.textContent = "Savet nije dostupan";
  } finally {
    hintPending = false;
    hintButton.disabled = false;
    hintElement.removeAttribute("aria-busy");
    if (
      restoreButtonFocus &&
      document.hasFocus() &&
      (document.activeElement === document.body || document.activeElement === document.documentElement)
    ) {
      hintButton.focus();
    }
  }
});

window.setInterval(() => {
  state = tick(state, Math.random);
  draw();
}, config.tickMs);

draw();
