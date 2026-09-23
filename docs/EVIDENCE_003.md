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

```
Tvrdnja: brzi smerovi up pa levo u istom tick-u mogu da okrenu zmiju u vrat.
Signal: E4 pada; stvarni izlaz daje status `over`, očekivano je `running`.
Hipoteza: changeDirection poredi novi smer sa poslednjim zadatim state.direction; posle up, levo nije više suprotno toj vrednosti, iako je zmija poslednji put fizički išla desno.
Najmanja promena: izračunati fizički smer iz glave minus vrat (snake[0] - snake[1]) i odbiti smer suprotan tom pravcu; za nedostajući ili neodrediv vrat koristiti state.direction. Menja se samo src/game/logic.ts.
Provera: npm run typecheck && npm test && npm run eval, sa istim E1–E5.
Rezultat: `npm run typecheck && npm test && npm run eval` prolazi; 31 unit testa i 5/5 eval-a prolaze. E4 sada prolazi.
Ograničenje: odbija se smer nazad u vrat; nema reda komandi, a druga dozvoljena komanda unutar tick-a i dalje može zameniti ranije zadati smer.
```

## Jedna kontrolisana promena

- Fajl(ovi): `src/game/logic.ts`
- Commit: `75635b31616a26b4db537faadf7d597aed9237ad`
- Tag: `after-fix` → `75635b31616a26b4db537faadf7d597aed9237ad`
- Diff: `docs/runs/after-fix-diff.txt`; izmenjen je samo `src/game/logic.ts`. `git diff baseline after-fix -- tests/ evals/ src/game/types.ts` je prazan.

## Isti eval pre i posle

| ID | Baseline | Posle |
|---|---|---|
| E1 | PASS | PASS |
| E2 | PASS | PASS |
| E3 | PASS | PASS |
| E4 | FAIL: status `over`, očekivan `running` | PASS |
| E5 | PASS | PASS |

Sirovi izlazi: `docs/runs/eval-baseline.txt`, `docs/runs/eval-after.txt`. After-fix diff: `docs/runs/after-fix-diff.txt`.

## Poznato ograničenje

Baseline UI screenshot i K3 interaktivna provera nedostaju jer browser okruženje nije bilo dostupno. Automatizovan eval i server startup izlaz su sačuvani. Popravka odbija smer koji vodi nazad u vrat; nema reda komandi, a druga dozvoljena komanda unutar tick-a i dalje može zameniti ranije zadati smer.

## Doprinos članova para

Još nije popunjeno: imena i stvarni doprinosi oba člana nisu dostavljeni. Ne izmišljati.


## Week 3 predaja

- Automatizovani izlaz: `docs/runs/week3-checks.txt` — typecheck, 31 unit testa,
  5/5 eval-a i build prošli.
- Code commits: priprema `205b709`, K1 `8c52dd8`, K2 `675fd58`, K3 `cd76dfe`,
  baseline `7586646`, evidence baseline `f9b9f07`, K5 `75635b3`, K5 evidence
  `d2ee94c`, vizuelni sloj `531f4cc`.
- Tag hash-evi: `baseline` = `7586646872d1b346b013b3d95067d1febd019ede`;
  `after-fix` = `75635b31616a26b4db537faadf7d597aed9237ad`.
- Vizuelna ručna provera i četiri obavezna screenshot-a ostaju nedovršeni zbog
  nedostupnog browser-a u ovom agent okruženju. Ukupno proteklo Week 3 vreme
  nije izmereno i zato se limit od 240 minuta ne potvrđuje.
- Imena/doprinosi para još nisu dostavljeni.
