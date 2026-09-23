import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, startGame } from "../src/game/logic";
import { getGameState } from "../src/ai/tools";
import type { TacticalSnapshot } from "../src/ai/types";

const rng = () => 0;
const cfg = { ...DEFAULT_CONFIG, gridSize: 10 };
const state = startGame(createInitialState(cfg, rng)); // (5,5),(4,5),(3,5), hrana (0,0)

describe("getGameState", () => {
  it("summary vraća samo četiri polja", () => {
    expect(getGameState(state, { detail: "summary" })).toEqual({
      score: 0, length: 3, status: "running", direction: "right",
    });
  });

  it("tactical vraća glavu, hranu, tablu i opasnosti", () => {
    expect(getGameState(state, { detail: "tactical" })).toEqual({
      score: 0, length: 3, status: "running", direction: "right",
      head: { x: 5, y: 5 }, food: { x: 0, y: 0 }, gridSize: 10,
      danger: { up: false, down: false, left: true, right: false },
    });
  });

  it("zid se računa kao opasnost", () => {
    const atWall = { ...state, snake: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }] };
    const snap = getGameState(atWall, { detail: "tactical" }) as TacticalSnapshot;
    expect(snap.danger.right).toBe(true);
  });

  it("ne vraća zabranjene podatke", () => {
    const snap = getGameState(state, { detail: "tactical" });
    for (const key of ["snake", "config", "tickMs", "winScore", "startLength", "rng"]) {
      expect(Object.keys(snap)).not.toContain(key);
    }
  });

  it("read-only: mutacija snapshot-a ne menja igru", () => {
    const before = structuredClone(state);
    const snap = getGameState(state, { detail: "tactical" }) as TacticalSnapshot;
    snap.head.x = 99;
    if (snap.food) snap.food.x = 99;
    expect(state).toEqual(before);
  });
});
