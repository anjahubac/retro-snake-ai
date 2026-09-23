import { describe, it, expect, vi } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, startGame } from "../src/game/logic";
import { getGameState } from "../src/ai/tools";
import { createFakeClient, type FakeMode } from "../src/ai/fakeClient";
import { requestHint, SAFE_MESSAGE } from "../src/ai/hintFlow";
import type { ExecuteTool } from "../src/ai/types";

const rng = () => 0;

function setup(mode: FakeMode, execute: ExecuteTool = getGameState) {
  const state = startGame(createInitialState({ ...DEFAULT_CONFIG, gridSize: 10 }, rng));
  const client = createFakeClient(mode);
  const tool = vi.fn(execute);
  return { state, client, tool };
}

describe("requestHint — test matrix", () => {
  it("T1 validan zahtev: jedan poziv alata, validan hint", async () => {
    const { state, client, tool } = setup("success");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r.ok).toBe(true);
    expect(r.toolCalls).toBe(1);
    expect(tool).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledWith(state, { detail: "tactical" });
    expect(client.calls).toEqual({ proposeToolCall: 1, produceHint: 1 });
  });

  it("T2 nevalidni argumenti: alat nije izvršen", async () => {
    const { state, client, tool } = setup("invalid_args");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "invalid_tool_call", message: SAFE_MESSAGE, toolCalls: 0 });
    expect(tool).not.toHaveBeenCalled();
    expect(client.calls.produceHint).toBe(0);
  });

  it("T3 nepoznat alat: ništa nije izvršeno", async () => {
    const { state, client, tool } = setup("unsupported_tool");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "unsupported_tool", message: SAFE_MESSAGE, toolCalls: 0 });
    expect(tool).not.toHaveBeenCalled();
  });

  it("T4 timeout: kontrolisana greška", async () => {
    const { state, client, tool } = setup("timeout");
    const r = await requestHint({ client, getState: () => state, executeTool: tool, timeoutMs: 50 });
    expect(r).toEqual({ ok: false, reason: "timeout", message: SAFE_MESSAGE, toolCalls: 0 });
    expect(client.calls.produceHint).toBe(0);
  });

  it("T5 provider greška: kontrolisana greška", async () => {
    const { state, client, tool } = setup("provider_error");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "provider_error", message: SAFE_MESSAGE, toolCalls: 0 });
  });

  it("T6 neispravan izlaz alata: nema lažnog success-a", async () => {
    const { state, client, tool } = setup("success", () => ({ score: "lots" }));
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "invalid_tool_output", message: SAFE_MESSAGE, toolCalls: 1 });
    expect(client.calls.produceHint).toBe(0);
  });

  it("T7 neispravan finalni odgovor: UI ne dobija hint", async () => {
    const { state, client, tool } = setup("malformed_final");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "invalid_final", message: SAFE_MESSAGE, toolCalls: 1 });
  });

  it("T8 read-only: stanje igre je isto pre i posle", async () => {
    const { state, client } = setup("success");
    const before = structuredClone(state);
    await requestHint({ client, getState: () => state });
    expect(state).toEqual(before);
  });
});
