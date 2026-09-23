import type { AiClient, GameSnapshot } from "./types";

export const FAKE_MODES = [
  "success", "invalid_args", "unsupported_tool", "timeout", "provider_error", "malformed_final",
] as const;
export type FakeMode = (typeof FAKE_MODES)[number];

export function createFakeClient(mode: FakeMode): AiClient & {
  calls: { proposeToolCall: number; produceHint: number };
} {
  const calls = { proposeToolCall: 0, produceHint: 0 };

  return {
    calls,
    async proposeToolCall(): Promise<unknown> {
      calls.proposeToolCall += 1;

      if (mode === "timeout") {
        return new Promise<unknown>(() => {});
      }
      if (mode === "provider_error") {
        throw new Error("fake provider down");
      }
      if (mode === "invalid_args") {
        return { name: "get_game_state", args: { detail: "everything", executeCode: "..." } };
      }
      if (mode === "unsupported_tool") {
        return { name: "set_score", args: { value: 999 } };
      }

      return { name: "get_game_state", args: { detail: "tactical" } };
    },

    async produceHint(snapshot: GameSnapshot): Promise<unknown> {
      calls.produceHint += 1;

      if (mode === "malformed_final") {
        return { hint: "", suggestedAction: "jump", urgency: "extreme" };
      }

      if (
        "danger" in snapshot &&
        snapshot.danger[snapshot.direction]
      ) {
        const direction = (["up", "down", "left", "right"] as const).find(
          (candidate) => !snapshot.danger[candidate],
        );
        if (direction === undefined) {
          return {
            hint: "Nema bezbednog smera. Proveri tablu pre nastavka.",
            suggestedAction: "keep",
            urgency: "high",
          };
        }
        return {
          hint: `Opasnost ispred! Skreni ${direction}.`,
          suggestedAction: direction,
          urgency: "high",
        };
      }

      return {
        hint: "Put je slobodan, nastavi pravo.",
        suggestedAction: "keep",
        urgency: "low",
      };
    },
  };
}
