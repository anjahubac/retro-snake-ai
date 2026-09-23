import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, getArcadeLevelSettings, getLevel, getObstacleCapacity, getTickMs, handleSpace, tick } from "../src/game/logic";
import type { GameState, Point } from "../src/game/types";

const rng = () => 0;
function setup(extra: Partial<GameState> = {}): GameState {
  return { ...createInitialState(DEFAULT_CONFIG, rng, "arcade"),
    status: "running", snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }],
    food: { x: 11, y: 10 }, ...extra };
}

describe("Arcade prepreke i bonusi", () => {
  it.each([[3, 0], [4, 2], [9, 4], [14, 6], [19, 8], [24, 10], [29, 12], [44, 18], [49, 18], [59, 18]])(
    "posle hrane sa rezultata %i ima %i prepreka", (score, count) => {
      expect(tick(setup({ score }), rng).obstacles).toHaveLength(count);
    });

  it.each([10, 11, 20, 29, 30])("bezbedan spawn i povezani prolazi na tabli %i", (gridSize) => {
    const state = setup({ config: { ...DEFAULT_CONFIG, gridSize }, score: 49,
      snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }], food: { x: 6, y: 5 } });
    const before = structuredClone(state);
    const next = tick(state, rng);
    expect(state).toEqual(before);
    const blocked = new Set(next.obstacles.map(p => `${p.x},${p.y}`));
    for (const p of next.obstacles) {
      expect(next.snake).not.toContainEqual(p);
      expect(p).not.toEqual(next.food);
      expect(p).not.toEqual(next.bonus?.position);
      expect(Math.abs(p.x - 6) + Math.abs(p.y - 5)).toBeGreaterThan(3);
    }
    const visited = new Set<string>(["0,0"]);
    const queue: Point[] = [{ x: 0, y: 0 }];
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i];
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const x = p.x + dx, y = p.y + dy, key = `${x},${y}`;
        if (x < 0 || y < 0 || x >= gridSize || y >= gridSize || blocked.has(key) || visited.has(key)) continue;
        visited.add(key); queue.push({ x, y });
      }
    }
    expect(visited.size).toBe(gridSize * gridSize - blocked.size);
    expect(next.bonus?.position).not.toEqual(next.food);
    expect(next.snake).not.toContainEqual(next.food);
    expect(next.snake).not.toContainEqual(next.bonus?.position);
  });

  it("sudar sa preprekom završava partiju bez pomeranja", () => {
    const state = setup({ food: { x: 0, y: 0 }, obstacles: [{ x: 11, y: 10 }] });
    const next = tick(state, rng);
    expect(next.status).toBe("over");
    expect(next.snake).toEqual(state.snake);
  });

  it("hrana izbegava prepreke i aktivan bonus", () => {
    const next = tick(setup({ obstacles: [{ x: 0, y: 0 }],
      bonus: { position: { x: 1, y: 0 }, value: 3, ticksLeft: 30, ticksTotal: 60 } }), rng);
    expect(next.food).toEqual({ x: 2, y: 0 });
  });

  it("bonus se javlja na pragovima i prati trajanje po nivou", () => {
    expect(tick(setup({ score: 4 }), rng).bonus).toBeNull();
    expect(tick(setup({ score: 9 }), rng).bonus).toMatchObject({ value: 3, ticksLeft: 60, ticksTotal: 60 });
    expect(tick(setup({ score: 14 }), rng).bonus).toMatchObject({ value: 3, ticksLeft: 56, ticksTotal: 56 });
    expect(tick(setup({ score: 19 }), rng).bonus).toMatchObject({ value: 4, ticksLeft: 52, ticksTotal: 52 });
    expect(tick(setup({ score: 44 }), rng).bonus).toMatchObject({ value: 6, ticksLeft: 32, ticksTotal: 32 });
    expect(tick(setup({ score: 49 }), rng).bonus).toMatchObject({ value: 6, ticksLeft: 32, ticksTotal: 32 });
    expect(tick(setup({ score: 10 }), rng).bonus).toBeNull();
  });

  it("aktivan bonus se ne zamenjuje niti mu se produžava trajanje", () => {
    const next = tick(setup({ score: 14, bonus: { position: { x: 0, y: 0 }, value: 3, ticksLeft: 20, ticksTotal: 60 } }), rng);
    expect(next.bonus).toEqual({ position: { x: 0, y: 0 }, value: 3, ticksLeft: 19, ticksTotal: 60 });
  });

  it.each([1, 60])("bonus sa %i preostalih poteza daje +3 bez rasta i promene nivoa/tempa", (ticksLeft) => {
    const state = setup({ score: 14, food: { x: 0, y: 0 },
      bonus: { position: { x: 11, y: 10 }, value: 3, ticksLeft, ticksTotal: 60 } });
    const before = structuredClone(state);
    const next = tick(state, rng);
    expect(state).toEqual(before);
    expect(next.score).toBe(17);
    expect(next.bonusPoints).toBe(3);
    expect(next.snake).toHaveLength(2);
    expect(next.food).toEqual(state.food);
    expect(next.bonus).toBeNull();
    expect(getLevel(next.score - next.bonusPoints)).toBe(3);
    expect(getTickMs(next.config, next.mode, next.score - next.bonusPoints)).toBe(130);
  });

  it("bonus poeni ne pomeraju prag sledećeg bonusa", () => {
    const next = tick(setup({ score: 17, bonusPoints: 3 }), rng);
    expect(next.bonus).toMatchObject({ value: 3, ticksLeft: 56, ticksTotal: 56 });
    expect(getLevel(next.score - next.bonusPoints)).toBe(4);
  });

  it("istek uklanja bonus bez poena", () => {
    const next = tick(setup({ food: { x: 0, y: 0 },
      bonus: { position: { x: 1, y: 0 }, value: 3, ticksLeft: 1, ticksTotal: 60 } }), rng);
    expect(next.bonus).toBeNull();
    expect(next.score).toBe(0);
  });

  it.each(["ready", "paused", "over", "won"] as const)("%s zamrzava bonus", status => {
    const state = setup({ status, bonus: { position: { x: 0, y: 0 }, value: 3, ticksLeft: 20, ticksTotal: 60 } });
    expect(tick(state, rng)).toBe(state);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20])("nivo %i koristi parametre tabele do limita 10", (level) => {
    const settings = getArcadeLevelSettings(level);
    expect(settings.level).toBe(Math.min(level, 10));
    expect(settings.obstacleTarget).toBe(Math.min(18, 2 * (Math.min(level, 10) - 1)));
    if (level < 3) expect(settings).toMatchObject({ bonusValue: 0, bonusTicks: 0 });
  });

  it.each([
    [1, 0, 0, 0], [2, 2, 0, 0], [3, 4, 3, 60], [4, 6, 3, 56],
    [5, 8, 4, 52], [6, 10, 4, 48], [7, 12, 5, 44], [8, 14, 5, 40],
    [9, 16, 6, 36], [10, 18, 6, 32], [11, 18, 6, 32],
  ])("nivo %i prati tabelu progresije", (level, obstacles, bonusValue, bonusTicks) => {
    expect(getArcadeLevelSettings(level)).toEqual({
      level: Math.min(level, 10), obstacleTarget: obstacles, bonusValue, bonusTicks,
    });
  });

  it("tempo ostaje na težini nivoa 10 i kasnije", () => {
    expect(getTickMs(DEFAULT_CONFIG, "arcade", 45)).toBe(60);
    expect(getTickMs(DEFAULT_CONFIG, "arcade", 50)).toBe(60);
    const slowerStart = { ...DEFAULT_CONFIG, tickMs: 400 };
    expect(getTickMs(slowerStart, "arcade", 45)).toBe(310);
    expect(getTickMs(slowerStart, "arcade", 50)).toBe(310);
  });

  it.each([10, 20, 30])("prepreke imaju tabli prilagođen cilj na mreži %i", grid => {
    expect(getObstacleCapacity(grid)).toBe(Math.ceil((grid - 4) / 2) ** 2);
  });

  it("bonus vrednost i trajanje se ne menjaju pri prelasku nivoa", () => {
    const next = tick(setup({ score: 14, bonus: { position: { x: 0, y: 0 }, value: 3, ticksLeft: 20, ticksTotal: 56 } }), rng);
    expect(next.bonus).toEqual({ position: { x: 0, y: 0 }, value: 3, ticksLeft: 19, ticksTotal: 56 });
  });

  it("restart čisti sve Arcade dodatke", () => {
    const state = setup({ status: "over", score: 18, bonusPoints: 3,
      obstacles: [{ x: 2, y: 2 }], bonus: { position: { x: 0, y: 0 }, value: 3, ticksLeft: 20, ticksTotal: 60 } });
    expect(handleSpace(state, rng)).toEqual(createInitialState(state.config, rng, "arcade"));
  });

  it("Classic ne dobija prepreke ili bonuse", () => {
    const next = tick(setup({ mode: "classic", score: 9 }), rng);
    expect(next.score).toBe(10);
    expect(next.obstacles).toEqual([]);
    expect(next.bonus).toBeNull();
  });

  function almostFull(withBonus: boolean): GameState {
    const snake: Point[] = [{ x: 5, y: 5 }];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) {
      if ((x === 5 && y === 5) || (x === 6 && y === 5) || (x === 2 && y === 2) || (withBonus && x === 0 && y === 0)) continue;
      snake.push({ x, y });
    }
    return setup({ config: { ...DEFAULT_CONFIG, gridSize: 10 }, snake,
      food: { x: 6, y: 5 }, obstacles: [{ x: 2, y: 2 }],
      bonus: withBonus ? { position: { x: 0, y: 0 }, value: 3, ticksLeft: 20, ticksTotal: 60 } : null });
  }

  it("pobeda kad su sva polja osim prepreka popunjena", () => {
    const next = tick(almostFull(false), rng);
    expect(next.status).toBe("won");
    expect(next.food).toBeNull();
  });

  it("bonus ustupa poslednje slobodno polje običnoj hrani", () => {
    const next = tick(almostFull(true), rng);
    expect(next.status).toBe("running");
    expect(next.food).toEqual({ x: 0, y: 0 });
    expect(next.bonus).toBeNull();
  });
});
