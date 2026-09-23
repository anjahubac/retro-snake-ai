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
| T1 | validan zahtev (fake `success`) | `ok: true`, alat pozvan tačno 1×, sa `{ detail: "tactical" }` | spy `toHaveBeenCalledTimes(1)`, `toolCalls = 1` | PASS — `ok:true`, `toolCalls=1`, alat tačno 1× sa `{detail:"tactical"}`; client attempts propose=1, produce=1. |
| T2 | invalid arguments (`detail: "everything"`, `executeCode`) | alat nije izvršen, `invalid_tool_call` | `toolCalls = 0`, spy nije pozvan | PASS — `invalid_tool_call`, `toolCalls=0`; alat nije pozvan, `produceHint=0`. |
| T3 | unsupported tool (`set_score`) | ništa nije izvršeno, `unsupported_tool` | allowlist test, `toolCalls = 0` | PASS — `unsupported_tool`, `toolCalls=0`; alat nije pozvan pre allowlist odbijanja. |
| T4 | timeout (fake ne odgovara, `timeoutMs: 50`) | `timeout`, SAFE_MESSAGE | `reason`, `produceHint` pozvan 0× | PASS — `timeout`, `toolCalls=0`; `produceHint=0`. |
| T5 | provider failure (fake baca grešku) | `provider_error`, SAFE_MESSAGE | `reason` | PASS — `provider_error`, `toolCalls=0`, bez izlaganja provider poruke. |
| T6 | malformed tool output (`{ score: "lots" }`) | nema lažnog success-a, `invalid_tool_output` | `produceHint` pozvan 0× | PASS — `invalid_tool_output`, `toolCalls=1`; `produceHint=0`. |
| T7 | malformed final output | UI ne dobija hint, `invalid_final` | final validation | PASS — `invalid_final`, `toolCalls=1`; nevalidan final nije vraćen UI-u. |
| T8 | read-only | stanje igre identično pre i posle | `toEqual(structuredClone(before))` | PASS — state jednak `structuredClone(before)` posle flow-a. |

### Dodatni boundary testovi (8)

| Test | Stvarni rezultat |
|---|---|
| ai-boundary: nekonačni brojevi u summary/head/food | PASS |
| ai-boundary: dodatna nested polja i neboolean danger | PASS |
| ai-boundary: trimovan hint, ulaz nepromenjen | PASS |
| hintFlow-boundary: tačan snapshot/args/final; klijent ne može mutirati igru | PASS; alat 1×, oba provider poziva 1× |
| hintFlow-boundary: greška druge provider faze | PASS; safe `provider_error`, alat 1×, nema ponavljanja |
| hintFlow-boundary: timeout druge faze | PASS; timer count 0, kasni final ignoriše se |
| hintFlow-boundary: kasni proposal posle timeout-a | PASS; alat i final nisu pozvani, timer count 0 |
| hintFlow-boundary: izuzetak alata | PASS; safe `provider_error`, `toolCalls=1`, final poziv 0× |

Detaljna imena i stvarni verbose izlaz: `docs/runs/ai-test-matrix.txt`.
