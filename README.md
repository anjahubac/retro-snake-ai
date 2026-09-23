# Pixel Zmija

Originalna Snake-inspired browser igra za SITA AI Bootcamp 2026. Igra radi
lokalno uz Vite, TypeScript strict i Canvas 2D; nema backend-a, login-a,
leaderboard-a ili spoljašnjih asseta. Week 3 kod i automatizovane provere su
sačuvani; ručni browser review i screenshot evidence su još na čekanju. AI Hint
je planiran za Week 4 i još nije implementiran.

## Pokretanje

```bash
npm install
npm run dev
```

Kontrole: strelice ili W/A/S/D menjaju smer; Space pokreće, pauzira/nastavlja,
a posle kraja započinje novu partiju u `ready` stanju. Space ponovo pokreće je.

GameConfig može da se preda preko URL parametra `?config=<JSON>`, na primer:

```text
?config=%7B%22gridSize%22%3A12%2C%22tickMs%22%3A120%2C%22startLength%22%3A3%2C%22winScore%22%3A2%7D
```

Nevalidan config prikazuje bezbednu poruku i koristi podrazumevanu konfiguraciju.

## Provere

```bash
npm run typecheck
npm test
npm run eval
npm run build
```

`npm test` pokreće unit i AI testove; `npm run eval` pokreće E1–E5.

## Dokazi i kontekst

- `docs/GAME_SPEC.md` — pravila, scope i Definition of Done.
- `docs/BUILD_PROMPT_V1.md` — istorijski baseline prompt.
- `docs/BUILD_PROMPT_FINAL.md` — V1 uz stvarno korišćene dopune.
- `docs/CONTEXT_MANIFEST.md` — planerski i implementacioni kontekst.
- `docs/EVALS.md`, `docs/EVIDENCE_003.md`, `docs/EVIDENCE_004.md` — eval-i i dokazi.
- `docs/AI_USAGE_LOG.md` — AI iteracije i sledeće odluke.
- `docs/runs/` — sirovi izlazi baseline-a, posle popravke i Week 3 provera.
- `baseline` i `after-fix` tagovi čuvaju eval poređenje.

`?ai=` primeri su rezervisani za budući fake AI Hint u Week 4 i trenutno nisu
aktivni.
