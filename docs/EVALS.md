# EVALS

Očekivanja su upisana **pre** prvog pokretanja (2026-09-23).
Eval kod: `evals/evals.test.ts`. Komanda: `npm run eval`.
Sirovi izlazi: `docs/runs/eval-baseline.txt` i `docs/runs/eval-after.txt`.

## Sesija 003 — igra

| ID | Ulaz ili scenario | Očekivanje | Baseline | Posle izmene | Status |
|---|---|---|---|---|---|
| E1 | Normalan start sa `DEFAULT_CONFIG`, Space, jedan tick | status `ready`, zmija dužine 3 sa glavom na (10,10), hrana nije na zmiji; posle tick-a glava na (11,10), status `running` | PASS | PASS | PASS baseline i after-fix |
| E2 | Tabla 10×10, glava na (9,5), smer desno, tick | status `over`, nijedan deo zmije van table | PASS | PASS | PASS baseline i after-fix |
| E3 | Nevalidan config `{ gridSize: -5, tickMs: "fast" }` | `validateConfig` odbija sa ≥ 2 greške; `loadConfig` vraća `DEFAULT_CONFIG` + greške | PASS | PASS | PASS baseline i after-fix |
| E4 | Zmija ide desno; u **istom** tick-u pritisnuti gore pa levo | zmija se ne okreće u sopstveni vrat: posle tick-a status `running`, glava na (10,9) | FAIL: status `over`, očekivan `running` (`evals/evals.test.ts:49`) | PASS | FAIL baseline; PASS after-fix |
| E5 | Tabla puna osim polja (9,9); stvaranje hrane | hrana je na (9,9), nikad na zmiji | PASS | PASS | PASS baseline i after-fix |

Predviđanje pre pokretanja: E4 je kandidat za stvaran problem baseline-a
(poznata greška brzog dvostrukog pritiska). Ako E4 prođe na baseline-u, to se
upisuje takvo kakvo je, a za hipotezu se bira eval ili ručni nalaz koji
stvarno pada. Bag se ne podmeće namerno.

## Sesija 004 — test matrix za AI Hint

Test kod: `tests/hintFlow.test.ts`. Komanda: `npm test`.

| # | Scenario | Očekivanje | Obavezni dokaz | Stvarni rezultat |
|---|---|---|---|---|
| T1 | validan zahtev (fake `success`) | `ok: true`, alat pozvan tačno 1×, sa `{ detail: "tactical" }` | spy `toHaveBeenCalledTimes(1)`, `toolCalls = 1` | |
| T2 | invalid arguments (`detail: "everything"`, `executeCode`) | alat nije izvršen, `invalid_tool_call` | `toolCalls = 0`, spy nije pozvan | |
| T3 | unsupported tool (`set_score`) | ništa nije izvršeno, `unsupported_tool` | allowlist test, `toolCalls = 0` | |
| T4 | timeout (fake ne odgovara, `timeoutMs: 50`) | `timeout`, SAFE_MESSAGE | `reason`, `produceHint` pozvan 0× | |
| T5 | provider failure (fake baca grešku) | `provider_error`, SAFE_MESSAGE | `reason` | |
| T6 | malformed tool output (`{ score: "lots" }`) | nema lažnog success-a, `invalid_tool_output` | `produceHint` pozvan 0× | |
| T7 | malformed final output | UI ne dobija hint, `invalid_final` | final validation | |
| T8 | read-only | stanje igre identično pre i posle | `toEqual(structuredClone(before))` | |
