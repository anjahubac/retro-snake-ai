import type { GameConfig } from "./types";

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 20,
  tickMs: 150,
  startLength: 3,
  winScore: 15,
};

const FIELD_RULES = [
  { key: "gridSize", min: 10, max: 30 },
  { key: "tickMs", min: 60, max: 400 },
  { key: "startLength", min: 2, max: 5 },
  { key: "winScore", min: 1, max: 50 },
] as const satisfies ReadonlyArray<{
  key: keyof GameConfig;
  min: number;
  max: number;
}>;

const CONFIG_KEYS: ReadonlySet<PropertyKey> = new Set(
  FIELD_RULES.map(({ key }) => key),
);

export function validateConfig(
  input: unknown,
): { ok: true; config: GameConfig } | { ok: false; errors: string[] } {
  if (
    input === null ||
    typeof input !== "object" ||
    Array.isArray(input) ||
    Object.getPrototypeOf(input) !== Object.prototype
  ) {
    return { ok: false, errors: ["Konfiguracija mora biti običan objekat"] };
  }

  const candidate = input as Record<string, unknown>;
  const errors: string[] = [];

  for (const { key, min, max } of FIELD_RULES) {
    const value = candidate[key];
    if (
      !Object.hasOwn(candidate, key) ||
      !Number.isInteger(value) ||
      typeof value !== "number" ||
      value < min ||
      value > max
    ) {
      errors.push(`${key} mora biti ceo broj od ${min} do ${max}`);
    }
  }

  for (const key of Reflect.ownKeys(candidate)) {
    if (!CONFIG_KEYS.has(key)) {
      errors.push("Konfiguracija sadrži višak ključeva");
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    config: {
      gridSize: candidate.gridSize as number,
      tickMs: candidate.tickMs as number,
      startLength: candidate.startLength as number,
      winScore: candidate.winScore as number,
    },
  };
}

export function loadConfig(input: unknown): {
  config: GameConfig;
  errors: string[];
} {
  const result = validateConfig(input);
  if (result.ok) {
    return { config: result.config, errors: [] };
  }

  return { config: DEFAULT_CONFIG, errors: result.errors };
}
