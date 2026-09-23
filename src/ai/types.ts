import type { Direction, GameState, Point, Status } from "../game/types";

export const ALLOWED_TOOLS = ["get_game_state"] as const;
export type ToolName = (typeof ALLOWED_TOOLS)[number];
export type Detail = "summary" | "tactical";
export type ToolArgs = { detail: Detail };
export type ToolCall = { name: ToolName; args: ToolArgs };

export type SummarySnapshot = { score: number; length: number; status: Status; direction: Direction };
export type TacticalSnapshot = SummarySnapshot & {
  head: Point;
  food: Point | null;
  gridSize: number;
  danger: Record<Direction, boolean>;
};
export type GameSnapshot = SummarySnapshot | TacticalSnapshot;

export type HintAction = "up" | "down" | "left" | "right" | "keep";
export type HintResponse = { hint: string; suggestedAction: HintAction; urgency: "low" | "medium" | "high" };

export interface AiClient {
  proposeToolCall(): Promise<unknown>;
  produceHint(snapshot: GameSnapshot): Promise<unknown>;
}

export type ExecuteTool = (state: GameState, args: ToolArgs) => unknown;

export type HintFailure =
  | "invalid_tool_call" | "unsupported_tool" | "invalid_tool_output"
  | "invalid_final" | "timeout" | "provider_error";

export type HintResult =
  | { ok: true; hint: HintResponse; toolCalls: number }
  | { ok: false; reason: HintFailure; message: string; toolCalls: number };
