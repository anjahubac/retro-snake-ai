/// <reference types="node" />
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { DEFAULT_CONFIG } from "../src/game/config";
import { changeDirection, createInitialState, tick } from "../src/game/logic";
import { createFakeClient } from "../src/ai/fakeClient";
import { getGameState } from "../src/ai/tools";
import type { TacticalSnapshot } from "../src/ai/types";
import { render } from "../src/render";
import type { GameState } from "../src/game/types";

const html = readFileSync("index.html", "utf8");
const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1];
if (!body) throw new Error("index.html nema body");

function canvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const gradient = () => ({ addColorStop: vi.fn() });
  return {
    canvas,
    setTransform: vi.fn(),
    fillRect: vi.fn(),
    createLinearGradient: vi.fn(gradient),
    createRadialGradient: vi.fn(gradient),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    roundRect: vi.fn(),
    arc: vi.fn(),
    ellipse: vi.fn(),
    quadraticCurveTo: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 40 })),
  } as unknown as CanvasRenderingContext2D;
}

class TestPath2D {
  moveTo(): void {}
  lineTo(): void {}
}

let keyboardListener: EventListenerOrEventListenerObject | undefined;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("Path2D", TestPath2D);
  document.body.innerHTML = body;
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 400 } as DOMRect);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function (this: HTMLCanvasElement) {
    return canvasContext(this);
  });
});

afterEach(() => {
  if (keyboardListener) document.removeEventListener("keydown", keyboardListener);
  keyboardListener = undefined;
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});

async function loadApp(search: string): Promise<void> {
  window.history.replaceState({}, "", `/${search}`);
  const addListener = vi.spyOn(document, "addEventListener");
  vi.resetModules();
  await import("../src/main");
  keyboardListener = addListener.mock.calls.find(([event]) => event === "keydown")?.[1];
  addListener.mockRestore();
}

function key(key: string, code = key, target: EventTarget = document): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, code, bubbles: true }));
}

describe("aplikacija u DOM-u", () => {
  it("pokreće Arcade iz URL-a, pauzira, završava i resetuje partiju", async () => {
    await loadApp("?mode=arcade&config=bad-json");
    const status = document.querySelector<HTMLElement>("#status")!;
    const error = document.querySelector<HTMLElement>("#config-error")!;
    const mode = document.querySelector<HTMLSelectElement>("#game-mode")!;
    const level = document.querySelector<HTMLElement>("#level")!;
    const details = document.querySelector<HTMLElement>("#arcade-details")!;
    expect(error.hidden).toBe(false);
    expect(error.textContent).toContain("Konfiguracija nije validna");
    expect(mode.value).toBe("arcade");
    expect(level.hidden).toBe(false);
    expect(details.hidden).toBe(false);
    expect(document.querySelector("#arcade-progress")?.textContent).toContain("Prepreke: 0/0");
    key(" ", "Space");
    expect(status.textContent).toBe("Igra");
    vi.advanceTimersByTime(150);
    key(" ", "Space");
    expect(status.textContent).toBe("Pauza");
    vi.advanceTimersByTime(1500);
    expect(status.textContent).toBe("Pauza");
    key(" ", "Space");
    vi.advanceTimersByTime(1500);
    expect(status.textContent).toContain("Kraj");
    key(" ", "Space");
    expect(status.textContent).toBe("Pritisni Space");
    expect(level.hidden).toBe(false);
    mode.value = "classic";
    mode.dispatchEvent(new Event("change", { bubbles: true }));
    expect(level.hidden).toBe(true);
    expect(details.hidden).toBe(true);
    key(" ", "Space", mode);
    expect(status.textContent).toBe("Pritisni Space");
  });

  it("ubrzava tajmer tek kada stvarna hrana podigne Arcade nivo", async () => {
    const config = { ...DEFAULT_CONFIG, gridSize: 10 };
    const draws = [53.5 / 97, 53.5 / 96, 53.5 / 95, 53.5 / 94, 62.5 / 93];
    vi.spyOn(Math, "random").mockImplementation(() => draws.shift() ?? 0);
    const interval = vi.spyOn(window, "setInterval");
    const clear = vi.spyOn(window, "clearInterval");
    await loadApp(`?mode=arcade&config=${encodeURIComponent(JSON.stringify(config))}`);
    key(" ", "Space");
    for (let i = 0; i < 4; i++) vi.advanceTimersByTime(150);
    expect(document.querySelector("#score")?.textContent).toBe("4");
    expect(document.querySelector("#level-value")?.textContent).toBe("1");
    key("ArrowDown");
    vi.advanceTimersByTime(150);
    expect(document.querySelector("#score")?.textContent).toBe("5");
    expect(document.querySelector("#level-value")?.textContent).toBe("2");
    expect(document.querySelector("#arcade-progress")?.textContent).toContain("Prepreke: 2/2");
    expect(clear).toHaveBeenCalledTimes(1);
    expect(interval.mock.calls.at(-1)?.[1]).toBe(140);
    vi.advanceTimersByTime(139);
    expect(document.querySelector("#score")?.textContent).toBe("5");
  });

  it("ignoriše ponovljeni Space i nepovezane tastere", async () => {
    await loadApp("");
    const status = document.querySelector("#status")!;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", repeat: true }));
    key("x");
    expect(status.textContent).toBe("Pritisni Space");
    key(" ", "Space");
    expect(status.textContent).toBe("Igra");
  });

  it("prijavljuje nedostajuću tablu pre starta", async () => {
    document.querySelector("#board")?.remove();
    await expect(loadApp("")).rejects.toThrow("#board");
  });

  it("prijavljuje nedostupan Canvas 2D kontekst", async () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null);
    await expect(loadApp("")).rejects.toThrow("Canvas 2D kontekst nije dostupan");
  });

  it("učitava validnu konfiguraciju i nepoznat režim vraća na Classic", async () => {
    const config = { ...DEFAULT_CONFIG, gridSize: 12, tickMs: 120 };
    await loadApp(`?mode=other&config=${encodeURIComponent(JSON.stringify(config))}`);
    expect(document.querySelector<HTMLSelectElement>("#game-mode")?.value).toBe("classic");
    expect(document.querySelector<HTMLCanvasElement>("#board")?.height).toBe(400);
    expect(document.querySelector<HTMLElement>("#config-error")?.hidden).toBe(true);
    key(" ", "Space");
    vi.advanceTimersByTime(120);
    expect(document.querySelector("#status")?.textContent).toBe("Igra");
  });
});

describe("Canvas prikaz", () => {
  it("crta Arcade prepreku, bonus, zmiju i prsten prema trajanju bonusa", () => {
    const canvas = document.querySelector<HTMLCanvasElement>("#board")!;
    const ctx = canvasContext(canvas);
    const state: GameState = {
      ...createInitialState(DEFAULT_CONFIG, () => 0, "arcade"),
      status: "running",
      obstacles: [{ x: 2, y: 2 }],
      bonus: { position: { x: 3, y: 3 }, value: 6, ticksLeft: 16, ticksTotal: 32 },
    };
    Object.defineProperty(window, "devicePixelRatio", { configurable: true, value: 2 });
    render(ctx, state);
    expect(canvas.width).toBe(800);
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
    expect(ctx.roundRect).toHaveBeenCalled();
    const ring = vi.mocked(ctx.arc).mock.calls.find(([, , radius]) => radius === 9);
    expect(ring).toBeDefined();
    expect((ring?.[4] ?? 0) - (ring?.[3] ?? 0)).toBeCloseTo(Math.PI);
    expect(ctx.fillText).not.toHaveBeenCalled();
  });

  it.each([
    ["ready", "SPREMNI?"],
    ["paused", "PAUZA"],
    ["over", "KRAJ IGRE"],
    ["won", "POBEDA!"],
  ] as const)("prikazuje %s overlay kao %s", (status, heading) => {
    const canvas = document.querySelector<HTMLCanvasElement>("#board")!;
    const ctx = canvasContext(canvas);
    render(ctx, { ...createInitialState(DEFAULT_CONFIG, () => 0), status });
    expect(ctx.fillText).toHaveBeenCalledWith(heading, 200, expect.any(Number));
  });

  it.each([
    ["up", 6, 7], ["down", 14, 13], ["left", 7, 14],
  ] as const)("oči prate smer %s", (direction, eyeX, eyeY) => {
    const canvas = document.querySelector<HTMLCanvasElement>("#board")!;
    const ctx = canvasContext(canvas);
    const state = createInitialState(DEFAULT_CONFIG, () => 0);
    render(ctx, { ...state, direction });
    const eye = vi.mocked(ctx.arc).mock.calls.find(([, , radius]) => radius === 2.4);
    expect(eye?.[0]).toBe(10 * 20 + eyeX);
    expect(eye?.[1]).toBe(10 * 20 + eyeY);
  });

  it("umanjuje tekst overlaya kada je tabla mala", () => {
    const canvas = document.querySelector<HTMLCanvasElement>("#board")!;
    const ctx = canvasContext(canvas);
    vi.mocked(ctx.measureText).mockReturnValue({ width: 500 } as TextMetrics);
    render(ctx, createInitialState({ ...DEFAULT_CONFIG, gridSize: 10 }, () => 0));
    expect(ctx.font).toBe("11px ui-monospace, monospace");
  });

  it("poštuje novu širinu table i preskače crtanje kada tabla nije vidljiva", () => {
    const canvas = document.querySelector<HTMLCanvasElement>("#board")!;
    const ctx = canvasContext(canvas);
    const state = createInitialState(DEFAULT_CONFIG, () => 0);
    vi.mocked(canvas.getBoundingClientRect).mockReturnValueOnce({ width: 0 } as DOMRect)
      .mockReturnValueOnce({ width: 200 } as DOMRect);
    render(ctx, state);
    expect(ctx.fillRect).not.toHaveBeenCalled();
    render(ctx, state);
    expect(canvas.width).toBe(400);
    expect(ctx.fillRect).toHaveBeenCalled();
  });
});

describe("dodatni stvarni rubni slučajevi", () => {
  it("zmija prihvata okret u levo, pa ignoriše povratak u vrat", () => {
    let state = createInitialState(DEFAULT_CONFIG, () => 0);
    state = { ...state, status: "running" };
    state = tick(changeDirection(state, "up"), () => 0);
    expect(changeDirection(state, "down")).toBe(state);
    state = tick(changeDirection(state, "left"), () => 0);
    expect(changeDirection(state, "right")).toBe(state);
    state = tick(changeDirection(state, "down"), () => 0);
    expect(changeDirection(state, "up")).toBe(state);
  });

  it("fake savet prijavljuje kada su sva četiri susedna polja opasna", async () => {
    const state = { ...createInitialState(DEFAULT_CONFIG, () => 0), status: "running" as const };
    const snapshot = getGameState(state, { detail: "tactical" }) as TacticalSnapshot;
    const client = createFakeClient("success");
    const hint = await client.produceHint({ ...snapshot,
      danger: { up: true, down: true, left: true, right: true } });
    expect(hint).toMatchObject({ suggestedAction: "keep", urgency: "high" });
  });
});
