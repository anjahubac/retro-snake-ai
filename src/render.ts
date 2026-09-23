import type { GameState, Point } from "./game/types";

export const CELL = 20;

type Palette = {
  panel: string;
  board: string;
  grid: string;
  text: string;
  accent: string;
  head: string;
  body: string;
  tail: string;
  food: string;
  success: string;
  error: string;
};

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string): string => styles.getPropertyValue(name).trim();

  return {
    panel: read("--panel-bg"),
    board: read("--board-bg"),
    grid: read("--grid"),
    text: read("--text"),
    accent: read("--accent"),
    head: read("--snake-head"),
    body: read("--snake-body"),
    tail: read("--snake-tail"),
    food: read("--food"),
    success: read("--success"),
    error: read("--error"),
  };
}

function snap(value: number, scale: number): number {
  return Math.round(value * scale) / scale;
}

function fillSnappedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  scale: number,
): void {
  const left = snap(x, scale);
  const top = snap(y, scale);
  const right = snap(x + width, scale);
  const bottom = snap(y + height, scale);
  ctx.fillRect(left, top, right - left, bottom - top);
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.startsWith("#") ? hex.slice(1) : hex;
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function interpolateColor(start: string, end: string, factor: number): string {
  const from = hexToRgb(start);
  const to = hexToRgb(end);
  const channels = from.map((value, index) =>
    Math.round(value + ((to[index] ?? value) - value) * factor),
  );

  return `rgb(${channels[0]} ${channels[1]} ${channels[2]})`;
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  gridSize: number,
  scale: number,
  color: string,
): void {
  ctx.fillStyle = color;
  const line = 1 / scale;

  for (let index = 0; index <= gridSize; index += 1) {
    const edge = index * CELL;
    fillSnappedRect(ctx, edge, 0, line, gridSize * CELL, scale);
    fillSnappedRect(ctx, 0, edge, gridSize * CELL, line, scale);
  }
}

function drawFood(
  ctx: CanvasRenderingContext2D,
  food: Point,
  scale: number,
  color: string,
): void {
  const x = food.x * CELL;
  const y = food.y * CELL;
  ctx.fillStyle = color;
  fillSnappedRect(ctx, x + 8, y + 3, 4, 3, scale);
  fillSnappedRect(ctx, x + 5, y + 6, 10, 3, scale);
  fillSnappedRect(ctx, x + 3, y + 9, 14, 3, scale);
  fillSnappedRect(ctx, x + 5, y + 12, 10, 3, scale);
  fillSnappedRect(ctx, x + 8, y + 15, 4, 2, scale);
}

function drawSnake(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  scale: number,
  palette: Palette,
): void {
  const { snake } = state;
  const denominator = Math.max(1, snake.length - 2);

  for (let index = snake.length - 1; index >= 1; index -= 1) {
    const segment = snake[index];
    if (segment === undefined) continue;

    const factor = (index - 1) / denominator;
    ctx.fillStyle = interpolateColor(palette.body, palette.tail, factor);
    fillSnappedRect(
      ctx,
      segment.x * CELL + 1,
      segment.y * CELL + 1,
      18,
      18,
      scale,
    );
  }

  const head = snake[0];
  if (head === undefined) return;

  const cellX = head.x * CELL;
  const cellY = head.y * CELL;
  ctx.fillStyle = palette.head;
  fillSnappedRect(ctx, cellX + 1, cellY + 1, 18, 18, scale);

  const eyeRects: ReadonlyArray<readonly [number, number, number]> = [
    [13, 4, 3],
    [13, 13, 3],
  ];
  const pupilRects: ReadonlyArray<readonly [number, number, number]> = [
    [15, 5, 1],
    [15, 14, 1],
  ];
  const rotation = { right: 0, down: 1, left: 2, up: 3 }[state.direction];
  const rotate = (x: number, y: number, size: number): [number, number] => {
    if (rotation === 1) return [CELL - y - size, x];
    if (rotation === 2) return [CELL - x - size, CELL - y - size];
    if (rotation === 3) return [y, CELL - x - size];
    return [x, y];
  };

  ctx.fillStyle = palette.text;
  for (const [x, y, size] of eyeRects) {
    const [eyeX, eyeY] = rotate(x, y, size);
    fillSnappedRect(ctx, cellX + eyeX, cellY + eyeY, size, size, scale);
  }

  ctx.fillStyle = palette.board;
  for (const [x, y, size] of pupilRects) {
    const [pupilX, pupilY] = rotate(x, y, size);
    fillSnappedRect(ctx, cellX + pupilX, cellY + pupilY, size, size, scale);
  }
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  palette: Palette,
  logicalEdge: number,
  scale: number,
): void {
  if (state.status === "running") return;

  const copy = {
    ready: ["SPREMNI?", "Pritisni Space", "Strelice / W A S D"],
    paused: ["PAUZA", "Space za nastavak", "Partija je zaustavljena"],
    over: ["KRAJ IGRE", "Space za novu partiju", "Zatim Space za start"],
    won: ["POBEDA!", "Space za novu partiju", "Zatim Space za start"],
  } as const;
  if (state.status !== "ready" && state.status !== "paused" && state.status !== "over" && state.status !== "won") return;

  const [title, firstLine, secondLine] = copy[state.status];
  const width = Math.min(300, logicalEdge - 24);
  const left = (logicalEdge - width) / 2;
  const top = (logicalEdge - 104) / 2;
  const border = state.status === "won" ? palette.success : state.status === "over" ? palette.error : palette.accent;

  ctx.save();
  ctx.fillStyle = palette.panel;
  fillSnappedRect(ctx, left, top, width, 104, scale);
  ctx.fillStyle = border;
  fillSnappedRect(ctx, left, top, width, 2, scale);
  fillSnappedRect(ctx, left, top + 102, width, 2, scale);
  fillSnappedRect(ctx, left, top, 2, 104, scale);
  fillSnappedRect(ctx, left + width - 2, top, 2, 104, scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = palette.text;
  ctx.font = "bold 20px ui-monospace, monospace";
  ctx.fillText(title, logicalEdge / 2, top + 27);
  ctx.font = "12px ui-monospace, monospace";
  ctx.fillText(firstLine, logicalEdge / 2, top + 57);

  const smallFont = "11px ui-monospace, monospace";
  ctx.font = "12px ui-monospace, monospace";
  if (ctx.measureText(secondLine).width > width - 16) {
    ctx.font = smallFont;
  }
  ctx.fillText(secondLine, logicalEdge / 2, top + 79);
  ctx.restore();
}

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  const logicalEdge = state.config.gridSize * CELL;
  const canvas = ctx.canvas;

  const cssEdge = canvas.getBoundingClientRect().width;
  if (!(cssEdge > 0)) return;

  const pixelEdge = Math.max(
    1,
    Math.round(cssEdge * (window.devicePixelRatio || 1)),
  );
  if (canvas.width !== pixelEdge) canvas.width = pixelEdge;
  if (canvas.height !== pixelEdge) canvas.height = pixelEdge;

  const scale = pixelEdge / logicalEdge;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = false;

  const palette = readPalette();
  ctx.fillStyle = palette.board;
  ctx.fillRect(0, 0, logicalEdge, logicalEdge);
  drawGrid(ctx, state.config.gridSize, scale, palette.grid);
  if (state.food !== null) drawFood(ctx, state.food, scale, palette.food);
  drawSnake(ctx, state, scale, palette);
  drawOverlay(ctx, state, palette, logicalEdge, scale);
}
