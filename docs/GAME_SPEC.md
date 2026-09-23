# GAME_SPEC — Pixel Zmija

Status: **osnovna pravila zaključana 2026-09-23; fazni raspored revidiran istog dana.**
Izmena ovog fajla se upisuje u `AI_USAGE_LOG.md` sa razlogom; ručni upis za R0:
„Na zahtev korisnika definisani privremeno uklanjanje AI UI-ja i termin povratka;
pravila igre nisu menjana.“ Prioritet je iza izričitog zahteva korisnika.

## Fazna dopuna — revizija R

Task R1 iz `IMPLEMENTATION_STEPS.md` privremeno uklanja „AI savet“ iz UI-ja i
isključuje njegovu aplikacionu integraciju, uz sačuvane AI module i testove.
R1 je implementiran; AI panel je uklonjen i ostaje van UI-ja do planiranog
R4 u periodu 28.09–04.10.2026. AI moduli i testovi ostaju u projektu.

Arcade nivoi i ubrzavanje su usvojeni u R2; prepreke i bonus hrana u R7
na zahtev korisnika. Rekord ostaje van scope-a. Novi vizuelni pravac je R3.

## Naziv

Pixel Zmija (Snake-inspired). Bez originalnih asseta, muzike, naziva ili loga.

## Opis

Igrač upravlja zmijom koja se kreće po kvadratnoj mreži, jedno polje po tick-u.
Zmija jede hranu, za svaku hranu dobija poen i postaje duža za jedno polje.
Partija se gubi udarcem u zid ili u sopstveno telo. Classic se dobija kad
poeni dostignu `winScore`; Arcade kad se popuni tabla. Dugme „Ask AI for Hint“
(kad je uključeno u fazi R4) traži savet na osnovu read-only snimka stanja.

## Cilj igrača i kontrole

Cilj: skupiti `winScore` poena bez sudara.

| Taster | Akcija |
|---|---|
| Strelice ili W A S D | promena smera |
| Space | start / pauza / nastavak / nova partija posle kraja |
| Select režima | započinje novu Classic ili Arcade partiju |
| Klik na „Ask AI for Hint“ (R4) | pauzira igru i traži savet |

## Osnovni game loop

```
ready --Space--> running --Space--> paused --Space--> running
running --tick--> (pomeri zmiju, proveri sudar, proveri hranu, proveri pobedu)
running --sudar--> over     running --poeni >= winScore--> won
over | won --Space--> nova partija (ready)
```

Tick se izvršava svakih `tickMs` milisekundi. Tick menja stanje **samo** u `running`.

## Win / lose

- **Classic win:** `score >= winScore` → status `won`.
- **Arcade win:** tabla puna, nema slobodnog polja za hranu → `won`.
- **Lose:** glava bi izašla van table ili ušla u telo → status `over`.

## Režimi (revizija R2)

- Režim je `classic` ili `arcade`; default je Classic. `?mode=classic` i
  `?mode=arcade` biraju početni režim; nepoznata vrednost bira Classic.
  Vidljivi select omogućava promenu i započinje novu `ready` partiju.
- Režim je deo `GameState`, a ne `GameConfig`. Četiri postojeća `GameConfig`
  polja i njihova URL validacija ostaju nepromenjeni.
- Classic zadržava sadašnje ponašanje.
- Arcade koristi istu tablu, početnu dužinu i pravilo hrane. Svaka hrana
  dodaje jedan poen i segment. `level = 1 + floor(score / 5)`. Ne završava
  se na `winScore`; sudar je poraz, puna tabla pobeda.
- Arcade interval je `max(60, config.tickMs - 10 * (level - 1))`.
  Classic koristi `config.tickMs`. Nivo se računa iz score-a.
- Pauza zaustavlja napredovanje. Promena tempa ne dodaje niti preskače tick.
  Restart čuva režim i resetuje score i tempo.

## Arcade prepreke i bonusi (R7 + progresija R8)

Ova revizija zamenjuje R2 računanje nivoa iz ukupnog score-a.

- Napredak je `score - bonusPoints`: broj običnih hrana. Nivo je `1 + floor(progress / 5)`.
  Težina koristi `min(level, 10)`; posle desetog nivoa igra se nastavlja sa istim
  parametrima. Bonus poeni ulaze samo u ukupan rezultat.
- Cilj prepreka je `min(18, 2 * (min(level, 10) - 1))`, dodatno ograničen brojem
  kandidata na konkretnoj tabli. Dopunjuju se samo pri jedenju obične hrane,
  ostaju do kraja partije.
- Kandidati su unutrašnja polja sa parnim x/y koordinatama (od 2 do
  gridSize - 3), što ostavlja povezane prolaze i slobodan obod na svim tablama.
  Preskaču se zmija, hrana, bonus i polja na Manhattan udaljenosti <= 3 od
  nove glave. Ako nema bezbednih kandidata, broj prepreka može biti manji;
  dopuna se pokušava pri sledećoj običnoj hrani. Sudar sa preprekom je poraz.
- Od desete obične hrane (nivo 3), na svakih pet običnih hrana nastaje jedan
  zlatni bonus ako nema aktivnog bonusa i ima slobodnog polja. Njegovi parametri
  se uzimaju pri nastanku iz nivoa tada na snazi: vrednost je
  `floor((level + 1) / 2) + 1`, trajanje `60 - 4 * (level - 3)` poteza.
  Primeri: nivo 3 +3/60, nivo 4 +3/56, nivo 5 +4/52, nivo 10 +6/32.
  Bonus ne raste sa zmijom. Pauza/ready/kraj ne troše trajanje; može se uzeti
  i u poslednjem potezu. Propušten bonus nema kaznu. Već aktivni bonus zadržava
  svoju vrednost i početno trajanje preko prelaza nivoa.
- Obična hrana i bonus nikad nisu na zmiji, preprekama ili jedno na drugom.
  Ako pri stvaranju obične hrane samo bonus zauzima poslednje slobodno polje,
  bonus se uklanja i to polje postaje obična hrana. Pobeda znači da zmija
  popunjava sva polja koja nisu prepreke.
- Restart/promena režima resetuju prepreke, bonus i bonus poene.
- UI prikazuje napredak, stvarni broj prepreka prema dostižnom cilju, bonus vrednost i preostale poteze.
  AI ostaje isključen; njegov Arcade danger zahteva R4 reviziju pre povratka.

## AI savet (R4, sledeća nedelja)

Kad se vrati, AI savet koristi jedan read-only alat `get_game_state` iz
`TOOL_CONTRACT.md`. Trenutno nema AI kontrole u interfejsu niti poziva iz
aplikacije. Sačuvani moduli i testovi su osnova za tu iteraciju; nema live
provider-a.

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
- power-up-ovi osim R7 bonus hrane, proceduralne arene
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
- [ ] Classic i Arcade ručne provere iz revizije R u `IMPLEMENTATION_STEPS.md`
      su prošle
- [ ] `?config={"gridSize":-5}` prikazuje poruku, a igra radi sa podrazumevanom konfiguracijom
- [ ] Po završetku R4: „Ask AI for Hint“ prikazuje validan savet (fake klijent);
      `?ai=timeout` prikazuje bezbednu poruku
- [ ] `git grep -i -e "sk-ant" -e "api_key="` ne vraća ništa
