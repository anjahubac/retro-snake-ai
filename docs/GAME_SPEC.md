# GAME_SPEC — Pixel Zmija

Status: **zaključano 2026-09-23.** Izmena ovog fajla se upisuje u `AI_USAGE_LOG.md`
sa razlogom. Ovaj fajl ima najveći prioritet kad se izvori razlikuju.

## Naziv

Pixel Zmija (Snake-inspired). Bez originalnih asseta, muzike, naziva ili loga.

## Opis

Igrač upravlja zmijom koja se kreće po kvadratnoj mreži, jedno polje po tick-u.
Zmija jede hranu, za svaku hranu dobija poen i postaje duža za jedno polje.
Partija se gubi udarcem u zid ili u sopstveno telo, a dobija kad poeni dostignu
`winScore`. Dugme „Ask AI for Hint“ traži kratak savet koji AI daje na osnovu
read-only snimka stanja igre.

## Cilj igrača i kontrole

Cilj: skupiti `winScore` poena bez sudara.

| Taster | Akcija |
|---|---|
| Strelice ili W A S D | promena smera |
| Space | start / pauza / nastavak / nova partija posle kraja |
| Klik na „Ask AI for Hint“ | pauzira igru i traži savet |

## Osnovni game loop

```
ready --Space--> running --Space--> paused --Space--> running
running --tick--> (pomeri zmiju, proveri sudar, proveri hranu, proveri pobedu)
running --sudar--> over     running --poeni >= winScore--> won
over | won --Space--> nova partija (ready)
```

Tick se izvršava svakih `tickMs` milisekundi. Tick menja stanje **samo** u `running`.

## Win / lose

- **Win:** `score >= winScore` → status `won`.
- **Lose:** glava bi izašla van table ili ušla u telo → status `over`.

## Ključna pravila

1. Tabla je mreža `gridSize × gridSize`, koordinate od `0` do `gridSize - 1`,
   `(0,0)` je gore levo. Zmija se pomera tačno jedno polje po tick-u.
2. Na startu zmija ima `startLength` delova, horizontalno. Glava je na
   `(floor(gridSize/2), floor(gridSize/2))`, telo levo od nje, smer je `right`.
3. Strelice/WASD menjaju smer. Okret za 180° (u suprotan smer) se ignoriše.
4. Kad glava uđe na polje hrane: `score + 1`, zmija raste za jedno polje, a nova
   hrana se stvara na nasumičnom **slobodnom** polju (nikad na zmiji).
5. Ako bi glava izašla van table → `over`. Zmija nikad nije van table.
6. Ako bi glava ušla u telo → `over`. Izuzetak: polje repa je slobodno ako zmija
   u tom tick-u ne jede (rep se pomera).
7. Kad `score >= winScore` → `won`.
8. Konfiguracija igre prolazi runtime validaciju. Nevalidna konfiguracija se
   odbija, igra koristi `DEFAULT_CONFIG` i prikazuje poruku.

## Strukturisan deo: GameConfig

```ts
type GameConfig = {
  gridSize: number;    // ceo broj, 10..30
  tickMs: number;      // ceo broj, 60..400
  startLength: number; // ceo broj, 2..5
  winScore: number;    // ceo broj, 1..50
};
const DEFAULT_CONFIG = { gridSize: 20, tickMs: 150, startLength: 3, winScore: 15 };
```

- Validan primer: `{ "gridSize": 12, "tickMs": 120, "startLength": 3, "winScore": 10 }`
- Nevalidan primer: `{ "gridSize": -5, "tickMs": "fast" }`
- Višak ključeva je greška. Ulaz koji nije objekat je greška.
- Izvor u aplikaciji: URL parametar `?config=<JSON>`. Bez parametra → `DEFAULT_CONFIG`.

## Minimalni vizuelni zahtevi

- Canvas `gridSize * 20` px, tamna pozadina, zmija zelena (glava tamnije
  zelena), hrana crvena.
- Iznad table: poeni i tekst statusa („Pritisni Space“, „Pauza“, „Kraj“, „Pobeda!“).
- Poruka o nevalidnoj konfiguraciji je vidljiva iznad table.
- Ispod table: dugme „Ask AI for Hint“ i polje sa savetom ili bezbednom greškom.

## AI Hint (Sesija 004)

Jedan read-only alat `get_game_state`. Tačan ugovor je u `TOOL_CONTRACT.md`.
AI daje savet, igra ostaje jedini autoritet nad stanjem.

## Van scope-a

- multiplayer, login, korisnički nalozi, online leaderboard
- backend, baza, deployment
- zvuk i muzika, animacije osim pomeranja
- više nivoa, prepreke, power-up-ovi, procedural generation
- AI-controlled protivnik, AI koji sam igra
- mobilne kontrole (touch)
- čuvanje rekorda (ni localStorage)
- bilo koji alat osim `get_game_state`; bilo koja write operacija kroz AI

## Definition of Done

- [ ] `npm run typecheck` prolazi bez grešaka
- [ ] `npm test` prolazi
- [ ] `npm run eval` pokrenut na baseline-u i posle promene; izlaz sačuvan u
      `docs/runs/`, rezultati upisani u `EVALS.md`
- [ ] `npm run build` prolazi
- [ ] Ručna provera iz Koraka 3 u `IMPLEMENTATION_STEPS.md` je prošla
- [ ] `?config={"gridSize":-5}` prikazuje poruku, a igra radi sa podrazumevanom konfiguracijom
- [ ] „Ask AI for Hint“ prikazuje validan savet (fake klijent); `?ai=timeout`
      prikazuje bezbednu poruku
- [ ] `git grep -i -e "sk-ant" -e "api_key="` ne vraća ništa
