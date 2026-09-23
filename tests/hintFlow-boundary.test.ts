import { describe, it, expect, vi } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, startGame } from "../src/game/logic";
import { getGameState } from "../src/ai/tools";
import { createFakeClient } from "../src/ai/fakeClient";
import { requestHint, SAFE_MESSAGE } from "../src/ai/hintFlow";
import type { AiClient, GameSnapshot, HintResponse } from "../src/ai/types";

const call = { name: "get_game_state", args: { detail: "tactical" } };
const answer: HintResponse = {
  hint: "Nastavi pravo.", suggestedAction: "keep", urgency: "low",
};
const makeState = () => startGame(createInitialState(DEFAULT_CONFIG, () => 0));

describe("requestHint — dodatne granice", () => {
  it("salje tacan snapshot, vraca tacan odgovor i cuva igru od mutacije klijenta", async () => {
    const state = makeState();
    const before = structuredClone(state);
    let received: GameSnapshot | undefined;
    const client = {
      proposeToolCall: vi.fn(async () => call),
      produceHint: vi.fn(async (snapshot: GameSnapshot) => {
        received = structuredClone(snapshot);
        if ("head" in snapshot) snapshot.head.x = 99;
        return answer;
      }),
    } satisfies AiClient;
    const tool = vi.fn(getGameState);
    const result = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(received).toEqual(getGameState(before, { detail: "tactical" }));
    expect(result).toEqual({ ok: true, hint: answer, toolCalls: 1 });
    expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
    expect(client.produceHint).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledWith(before, { detail: "tactical" });
    expect(tool).toHaveBeenCalledWith(before, { detail: "tactical" });
    expect(state).toEqual(before);
  });

  it("kontrolise provider gresku u drugoj fazi bez ponavljanja poziva", async () => {
    const state = makeState();
    const client = {
      proposeToolCall: vi.fn(async () => call),
      produceHint: vi.fn(async () => { throw new Error("test second phase failure"); }),
    } satisfies AiClient;
    const tool = vi.fn(getGameState);
    expect(await requestHint({ client, getState: () => state, executeTool: tool })).toEqual({
      ok: false, reason: "provider_error", message: SAFE_MESSAGE, toolCalls: 1,
    });
    expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
    expect(client.produceHint).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledTimes(1);
  });

  it("timeout druge faze cisti tajmere i ignorise zakasneli finalni odgovor", async () => {
    vi.useFakeTimers();
    try {
      const state = makeState();
      const before = structuredClone(state);
      let finish!: (value: unknown) => void;
      const late = new Promise<unknown>((resolve) => { finish = resolve; });
      const client = {
        proposeToolCall: vi.fn(async () => call),
        produceHint: vi.fn(() => late),
      } satisfies AiClient;
      const tool = vi.fn(getGameState);
      const pending = requestHint({ client, getState: () => state, executeTool: tool, timeoutMs: 50 });
      await vi.advanceTimersByTimeAsync(51);
      const result = await pending;
      expect(result).toEqual({ ok: false, reason: "timeout", message: SAFE_MESSAGE, toolCalls: 1 });
      expect(vi.getTimerCount()).toBe(0);
      finish(answer);
      await vi.advanceTimersByTimeAsync(0);
      expect(await pending).toEqual(result);
      expect(tool).toHaveBeenCalledTimes(1);
      expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
      expect(client.produceHint).toHaveBeenCalledTimes(1);
      expect(state).toEqual(before);
    } finally {
      vi.useRealTimers();
    }
  });

  it("zakasneli predlog posle timeout-a nikad ne izvrsava alat", async () => {
    vi.useFakeTimers();
    try {
      const state = makeState();
      let finish!: (value: unknown) => void;
      const late = new Promise<unknown>((resolve) => { finish = resolve; });
      const client = {
        proposeToolCall: vi.fn(() => late),
        produceHint: vi.fn(async () => answer),
      } satisfies AiClient;
      const tool = vi.fn(getGameState);
      const pending = requestHint({ client, getState: () => state, executeTool: tool, timeoutMs: 50 });
      await vi.advanceTimersByTimeAsync(51);
      expect(await pending).toEqual({
        ok: false, reason: "timeout", message: SAFE_MESSAGE, toolCalls: 0,
      });
      finish(call);
      await vi.advanceTimersByTimeAsync(0);
      expect(tool).not.toHaveBeenCalled();
      expect(client.produceHint).not.toHaveBeenCalled();
      expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("izuzetak izvrsenog alata vraca safe error i ne salje finalni zahtev", async () => {
    const state = makeState();
    const client = createFakeClient("success");
    const tool = vi.fn(() => { throw new Error("test tool failure"); });
    expect(await requestHint({ client, getState: () => state, executeTool: tool })).toEqual({
      ok: false, reason: "provider_error", message: SAFE_MESSAGE, toolCalls: 1,
    });
    expect(tool).toHaveBeenCalledTimes(1);
    expect(client.calls).toEqual({ proposeToolCall: 1, produceHint: 0 });
  });
});
