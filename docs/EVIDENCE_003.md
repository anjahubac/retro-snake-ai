# EVIDENCE_003 — od ideje do dokaza

Popunjava se stvarnim izlazima. Ništa se ne upisuje pre nego što je pokrenuto.

## Početna tvrdnja

Pixel Zmija po `GAME_SPEC.md` može da se napravi kao mala TypeScript browser
igra sa logikom u čistim funkcijama, proverenom testovima i eval skupom.

## Baseline

- Prompt: `docs/BUILD_PROMPT_V1.md` (Koraci 1–3)
- Kontekst: vidi `docs/CONTEXT_MANIFEST.md`
- Commit / tag: `baseline` → `<hash>`
- Komanda za pokretanje: `npm run dev`
- Screenshot: `docs/runs/baseline.png`
- Početni testovi: `npm test` → `<stvarni izlaz: broj testova, pass/fail>`
- Eval: `npm run eval` → `docs/runs/eval-baseline.txt`, `<koliko prolazi>`
- Prvi vidljivi problem: `<opis>`

## Izabrani problem i hipoteza

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
| E1 | | |
| E2 | | |
| E3 | | |
| E4 | | |
| E5 | | |

Sirovi izlazi: `docs/runs/eval-baseline.txt`, `docs/runs/eval-after.txt`.

## Poznato ograničenje

## Doprinos članova para

- <ime>: 
- <ime>: 
