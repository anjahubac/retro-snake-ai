# EVIDENCE_004 — read-only AI Hint sa fake klijentom

## Tool Contract

`docs/TOOL_CONTRACT.md`: jedini dozvoljeni alat je `get_game_state`, READ ONLY,
sa `summary` ili `tactical` input-om. Poziv i izlaz prolaze runtime validaciju;
UI prikazuje samo validirana polja ili SAFE_MESSAGE kroz `textContent`.

## Put koji je korišćen

- [x] Lokalni fake klijent (`src/ai/fakeClient.ts`) — Core put.
- [ ] Live provider — **0 live poziva**, nije implementiran niti testiran.
- Tačna izjava: `Core put koristi lokalni fake klijent; live provider nije testiran.`
- Šest režima: `success`, `invalid_args`, `unsupported_tool`, `timeout`,
  `provider_error`, `malformed_final`; nepoznat `?ai=` koristi `success`.

## Test matrix — stvarni izlaz

Verbose izlaz sa imenima testova i stvarnim rezultatom nalazi se u
[`docs/runs/ai-test-matrix.txt`](runs/ai-test-matrix.txt): 7 test fajlova,
72 testa passed. Završne komande typecheck/test/eval/build sačuvane su u
`docs/runs/week4-checks.txt`: 72 testa i 5 eval-a passed, build prošao. T1–T8 i svih osam dodatnih boundary testova prolaze.

- T1: `toolCalls=1`; alat pozvan jednom sa `{ detail: "tactical" }`; fake
  client proposal i final po jedan.
- T2: `invalid_tool_call`, `toolCalls=0`, alat nije izvršen, final nije tražen.
- T3: `unsupported_tool`, `toolCalls=0`, alat nije izvršen.
- T4: `timeout`, `toolCalls=0`, final nije tražen.
- T5: `provider_error`, `toolCalls=0`, bez provider detalja u poruci.
- T6: `invalid_tool_output`, `toolCalls=1`, final nije tražen.
- T7: `invalid_final`, `toolCalls=1`, nevalidan hint nije vraćen.
- T8: game state je jednak `structuredClone(before)`.

Dodatni success boundary test potvrđuje da je poslati snapshot tačno:

```json
{
  "score": 0,
  "length": 3,
  "status": "running",
  "direction": "right",
  "head": { "x": 10, "y": 10 },
  "food": { "x": 0, "y": 0 },
  "gridSize": 20,
  "danger": { "up": false, "down": false, "left": true, "right": false }
}
```

Taj test potvrđuje args `{ "detail": "tactical" }`, jedan poziv alata, jedan
final i da mutacija snapshot-a od strane klijenta ne menja igru. Dva timeout boundary testa potvrđuju da se tajmeri očiste i da kasni
proposal/final ne nastavlja tok. Test alata koji baci grešku vraća safe
`provider_error` sa `toolCalls=1` i bez final poziva.

## Success flow

- Logički UI URL: `/` (fake režim `success`).
- Runtime rezultat lokalnog fake toka:

```json
{
  "ok": true,
  "hint": {
    "hint": "Put je slobodan, nastavi pravo.",
    "suggestedAction": "keep",
    "urgency": "low"
  },
  "toolCalls": 1
}
```

`HintResponse` prikazan u UI-ju je:

```json
{
  "hint": "Put je slobodan, nastavi pravo.",
  "suggestedAction": "keep",
  "urgency": "low"
}
```

UI screenshot `docs/runs/hint-success.png` nije napravljen: browser-control
okruženje nije ponudilo browser, pa nema vizuelnog dokaza.

## Slučaj u kom alat nije izvršen

- T2 (`invalid_args`) i T3 (`unsupported_tool`) vraćaju `toolCalls=0`; T2/T3
  spy potvrđuje da alat nije pozvan. Validator odbija predlog pre izvršenja.
- UI očekivani režim je `/?ai=unsupported_tool`; stvarna browser provera i
  screenshot nisu dostupni u ovom okruženju.

## Provider ili output failure

- T4 timeout, T5 provider error, T6 invalid tool output, T7 invalid final
  prolaze sa propisanim failure-om i SAFE_MESSAGE.
- UI URL `/?ai=timeout`; `docs/runs/hint-timeout.png` nije napravljen jer
  browser nije dostupan.

## Read-only dokaz

T8 poredi igru sa `structuredClone(before)`. `tests/tool.test.ts` mutira vraćeni
`head` i `food`, a boundary test mutira tactical snapshot u klijentu; u oba
slučaja game state ostaje nepromenjen. Pauza iz UI-a se radi pre AI poziva i
predstavlja korisničku game komandu, ne mutaciju alata.

## Poznato ograničenje

Fake savet je deterministički i nema kvalitativnog eval-a, niti garancije
preživljavanja ili pobede. Lokalni timeout ne otkazuje eventualni budući mrežni
request. Read-only testovi dokazuju kopiranje ograničenog snapshot-a, ne kvalitet
nekog live modela. Nema live provider-a ni live poziva.

UI ručni testovi (pauza, tastatura, fokus, aria-live, fake režimi, mobile/360px)
i screenshot-i čekaju lokalnu browser proveru. AI testovi nisu live/provider test;
Vite SSR harness koji je ispisao success JSON izašao je sa statusom 0, uz
neblokirajuću HMR WebSocket `EPERM` poruku u sandbox okruženju.

## Doprinos članova para

Imena i stvarni doprinosi oba člana nisu dostavljeni; popuniti pre predaje, ne
izmišljati.
