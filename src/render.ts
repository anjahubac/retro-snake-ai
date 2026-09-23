import type { GameState, Point } from "./game/types";

export const CELL = 20;

type Palette = {
  panel: string;
  board: string;
  grid: string;
  text: string;
  accent: string;
  head: string;
  headShadow: string;
  body: string;
  tail: string;
  snakeGlow: string;
  food: string;
  foodLight: string;
  foodShadow: string;
  leaf: string;
  obstacle: string;
  bonus: string;
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
    headShadow: read("--snake-shadow"),
    body: read("--snake-body"),
    tail: read("--snake-tail"),
    snakeGlow: read("--snake-glow"),
    food: read("--food"),
    foodLight: read("--food-light"),
    foodShadow: read("--food-shadow"),
    leaf: read("--food-leaf"),
    obstacle: read("--obstacle"),
    bonus: read("--bonus"),
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
  color: string,
  palette: Palette,
): void {
  const centerX = food.x * CELL + CELL / 2;
  const centerY = food.y * CELL + 11;

  ctx.save();
  const glow = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, 11);
  glow.addColorStop(0, `${color}55`);
  glow.addColorStop(1, `${color}00`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 11, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = `${color}66`;
  ctx.shadowBlur = 5;
  const fruit = ctx.createLinearGradient(centerX - 5, centerY - 7, centerX + 5, centerY + 7);
  fruit.addColorStop(0, palette.foodLight);
  fruit.addColorStop(0.48, color);
  fruit.addColorStop(1, palette.foodShadow);
  ctx.fillStyle = fruit;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, 6.5, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgb(255 255 255 / 72%)";
  ctx.beginPath();
  ctx.ellipse(centerX - 2.5, centerY - 3, 1.4, 2, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette.foodShadow;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 6);
  ctx.quadraticCurveTo(centerX + 0.5, centerY - 9, centerX + 2, centerY - 9.5);
  ctx.stroke();

  ctx.fillStyle = palette.leaf;
  ctx.beginPath();
  ctx.ellipse(centerX + 4, centerY - 8, 2.6, 1.25, -0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawArcadeItems(ctx: CanvasRenderingContext2D, state: GameState, palette: Palette): void {
  if (state.mode !== "arcade") return;
  ctx.save();
  for (const point of state.obstacles) {
    const x = point.x * CELL + 2;
    const y = point.y * CELL + 2;
    ctx.fillStyle = palette.obstacle;
    ctx.beginPath();
    ctx.roundRect(x, y, 16, 16, 4);
    ctx.fill();
    ctx.strokeStyle = palette.board;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 5);
    ctx.lineTo(x + 11, y + 11);
    ctx.moveTo(x + 11, y + 5);
    ctx.lineTo(x + 5, y + 11);
    ctx.stroke();
  }
  if (state.bonus) {
    const x = state.bonus.position.x * CELL + CELL / 2;
    const y = state.bonus.position.y * CELL + CELL / 2;
    ctx.fillStyle = palette.bonus;
    ctx.shadowColor = palette.bonus;
    ctx.shadowBlur = 7;
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = i * Math.PI / 5 - Math.PI / 2;
      const radius = i % 2 === 0 ? 8 : 4;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = palette.bonus;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * state.bonus.ticksLeft / state.bonus.ticksTotal);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSnake(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  palette: Palette,
): void {
  const { snake } = state;
  const tail = snake[snake.length - 1];
  const head = snake[0];
  if (head === undefined || tail === undefined) return;

  const path = new Path2D();
  path.moveTo(tail.x * CELL + CELL / 2, tail.y * CELL + CELL / 2);
  for (let index = snake.length - 2; index >= 0; index -= 1) {
    const segment = snake[index];
    if (segment !== undefined) {
      path.lineTo(segment.x * CELL + CELL / 2, segment.y * CELL + CELL / 2);
    }
  }

  const bodyGradient = ctx.createLinearGradient(
    head.x * CELL + CELL / 2,
    head.y * CELL + CELL / 2,
    tail.x * CELL + CELL / 2,
    tail.y * CELL + CELL / 2,
  );
  bodyGradient.addColorStop(0, palette.body);
  bodyGradient.addColorStop(1, palette.tail);

  ctx.save();
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = palette.snakeGlow;
  ctx.shadowBlur = 4;
  ctx.strokeStyle = bodyGradient;
  ctx.stroke(path);
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(255 255 255 / 24%)";
  ctx.stroke(path);
  ctx.restore();

  const cellX = head.x * CELL;
  const cellY = head.y * CELL;
  const face = ctx.createLinearGradient(cellX + 2, cellY + 1, cellX + 17, cellY + 19);
  face.addColorStop(0, palette.body);
  face.addColorStop(0.35, palette.head);
  face.addColorStop(1, palette.headShadow);
  ctx.fillStyle = face;
  ctx.save();
  ctx.shadowColor = palette.snakeGlow;
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.roundRect(cellX + 1, cellY + 1, 18, 18, 7);
  ctx.fill();
  ctx.restore();

  const orient = (x: number, y: number): [number, number] => {
    if (state.direction === "down") return [CELL - y, x];
    if (state.direction === "left") return [CELL - x, CELL - y];
    if (state.direction === "up") return [y, CELL - x];
    return [x, y];
  };

  for (const [eyeX, eyeY] of [[13, 6], [13, 14]] as const) {
    const [x, y] = orient(eyeX, eyeY);
    ctx.fillStyle = palette.text;
    ctx.beginPath();
    ctx.arc(cellX + x, cellY + y, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.board;
    ctx.beginPath();
    ctx.arc(cellX + x + 0.45, cellY + y, 1.15, 0, Math.PI * 2);
    ctx.fill();
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
  if (state.food !== null) drawFood(ctx, state.food, palette.food, palette);
  drawArcadeItems(ctx, state, palette);
  drawSnake(ctx, state, palette);
  drawOverlay(ctx, state, palette, logicalEdge, scale);
}
