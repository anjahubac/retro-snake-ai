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

Classic je podrazumevani režim: svaka hrana donosi jedan poen i jedan segment,
a partija se dobija na `winScore` poena. Arcade traje do sudara ili popunjavanja
slobodnog dela table. Režim možeš izabrati u interfejsu ili početnim URL
parametrom `?mode=arcade`; nepoznat režim koristi Classic. Promena režima
započinje novu partiju.

U Arcade režimu nivo raste na svakih pet **običnih** hrana. Zmija ubrzava do
10. nivoa. Od 2. nivoa pojavljuju se prepreke: cilj raste za dve po nivou, do
18. Broj može biti manji na maloj ili zauzetoj tabli, jer se prepreka ne
postavlja na zmiju, hranu, bonus ili neposredno pred glavu. Udar u prepreku
završava partiju.

Od 3. nivoa, na svakih pet običnih hrana može se pojaviti zlatni bonus.
Donosi od **+3 do +6 poena**, traje od **60 do 32 aktivna poteza** prema nivou
i ne produžava zmiju. Bonus poeni ne povećavaju nivo niti brzinu. Pauza
zamrzava njegov rok. Od 11. nivoa tempo, broj prepreka i bonus parametri
ostaju kao na 10. nivou. Cela [tabela nivoa](Plan.md#arcade-nivoi-1-10) je u Planu.

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
npm run coverage
```

`npm test` pokreće game, AI i DOM/Canvas testove; `npm run eval` pokreće E1–E5.
`npm run coverage` meri `src/**/*.ts` i zahteva najmanje 90% za iskaze, grane,
funkcije i linije. Unit testovi koriste lokalni DOM i lažni Canvas kontekst;
browser pregled ostaje zasebna vizuelna provera.

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
