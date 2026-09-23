import { ALLOWED_TOOLS } from "./types";
import type { Detail, HintAction, HintResponse, ToolCall } from "./types";
import type { Direction, Status } from "../game/types";

const DIRECTIONS: readonly Direction[] = ["up", "down", "left", "right"];
const STATUSES: readonly Status[] = ["ready", "running", "paused", "over", "won"];
const HINT_ACTIONS: readonly HintAction[] = ["up", "down", "left", "right", "keep"];
const URGENCIES = ["low", "medium", "high"] as const;

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function hasExactKeys(value: object, expected: readonly string[]): boolean {
  const keys = Reflect.ownKeys(value);
  return (
    keys.length === expected.length &&
    keys.every((key) => typeof key === "string" && expected.includes(key))
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPoint(value: unknown): boolean {
  return (
    isPlainObject(value) &&
    hasExactKeys(value, ["x", "y"]) &&
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y)
  );
}

export function validateToolCall(
  input: unknown,
):
  | { ok: true; call: ToolCall }
  | { ok: false; reason: "invalid_tool_call" | "unsupported_tool" } {
  try {
    if (!isPlainObject(input)) {
      return { ok: false, reason: "invalid_tool_call" };
    }

    if (typeof input.name !== "string") {
      return { ok: false, reason: "invalid_tool_call" };
    }

    if (!(ALLOWED_TOOLS as readonly string[]).includes(input.name)) {
      return { ok: false, reason: "unsupported_tool" };
    }

    if (!hasExactKeys(input, ["name", "args"])) {
      return { ok: false, reason: "invalid_tool_call" };
    }

    if (
      !isPlainObject(input.args) ||
      !hasExactKeys(input.args, ["detail"]) ||
      (input.args.detail !== "summary" && input.args.detail !== "tactical")
    ) {
      return { ok: false, reason: "invalid_tool_call" };
    }

    return {
      ok: true,
      call: {
        name: "get_game_state",
        args: { detail: input.args.detail },
      },
    };
  } catch {
    return { ok: false, reason: "invalid_tool_call" };
  }
}

export function validateSnapshot(input: unknown, detail: Detail): boolean {
  try {
    if (!isPlainObject(input)) return false;

    const summaryKeys = ["score", "length", "status", "direction"];
    const expectedKeys = detail === "summary"
      ? summaryKeys
      : [...summaryKeys, "head", "food", "gridSize", "danger"];
    if (!hasExactKeys(input, expectedKeys)) return false;

    if (
      !isFiniteNumber(input.score) ||
      !isFiniteNumber(input.length) ||
      typeof input.status !== "string" ||
      !(STATUSES as readonly string[]).includes(input.status) ||
      typeof input.direction !== "string" ||
      !(DIRECTIONS as readonly string[]).includes(input.direction)
    ) {
      return false;
    }

    if (detail === "summary") return true;
    if (detail !== "tactical") return false;

    if (
      !isPoint(input.head) ||
      (input.food !== null && !isPoint(input.food)) ||
      !isFiniteNumber(input.gridSize) ||
      !isPlainObject(input.danger) ||
      !hasExactKeys(input.danger, DIRECTIONS)
    ) {
      return false;
    }

    const danger = input.danger as Record<Direction, unknown>;
    return DIRECTIONS.every((direction) => typeof danger[direction] === "boolean");
  } catch {
    return false;
  }
}

export function validateHintResponse(
  input: unknown,
): { ok: true; hint: HintResponse } | { ok: false } {
  try {
    if (!isPlainObject(input) || !hasExactKeys(input, ["hint", "suggestedAction", "urgency"])) {
      return { ok: false };
    }

    if (
      typeof input.hint !== "string" ||
      typeof input.suggestedAction !== "string" ||
      typeof input.urgency !== "string"
    ) {
      return { ok: false };
    }

    const hint = input.hint.trim();
    if (
      hint.length < 1 ||
      hint.length > 160 ||
      !(HINT_ACTIONS as readonly string[]).includes(input.suggestedAction) ||
      !(URGENCIES as readonly string[]).includes(input.urgency)
    ) {
      return { ok: false };
    }

    return {
      ok: true,
      hint: {
        hint,
        suggestedAction: input.suggestedAction as HintAction,
        urgency: input.urgency as HintResponse["urgency"],
      },
    };
  } catch {
    return { ok: false };
  }
}
