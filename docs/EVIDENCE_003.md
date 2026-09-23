# EVIDENCE_003 — od ideje do dokaza

Popunjava se stvarnim izlazima. Ništa se ne upisuje pre nego što je pokrenuto.

## Početna tvrdnja

Pixel Zmija po `GAME_SPEC.md` može da se napravi kao mala TypeScript browser
igra sa logikom u čistim funkcijama, proverenom testovima i eval skupom.

## Baseline

- Prompt: `docs/BUILD_PROMPT_V1.md` (Koraci 1–3)
- Kontekst: vidi `docs/CONTEXT_MANIFEST.md`
- Commit / tag: `baseline` → `7586646872d1b346b013b3d95067d1febd019ede` (commit `7586646`)
- Početni izlazi: `docs/runs/baseline-checks.txt` — typecheck prošao, 2 test fajla i 31 test prošli.
- Komanda za pokretanje: `npm run dev -- --host 127.0.0.1`; stvarni startup izlaz u `docs/runs/baseline-dev.txt`, URL `http://127.0.0.1:5173/`.
- Screenshot: nije napravljen; browser-control runtime nije imao dostupan browser, pa vizuelna UI provera nije izvršena.
- Eval: `npm run eval`; stvarni izlaz u `docs/runs/eval-baseline.txt` — E1, E2, E3 i E5 prolaze; E4 pada (4/5).
- Prvi reprodukovan problem: dva brza smera u jednom tick-u prihvataju `left` nakon `up`; `tick` vrati `status: "over"`, a E4 očekuje `running` i glavu na (10,9).

## Izabrani problem i hipoteza

Hipoteza za K5 je još neizvršena; E4 je stvarni baseline signal. Ne upisivati rezultat izmene pre njene provere.

```
Tvrdnja:
Signal:
Hipoteza:
Najmanja promena:
Provera:
Rezultat:
Ograničenje:
```

## Jedna kontrolisana promena

- Fajl(ovi): 
- Commit / tag: `after-fix` → `<hash>`
- Diff: `git diff baseline after-fix -- src/`

## Isti eval pre i posle

| ID | Baseline | Posle |
|---|---|---|
| E1 | PASS | — |
| E2 | PASS | — |
| E3 | PASS | — |
| E4 | FAIL: status `over`, očekivan `running` | — |
| E5 | PASS | — |

Sirovi izlazi: `docs/runs/eval-baseline.txt`, `docs/runs/eval-after.txt`.

## Poznato ograničenje

Baseline UI screenshot nedostaje jer browser okruženje nije bilo dostupno; automatizovan eval i server startup izlaz su sačuvani.

## Doprinos članova para

- <ime>: 
- <ime>: 
