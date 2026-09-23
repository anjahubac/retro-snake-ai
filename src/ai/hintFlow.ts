import { getGameState } from "./tools";
import { validateHintResponse, validateSnapshot, validateToolCall } from "./validate";
import type {
  AiClient,
  ExecuteTool,
  GameSnapshot,
  HintFailure,
  HintResult,
} from "./types";
import type { GameState } from "../game/types";

export const SAFE_MESSAGE = "AI savet trenutno nije dostupan. Igra nastavlja normalno.";

class HintTimeoutError extends Error {}

async function withTimeout<T>(operation: () => Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeout = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => reject(new HintTimeoutError()), timeoutMs);
    });
    return await Promise.race([
      Promise.resolve().then(operation),
      timeout,
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

function failure(reason: HintFailure, toolCalls: number): HintResult {
  return { ok: false, reason, message: SAFE_MESSAGE, toolCalls };
}

export async function requestHint(deps: {
  client: AiClient;
  getState: () => GameState;
  executeTool?: ExecuteTool;
  timeoutMs?: number;
}): Promise<HintResult> {
  const { client, getState } = deps;
  const executeTool = deps.executeTool ?? getGameState;
  const timeoutMs = deps.timeoutMs ?? 5000;
  let toolCalls = 0;

  try {
    let proposal: unknown;
    try {
      proposal = await withTimeout(() => client.proposeToolCall(), timeoutMs);
    } catch (error) {
      return failure(error instanceof HintTimeoutError ? "timeout" : "provider_error", toolCalls);
    }

    const callResult = validateToolCall(proposal);
    if (!callResult.ok) return failure(callResult.reason, toolCalls);

    const stateSnapshot = structuredClone(getState());
    toolCalls = 1;
    let toolOutput: unknown;
    try {
      toolOutput = executeTool(stateSnapshot, callResult.call.args);
    } catch {
      return failure("provider_error", toolCalls);
    }

    if (!validateSnapshot(toolOutput, callResult.call.args.detail)) {
      return failure("invalid_tool_output", toolCalls);
    }

    const snapshot = toolOutput as GameSnapshot;
    let finalOutput: unknown;
    try {
      finalOutput = await withTimeout(() => client.produceHint(snapshot), timeoutMs);
    } catch (error) {
      return failure(error instanceof HintTimeoutError ? "timeout" : "provider_error", toolCalls);
    }

    const finalResult = validateHintResponse(finalOutput);
    if (!finalResult.ok) return failure("invalid_final", toolCalls);

    return { ok: true, hint: finalResult.hint, toolCalls };
  } catch {
    return failure("provider_error", toolCalls);
  }
}
