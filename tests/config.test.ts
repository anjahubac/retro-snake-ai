import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, validateConfig, loadConfig } from "../src/game/config";

describe("validateConfig", () => {
  it("prihvata DEFAULT_CONFIG", () => {
    expect(validateConfig(DEFAULT_CONFIG)).toEqual({ ok: true, config: DEFAULT_CONFIG });
  });

  it("prihvata granične vrednosti", () => {
    expect(validateConfig({ gridSize: 10, tickMs: 400, startLength: 2, winScore: 50 }).ok).toBe(true);
    expect(validateConfig({ gridSize: 30, tickMs: 60, startLength: 5, winScore: 1 }).ok).toBe(true);
  });

  it.each([
    ["string", "20"],
    ["null", null],
    ["niz", []],
    ["fali polje", { gridSize: 20, tickMs: 150, startLength: 3 }],
    ["pogrešan tip", { ...DEFAULT_CONFIG, tickMs: "fast" }],
    ["nije ceo broj", { ...DEFAULT_CONFIG, gridSize: 12.5 }],
    ["ispod minimuma", { ...DEFAULT_CONFIG, gridSize: 9 }],
    ["iznad maksimuma", { ...DEFAULT_CONFIG, winScore: 51 }],
    ["višak ključ", { ...DEFAULT_CONFIG, lives: 3 }],
  ])("odbija: %s", (_name, input) => {
    const r = validateConfig(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThan(0);
  });

  it("skuplja sve greške", () => {
    const r = validateConfig({ gridSize: -5, tickMs: "fast" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThanOrEqual(4);
  });
});

describe("loadConfig", () => {
  it("vraća ulaz kad je validan", () => {
    const input = { ...DEFAULT_CONFIG, gridSize: 12 };
    expect(loadConfig(input)).toEqual({ config: input, errors: [] });
  });

  it("vraća DEFAULT_CONFIG i greške kad nije validan", () => {
    const r = loadConfig({ gridSize: -5 });
    expect(r.config).toEqual(DEFAULT_CONFIG);
    expect(r.errors.length).toBeGreaterThan(0);
  });
});
