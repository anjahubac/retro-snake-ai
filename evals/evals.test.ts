import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, validateConfig, loadConfig } from "../src/game/config";
import { createInitialState, startGame, tick, changeDirection, spawnFood } from "../src/game/logic";
import type { Point } from "../src/game/types";

const rng = () => 0;

describe("EVALS", () => {
  it("E1 normalan start", () => {
    const s0 = createInitialState(DEFAULT_CONFIG, rng);
    expect(s0.status).toBe("ready");
    expect(s0.snake).toHaveLength(3);
    expect(s0.snake[0]).toEqual({ x: 10, y: 10 });
    expect(s0.snake).not.toContainEqual(s0.food);
    const s1 = tick(startGame(s0), rng);
    expect(s1.status).toBe("running");
    expect(s1.snake[0]).toEqual({ x: 11, y: 10 });
  });

  it("E2 zid: kraj i zmija ne izlazi van table", () => {
    const cfg = { ...DEFAULT_CONFIG, gridSize: 10 };
    const s = {
      ...createInitialState(cfg, rng),
      status: "running" as const,
      snake: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }],
    };
    const s1 = tick(s, rng);
    expect(s1.status).toBe("over");
    for (const p of s1.snake) {
      expect(p.x >= 0 && p.x < 10 && p.y >= 0 && p.y < 10).toBe(true);
    }
  });

  it("E3 nevalidan config: odbijanje i safe fallback", () => {
    const bad = { gridSize: -5, tickMs: "fast" };
    const v = validateConfig(bad);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.errors.length).toBeGreaterThanOrEqual(2);
    const l = loadConfig(bad);
    expect(l.config).toEqual(DEFAULT_CONFIG);
    expect(l.errors.length).toBeGreaterThanOrEqual(2);
  });

  it("E4 dva brza pritiska u jednom tick-u ne okreću zmiju u vrat", () => {
    let s = startGame(createInitialState(DEFAULT_CONFIG, rng)); // ide desno
    s = changeDirection(s, "up");
    s = changeDirection(s, "left");
    const s1 = tick(s, rng);
    expect(s1.status).toBe("running");
    expect(s1.snake[0]).toEqual({ x: 10, y: 9 });
  });

  it("E5 hrana se nikad ne stvara na zmiji", () => {
    const snake: Point[] = [];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (!(x === 9 && y === 9)) snake.push({ x, y });
    for (const r of [0, 0.5, 0.999]) {
      expect(spawnFood(snake, 10, () => r)).toEqual({ x: 9, y: 9 });
    }
  });
});
