# EVIDENCE_004 — jedna kontrolisana AI sposobnost

## Tool Contract

Vidi `docs/TOOL_CONTRACT.md`. Alat: `get_game_state`, READ ONLY, allowlist od
jednog alata.

## Put koji je korišćen

- [ ] Lokalni fake klijent (`src/ai/fakeClient.ts`) — Core put
- [ ] Live provider (`scripts/live-hint.ts`) — broj poziva: ___

Ako live nije rađen: „Core put koristi lokalni fake klijent; live provider nije testiran.“

## Test matrix — stvarni izlaz

```
<nalepi izlaz: npm test>
```

## Success flow

- URL: `/`
- Screenshot: `docs/runs/hint-success.png`
- Prikazan `HintResponse`: 

## Slučaj u kom alat nije izvršen

- Test: T2 (`invalid_args`) i T3 (`unsupported_tool`), `toolCalls = 0`, spy nije pozvan
- U UI: `/?ai=unsupported_tool` → prikazana poruka: 

## Provider ili output failure

- Test: T4 (timeout), T5 (provider_error), T6 (invalid_tool_output), T7 (invalid_final)
- U UI: `/?ai=timeout` → screenshot `docs/runs/hint-timeout.png`

## Finalna strukturisana poruka

```json
{ "hint": "...", "suggestedAction": "...", "urgency": "..." }
```

## Read-only dokaz

Test T8 i `tests/tool.test.ts` („read-only: mutacija snapshot-a ne menja igru“).

## Poznato ograničenje

## Doprinos članova para

- <ime>: 
- <ime>: 
