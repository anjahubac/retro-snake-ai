# Pixel Zmija

Originalna Snake-inspired browser igra za SITA AI Bootcamp 2026. Pokreće se
lokalno uz Vite, TypeScript strict i Canvas 2D; nema backend-a, baze, login-a,
leaderboard-a ili spoljnih asseta.

## Pokretanje

```bash
npm install
npm run dev
```

Kontrole: strelice ili W/A/S/D menjaju smer; Space pokreće, pauzira/nastavlja,
a posle kraja priprema novu partiju.

`GameConfig` se učitava preko `?config=<JSON>`, na primer:

```text
?config=%7B%22gridSize%22%3A12%2C%22tickMs%22%3A120%2C%22startLength%22%3A3%2C%22winScore%22%3A2%7D
```

Nevalidan config prikazuje bezbednu poruku i koristi podrazumevanu konfiguraciju.

## Režimi igre

Classic je podrazumevani režim i završava se na `winScore` poena. Arcade
ubrzava igru na svakih pet poena i završava se sudarom ili kad se popuni tabla.
Režim možeš izabrati u interfejsu ili početnim URL parametrom `?mode=arcade`;
nepoznat režim koristi Classic.

## AI savet

AI savet je privremeno uklonjen iz interfejsa. Povratak je planiran za
28.09–04.10.2026. Fake klijent, validatori, alati i testovi ostaju u projektu;
`?ai=` trenutno nema uticaja.

## Provere

```bash
npm run typecheck
npm test
npm run eval
npm run build
```

`npm test` pokreće game i postojeće AI unit testove, `npm run eval` pokreće E1–E5.

## Dokazi i kontekst

- `docs/GAME_SPEC.md` — pravila, scope i Definition of Done.
- `docs/TOOL_CONTRACT.md` — read-only ugovor alata `get_game_state`.
- `docs/BUILD_PROMPT_V1.md` — istorijski baseline prompt.
- `docs/BUILD_PROMPT_FINAL.md` — V1 sa stvarno korišćenim dopunama.
- `docs/CONTEXT_MANIFEST.md` — planerski i implementacioni kontekst.
- `docs/EVALS.md`, `docs/EVIDENCE_003.md`, `docs/EVIDENCE_004.md` — eval-i i dokazi.
- `docs/AI_USAGE_LOG.md` — značajne AI iteracije.
- `docs/runs/` — stvarni test/eval izlazi; browser screenshot-i se dodaju posle
  ručne provere.
- `baseline` i `after-fix` git tagovi čuvaju Week 3 poređenje.
