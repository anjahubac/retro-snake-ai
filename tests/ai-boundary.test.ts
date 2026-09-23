import { describe, it, expect } from "vitest";
import { validateSnapshot, validateHintResponse } from "../src/ai/validate";

const tactical = {
  score: 0, length: 3, status: "paused", direction: "right",
  head: { x: 5, y: 5 }, food: { x: 0, y: 0 }, gridSize: 10,
  danger: { up: false, down: false, left: true, right: false },
};

describe("AI granica — dodatne provere", () => {
  it("odbija nekonacne brojeve i u ugnjezdenim tackama", () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      expect(validateSnapshot({ ...tactical, score: value }, "tactical")).toBe(false);
      expect(validateSnapshot({ ...tactical, head: { x: value, y: 5 } }, "tactical")).toBe(false);
      expect(validateSnapshot({ ...tactical, food: { x: 0, y: value } }, "tactical")).toBe(false);
    }
  });

  it("odbija dodatna ugnjezdena polja i neboolean danger", () => {
    const invalid: unknown[] = [
      { ...tactical, head: { x: 5, y: 5, secret: "not-allowed" } },
      { ...tactical, food: { x: 0, y: 0, extra: true } },
      { ...tactical, danger: { ...tactical.danger, diagonal: false } },
      { ...tactical, danger: { ...tactical.danger, right: "false" } },
    ];
    for (const value of invalid) {
      expect(validateSnapshot(value, "tactical")).toBe(false);
    }
  });

  it("vraca trimovan hint bez menjanja ulaza", () => {
    const input = { hint: "  Nastavi pravo.  ", suggestedAction: "keep", urgency: "low" };
    const before = structuredClone(input);
    expect(validateHintResponse(input)).toEqual({
      ok: true,
      hint: { hint: "Nastavi pravo.", suggestedAction: "keep", urgency: "low" },
    });
    expect(input).toEqual(before);
  });
});
