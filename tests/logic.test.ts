import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import {
  createInitialState, startGame, togglePause, changeDirection, tick, spawnFood, handleSpace,
} from "../src/game/logic";
import type { GameState, Point } from "../src/game/types";

const rng = () => 0;
const cfg = { ...DEFAULT_CONFIG, gridSize: 10 };

function running(snake: Point[], extra: Partial<GameState> = {}): GameState {
  return { ...createInitialState(cfg, rng), snake, status: "running", ...extra };
}

describe("createInitialState", () => {
  it("zmija u sredini, smer desno, status ready, hrana na prvom slobodnom polju", () => {
    const s = createInitialState(cfg, rng);
    expect(s.snake).toEqual([{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]);
    expect(s.direction).toBe("right");
    expect(s.status).toBe("ready");
    expect(s.score).toBe(0);
    expect(s.food).toEqual({ x: 0, y: 0 });
  });
});

describe("start, pauza, space", () => {
  it("startGame: ready -> running", () => {
    expect(startGame(createInitialState(cfg, rng)).status).toBe("running");
  });
  it("togglePause: running <-> paused", () => {
    const p = togglePause(startGame(createInitialState(cfg, rng)));
    expect(p.status).toBe("paused");
    expect(togglePause(p).status).toBe("running");
  });
  it("handleSpace posle kraja pravi novu partiju", () => {
    const over = running([{ x: 5, y: 5 }, { x: 4, y: 5 }], { status: "over", score: 7 });
    const n = handleSpace(over, rng);
    expect(n.status).toBe("ready");
    expect(n.score).toBe(0);
    expect(n.snake).toHaveLength(cfg.startLength);
  });
});

describe("changeDirection", () => {
  const s = startGame(createInitialState(cfg, rng));
  it("prihvata okret za 90°", () => {
    expect(changeDirection(s, "up").direction).toBe("up");
  });
  it("ignoriše okret za 180°", () => {
    expect(changeDirection(s, "left").direction).toBe("right");
  });
  it("ignoriše promenu posle kraja", () => {
    expect(changeDirection({ ...s, status: "over" }, "up").direction).toBe("right");
  });
});

describe("tick", () => {
  it("ne menja stanje kad igra nije running", () => {
    const ready = createInitialState(cfg, rng);
    expect(tick(ready, rng)).toBe(ready);
    const paused = togglePause(startGame(ready));
    expect(tick(paused, rng)).toBe(paused);
  });

  it("pomera zmiju za jedno polje", () => {
    const n = tick(startGame(createInitialState(cfg, rng)), rng);
    expect(n.snake).toEqual([{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }]);
  });

  it("ne menja ulazno stanje", () => {
    const s = startGame(createInitialState(cfg, rng));
    const before = structuredClone(s);
    tick(s, rng);
    expect(s).toEqual(before);
  });

  it("jede hranu: +1 poen, raste, nova hrana nije na zmiji", () => {
    const s = running([{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }], { food: { x: 6, y: 5 } });
    const n = tick(s, rng);
    expect(n.score).toBe(1);
    expect(n.snake).toHaveLength(4);
    expect(n.snake[0]).toEqual({ x: 6, y: 5 });
    expect(n.snake).not.toContainEqual(n.food);
  });

  it("pobeda kad poeni dostignu winScore", () => {
    const s = running([{ x: 5, y: 5 }, { x: 4, y: 5 }], {
      food: { x: 6, y: 5 },
      score: cfg.winScore - 1,
    });
    expect(tick(s, rng).status).toBe("won");
  });

  it("kraj kod gornjeg zida, zmija ostaje na tabli", () => {
    const snake = [{ x: 5, y: 0 }, { x: 5, y: 1 }];
    const n = tick(running(snake, { direction: "up" }), rng);
    expect(n.status).toBe("over");
    expect(n.snake).toEqual(snake);
  });

  it("kraj kad glava udari u telo", () => {
    const snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 }];
    expect(tick(running(snake, { direction: "up" }), rng).status).toBe("over");
  });

  it("polje repa je slobodno kad zmija ne jede", () => {
    const snake = [{ x: 5, y: 5 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 5 }];
    const n = tick(running(snake, { direction: "left" }), rng);
    expect(n.status).toBe("running");
    expect(n.snake[0]).toEqual({ x: 4, y: 5 });
  });
});

describe("spawnFood", () => {
  it("vraća jedino slobodno polje", () => {
    const snake: Point[] = [];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (!(x === 9 && y === 9)) snake.push({ x, y });
    expect(spawnFood(snake, 10, () => 0.99)).toEqual({ x: 9, y: 9 });
  });
  it("vraća null kad nema slobodnog polja", () => {
    const snake: Point[] = [];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) snake.push({ x, y });
    expect(spawnFood(snake, 10, rng)).toBeNull();
  });
});
