import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, getLevel, getTickMs, handleSpace, tick } from "../src/game/logic";
import type { GameState, Point } from "../src/game/types";

const rng = () => 0;
const config = { ...DEFAULT_CONFIG, gridSize: 10, winScore: 1 };

function runningArcade(snake: Point[], extra: Partial<GameState> = {}): GameState {
  return {
    ...createInitialState(config, rng, "arcade"),
    snake,
    status: "running",
    ...extra,
  };
}

describe("Arcade režim", () => {
  it("Classic je podrazumevan, a Arcade se upisuje u stanje", () => {
    expect(createInitialState(config, rng).mode).toBe("classic");
    expect(createInitialState(config, rng, "arcade").mode).toBe("arcade");
  });

  it.each([
    [0, 1],
    [4, 1],
    [5, 2],
    [9, 2],
    [10, 3],
  ])("score %i daje nivo %i", (score, level) => {
    expect(getLevel(score)).toBe(level);
  });

  it("ubrzava po nivou, a Classic zadržava fiksni interval", () => {
    expect(getTickMs(config, "arcade", 0)).toBe(150);
    expect(getTickMs(config, "arcade", 5)).toBe(140);
    expect(getTickMs(config, "arcade", 10)).toBe(130);
    expect(getTickMs({ ...config, tickMs: 60 }, "arcade", 50)).toBe(60);
    expect(getTickMs(config, "classic", 50)).toBe(config.tickMs);
  });

  it("nastavlja posle winScore i hrana i dalje donosi poen i rast", () => {
    const state = runningArcade(
      [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
      { food: { x: 6, y: 5 } },
    );

    const next = tick(state, rng);
    expect(next.status).toBe("running");
    expect(next.score).toBe(1);
    expect(next.snake).toHaveLength(4);
    expect(next.food).not.toBeNull();
  });

  it("ne menja stanje igre kad zmija pojede hranu", () => {
    const state = runningArcade(
      [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
      { food: { x: 6, y: 5 } },
    );
    const before = structuredClone(state);

    tick(state, rng);

    expect(state).toEqual(before);
  });

  it("pobeđuje kad pojede poslednje slobodno polje", () => {
    const head = { x: 5, y: 5 };
    const food = { x: 6, y: 5 };
    const snake: Point[] = [head];
    for (let y = 0; y < config.gridSize; y += 1) {
      for (let x = 0; x < config.gridSize; x += 1) {
        if ((x !== head.x || y !== head.y) && (x !== food.x || y !== food.y)) {
          snake.push({ x, y });
        }
      }
    }

    const next = tick(runningArcade(snake, { food }), rng);
    expect(next.status).toBe("won");
    expect(next.score).toBe(1);
    expect(next.food).toBeNull();
  });

  it("restart posle kraja zadržava Arcade režim i vraća nivo na jedan", () => {
    const over = runningArcade([{ x: 5, y: 5 }, { x: 4, y: 5 }], {
      status: "over",
      score: 10,
    });
    const next = handleSpace(over, rng);
    expect(next.mode).toBe("arcade");
    expect(next.status).toBe("ready");
    expect(next.score).toBe(0);
    expect(getLevel(next.score)).toBe(1);
  });

  it("Classic i dalje pobeđuje na winScore", () => {
    const classic = {
      ...createInitialState(config, rng),
      snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }],
      food: { x: 6, y: 5 },
      status: "running" as const,
    };
    expect(tick(classic, rng).status).toBe("won");
  });

  it("pauzirani Arcade tick ne menja stanje", () => {
    const paused = runningArcade([{ x: 5, y: 5 }, { x: 4, y: 5 }], {
      status: "paused",
      score: 5,
    });
    expect(tick(paused, rng)).toBe(paused);
  });
});
