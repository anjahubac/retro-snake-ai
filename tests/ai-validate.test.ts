import { describe, it, expect } from "vitest";
import { validateToolCall, validateSnapshot, validateHintResponse } from "../src/ai/validate";

describe("validateToolCall", () => {
  it("prihvata dozvoljen poziv", () => {
    expect(validateToolCall({ name: "get_game_state", args: { detail: "tactical" } })).toEqual({
      ok: true,
      call: { name: "get_game_state", args: { detail: "tactical" } },
    });
  });

  it("odbija alat van allowliste", () => {
    expect(validateToolCall({ name: "set_score", args: { value: 999 } })).toEqual({
      ok: false,
      reason: "unsupported_tool",
    });
  });

  it.each([
    ["pogrešan detail", { name: "get_game_state", args: { detail: "everything" } }],
    ["executeCode", { name: "get_game_state", args: { detail: "summary", executeCode: "..." } }],
    ["bez args", { name: "get_game_state" }],
    ["višak ključ na vrhu", { name: "get_game_state", args: { detail: "summary" }, extra: 1 }],
    ["nije objekat", "get_game_state"],
    ["name nije string", { name: 42, args: { detail: "summary" } }],
  ])("odbija: %s", (_n, input) => {
    expect(validateToolCall(input)).toEqual({ ok: false, reason: "invalid_tool_call" });
  });
});

describe("validateSnapshot", () => {
  const summary = { score: 1, length: 4, status: "running", direction: "up" };
  const tactical = {
    ...summary,
    head: { x: 1, y: 2 },
    food: null,
    gridSize: 10,
    danger: { up: false, down: true, left: false, right: false },
  };
  it("prihvata ispravne snapshot-e", () => {
    expect(validateSnapshot(summary, "summary")).toBe(true);
    expect(validateSnapshot(tactical, "tactical")).toBe(true);
  });
  it("odbija višak ključ", () => {
    expect(validateSnapshot({ ...summary, config: {} }, "summary")).toBe(false);
  });
  it("odbija pogrešan tip", () => {
    expect(validateSnapshot({ ...summary, score: "lots" }, "summary")).toBe(false);
  });
  it("odbija tactical bez danger", () => {
    const { danger: _d, ...noDanger } = tactical;
    expect(validateSnapshot(noDanger, "tactical")).toBe(false);
  });
});

describe("validateHintResponse", () => {
  const good = { hint: "Skreni gore, desno je zid.", suggestedAction: "up", urgency: "high" };
  it("prihvata ispravan odgovor", () => {
    expect(validateHintResponse(good)).toEqual({ ok: true, hint: good });
  });
  it.each([
    ["prazan hint", { ...good, hint: "   " }],
    ["predug hint", { ...good, hint: "a".repeat(161) }],
    ["nepoznata akcija", { ...good, suggestedAction: "jump" }],
    ["nepoznat urgency", { ...good, urgency: "extreme" }],
    ["višak ključ", { ...good, command: "rm -rf /" }],
    ["fali ključ", { hint: "x", suggestedAction: "up" }],
    ["nije objekat", "Skreni gore"],
  ])("odbija: %s", (_n, input) => {
    expect(validateHintResponse(input)).toEqual({ ok: false });
  });
});
