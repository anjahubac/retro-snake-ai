# IMPLEMENTATION_STEPS — Pixel Zmija

## Revizija R — aktivni zadaci

Ažurirano 2026-09-23. `Plan.md`, sekcija „Aktivna revizija“, sadrži pregled
stanja i predloge. R zadaci imaju nezavisne ID-jeve; ne menjaju originalne
K0–K11 testove i potpise ispod. R0 je završen; R1 je implementiran i
automatizovane provere su prošle (browser review nije izvršen); R2 je
specifikovan i implementiran kroz R5/R6; R3 je implementiran; R4 ostaje
planiran za 28.09–04.10.2026. AI panel trenutno nije u aplikaciji.

Zajednički kontekst R zadataka: `AGENTS.md`,
`.github/copilot-instructions.md`, `.github/00-index.instructions.md`,
`docs/GAME_SPEC.md`, aktivni zadatak i aktivna revizija `Plan.md`.
M1–M5 označavaju numerisane module iz indeksa; čitaju se samo moduli
navedeni u zadatku. Istorijski promptovi/evidence se ne prepisuju.

### R8 — Dokumentuj progresiju do nivoa 10

**Status:** plan napravljen na zahtev korisnika; kod se u ovom koraku ne menja.
**Kontekst:** zajednički; M3, M5; R7 pravila kao izvor trenutnog stanja.
**Dozvoljeni fajlovi:** `Plan.md`, `docs/IMPLEMENTATION_STEPS.md`.
**Ishod:** tabela za nivoe 1–10 u Plan R8, bonus vrednosti i trajanje,
ponašanje posle nivoa 10, prilagođene table/tempo i odvojeni implementacioni zadatak.
**Izlazna komanda:** `git diff --check`.

### R9 — Implementiraj progresiju iz Plan R8

**Status:** implementirano prema usvojenoj tabeli Plan R8. Typecheck, 144 unit
testa, 5 eval-a, build i `git diff --check` prolaze. Browser review nije
izvršen jer runtime nema povezan browser. GAME_SPEC ažuriran kao R7 + R8.
**Kontekst:** zajednički; M1, M2, M4; Plan R8, game logika/tipovi, main,
renderer i postojeći Arcade testovi.
**Dozvoljeni fajlovi:** `src/game/types.ts`, `src/game/logic.ts`, `src/main.ts`,
`src/render.ts`, `src/style.css`, `index.html`, `tests/arcade-items.test.ts`, `docs/GAME_SPEC.md`, `docs/IMPLEMENTATION_STEPS.md`, `Plan.md`.

**Rad i prihvatanje:**
1. Uskladiti spec; napraviti jedinstven izvor parametara nivoa za game sloj i UI.
2. Uvesti cilj do 18 prepreka sa limitom broja kandidata; sačuvati bezbedno
   postavljanje i odloženu dopunu iz R7. UI prikazuje stvarni broj/cilj.
3. Bonus dobija vrednost i početno trajanje pri nastanku prema R8 tabeli.
   UI, prsten i dodela poena koriste te podatke; aktivni bonus se ne menja
   na prelazu nivoa. Nivo/tempo i dalje zavise samo od obične hrane.
4. Testirati svaki red tabele, granice 4→5, 9→10, …, 44→45 i 49→50,
   sva bonus trajanja/vrednosti, poslednji potez, pauzu, reset i immutability.
   Proveriti 10/20/30 mreže, minimum intervala i fiksne parametre od nivoa 10.
5. Ažurirati zastarele R7 provere u `tests/arcade-items.test.ts` tako da
   precizno proveravaju tabelu R8; ne uklanjati ih niti slabiti asercije.
   Dodati pokrivanje svih nivoa, tabli i prelaza sa aktivnim bonusom.
6. Classic regresije i AI testovi ostaju; AI panel se ne vraća.

**Izlaz:** `npm run typecheck && npm test && npm run eval && npm run build`;
`git diff --check`. Ručno proveriti balans svih deset nivoa, čitljivost na
360 px i desktopu, prelaz nivoa sa aktivnim bonusom i nastavak posle nivoa 10.
Automatske provere i vizuelnu proveru prijaviti odvojeno.

### R7 — Prepreke i bonusi u Arcade režimu

**Status:** implementirano po izričitom zahtevu korisnika. Typecheck, 114 unit
testova, 5 eval-a, build i diff provera prolaze. Vizuelna provera nije
izvršena: lokalni server radi, ali Browser runtime nema povezan browser.
**Kontekst:** zajednički; M1, M2, M4; game logika, renderer, main i postojeći testovi.
**Dozvoljeni fajlovi:** `src/game/types.ts`, `src/game/logic.ts`, `src/render.ts`,
`src/main.ts`, `src/style.css`, `index.html`, `tests/arcade-items.test.ts`,
`docs/GAME_SPEC.md`, `docs/IMPLEMENTATION_STEPS.md`, `Plan.md`.

Pravila su u R7 sekciji GAME_SPEC. Implementirati sudare, bezbedno postavljanje,
bonus poene odvojene od napretka, prikaz i reset. Classic i AI integracija
ostaju nepromenjeni. Testirati pragove, spawn, istek i poslednji potez bonusa,
pauzu, reset, nepromenljivost, punu tablu i Classic regresiju.
**Izlaz:** `npm run typecheck && npm test && npm run eval && npm run build`,
`git diff --check`. Browser provera se navodi zasebno.

### R0 — Revizija plana i instrukcija

**Scope:** isključivo dokumentacija, po zahtevu korisnika od 2026-09-23.
**Kontekst:** zajednički; M3, M5; manifest i evidencija za utvrđivanje stanja;
`package.json`, `index.html`, `src/main.ts`, `src/style.css`, `src/render.ts`
kao read-only izvor stvarne implementacije.
**Dozvoljeni fajlovi:** `Plan.md`, `AGENTS.md`,
`.github/copilot-instructions.md`, `.github/00-index.instructions.md`,
`.github/instructions/03-workflow.instructions.md`,
`docs/IMPLEMENTATION_STEPS.md`, `docs/GAME_SPEC.md`, `docs/CONTEXT_MANIFEST.md`.

**Prihvatanje:** označeno stvarno stanje; nove ideje su predlozi; R1 ima
scope, kriterijume i proveru; R4 ima datum i uslove povratka; instrukcije
usmeravaju na aktivni zadatak. Spec dobija samo faznu dopunu, bez novih
game pravila. Log i izveštaji o starim testovima ostaju neizmenjeni.

**Izlazna komanda:** `git diff --check`.
**Pregled:** proveriti lokalne linkove, usklađenost statusa i rokova i diff;
nema izmena u `src/`, `tests/`, `evals/` ili zavisnostima. Nema potrebe za
novim aplikacionim testovima u dokumentacionom koraku.

### R1 — Privremeno ukloni sekciju „AI savet“

**Status:** implementirano; typecheck, 72 unit testa, 5 eval-a i build su
prošli. Browser review nije izvršen: lokalni server nije mogao da se pokrene
u sandbox-u (`listen EPERM`).
**Procena:** 30–45 minuta sa proverama.
**Kontekst:** zajednički; M1, M4; `index.html`, `src/main.ts`, `src/style.css`,
`README.md`; postojeći importi iz `src/main.ts` samo radi razumevanja veza.
**Dozvoljeni fajlovi:** `index.html`, `src/main.ts`, `src/style.css`, `README.md`.

**Rad:**
1. Ukloni ceo `#hint-panel`, uključujući naslov, dugme, fake oznaku, hint
   live region i prateća uputstva. Ne ostavljaj praznu karticu ili najavu.
2. U `src/main.ts` ukloni AI importe, obavezne upite za AI DOM elemente,
   kreiranje fake klijenta, obradu `?ai=`, click handler, `hintPending` i
   njegovu blokadu game input-a. Ukloni import `togglePause` ako više nije
   korišćen. Sačuvaj standardnu Space pauzu kroz `handleSpace`.
3. Ukloni samo CSS selektore namenjene AI panelu; sačuvaj opšte stilove
   fokusa i pristupačnosti. Ne redizajniraj tablu u ovom koraku.
4. U README navedi da je AI UI privremeno uklonjen i da je nastavak planiran
   za 28.09–04.10.2026; fake modul i testovi ostaju u projektu. Dotadašnji
   URL primeri ne smeju obećavati da sada prikazuju savet.

**Kriterijumi prihvatanja:**
- [ ] Nema AI panela, njegovog teksta, praznog razmaka ili fokusabilnog dugmeta.
- [ ] Startup radi bez AI elemenata; konzola nema grešku `requireElement`.
- [ ] Start, smerovi, pauza/nastavak, sudari i nova partija i dalje rade.
- [ ] `/`, `/?ai=success`, `/?ai=timeout`, `/?ai=unsupported_tool` i
      `/?ai=bilo-sta` prikazuju istu igru bez AI; parametar je neaktivan.
- [ ] Nevalidan `?config` i dalje prikazuje fallback poruku i omogućava igru.
- [ ] Nema produkcionog poziva `requestHint` iz aplikacije ni AI čekanja.
- [ ] `src/ai/`, game logika, svi postojeći testovi i ugovor alata sačuvani.
- [ ] Raspored i tastatura provereni u browser-u na 360 px i desktopu;
      ako browser provera nije izvršena, to je jasno označeno kao preostalo.

**Izlazna komanda:**
`npm run typecheck && npm test && npm run eval && npm run build`.
Nema novih paketa ili test framework-a. Postojeći AI testovi ostaju aktivni.
R1 se ne označava završenim samo na osnovu uklonjenog HTML-a.

### R2 — Specifikacija Arcade moda

**Status:** usvojena preporučena opcija po zahtevu da se nastavi implementacija.
Classic + Arcade sa nivoima i ubrzavanjem. Prepreke, bonusi i rekord ostaju
zasebni predlozi za kasnije.
**Kontekst:** zajednički; M1, M2; postojeći game tipovi/config/logika,
`src/main.ts`, `tests/config.test.ts`, `tests/logic.test.ts`, `evals/evals.test.ts`.
**Dozvoljeni fajlovi kad se zadatak izabere:** `docs/GAME_SPEC.md`,
`docs/IMPLEMENTATION_STEPS.md`, `Plan.md`.

**Zaključena pravila:**
- Režim je `classic` ili `arcade`, podrazumevano Classic. `?mode=classic` ili
  `?mode=arcade` bira početni režim; nepoznata vrednost pada nazad na Classic.
- `GameConfig` i `?config` ostaju tačno četiri postojeća polja. Režim je
  `GameState` metadata, ne novo config polje. Classic pravila se ne menjaju.
- Arcade počinje istom tablom i zmijom. Svaka obična hrana daje jedan poen i
  jedan segment. Nivo je `1 + floor(score / 5)`. Arcade ignoriše `winScore`;
  pobeda nastupa kad nema slobodnog polja za novu hranu. Sudar je poraz.
- Arcade interval je `max(60, config.tickMs - 10 * (level - 1))` ms. Classic
  uvek koristi `config.tickMs`. Nivo se izvodi iz score-a, ne čuva odvojeno.
- Pauza zaustavlja napredovanje. Promena intervala ne sme da duplira/preskoči
  tick. Restart zadržava izabrani režim i resetuje score, nivo i tempo.
  Timer ostaje u `main.ts`; game logika ostaje čista.
- UI prikazuje izbor režima i Arcade nivo. Nema bonusa i prepreka u ovom paketu.

**Prihvatanje:** izabrana pravila uneta u spec i uklonjena samo njihova
odgovarajuća zabrana iz scope-a; dodati zasebni implementacioni zadaci sa
dozvoljenim fajlovima i proverama. Definisati testove pragova nivoa, minimuma
intervala, resetovanja, pauze, nepromenljivosti ulaza i Classic regresije.
Tajmer ne sme da se duplira ili pravi dodatni potez pri promeni tempa.
Postojeći testovi i E1–E5 ostaju; novi scenariji ih dopunjuju.
Prepreke, ako se kasnije izaberu, zahtevaju poseban korak i proveru uticaja
na AI `danger` pre povratka saveta u taj režim.

**Izlazna komanda:** `git diff --check`; ručni pregled ugovora i kriterijuma.

### R5 — Implementiraj Arcade pravila u game sloju

**Kontekst:** zajednički; M1, M2; game tipovi/logika i postojeći logic testovi.
**Dozvoljeni fajlovi:** `src/game/types.ts`, `src/game/logic.ts`,
`tests/arcade.test.ts` (novi; postojeće testove ne menjati).

Dodaj `GameMode`; `GameState` čuva režim; `createInitialState(config, rng,
mode = "classic")` i `handleSpace` čuvaju režim pri restartu. Arcade ne
završava na `winScore`, ali pobeđuje kad `spawnFood` vrati `null`. Dodaj čiste
funkcije `getLevel(score)` i `getTickMs(config, mode, score)` po pravilima R2.
Bez DOM-a ili tajmera u game sloju.

Novi testovi pokrivaju default Classic, Arcade init/restart, level na 0/4/5/9/10,
interval 150/140/130 i clamp 60 ms, nastavak preko `winScore`, pobedu pune
table, Classic pobedu na limitu i pauzirani tick. `tests/logic.test.ts` i E1–E5
ostaju nepromenjeni.
**Izlazna komanda:** `npm run typecheck && npm test && npm run eval`.

### R6 — Poveži režim, nivo i tempo u UI

**Kontekst:** zajednički; M1, M4; R5 API, `index.html`, `src/main.ts`.
**Dozvoljeni fajlovi:** `index.html`, `src/main.ts`.

Dodaj Classic/Arcade select, početnu vrednost iz `?mode=` sa Classic fallback-
om; promena režima počinje novu `ready` partiju. Nivo prikaži samo u Arcade.
Podesi timer na `getTickMs`; pri promeni intervala prvo očisti postojeći timer,
pa postavi jedan novi bez dodatnog tick-a. Pauza ne menja score ili nivo.
AI panel ostaje uklonjen.

**Izlazna komanda:** `npm run typecheck && npm test && npm run eval && npm run build`.
**Ručna provera:** oba režima, URL izbor i fallback, promena režima, prelaz
score 4→5, pauza, restart i odsustvo duplog tick-a.

### R3 — Osavremeni vizuelni sloj

**Status:** implementirano zajedno sa R6 i R4. Typecheck, 85 unit testa,
5 eval-a i build su prošli. Browser review nije izvršen: lokalni server nije
mogao da se pokrene u sandbox-u (`listen EPERM`).
**Procena:** 1–2 sata sa vizuelnom proverom.
**Kontekst:** zajednički; M1, M4; `index.html`, `src/style.css`, `src/render.ts`,
`src/main.ts` i `src/game/types.ts` kao read-only integracioni kontekst.
**Dozvoljeni fajlovi kad se zadatak izabere:** `index.html`, `src/style.css`,
`src/render.ts`; vizuelna sekcija `docs/GAME_SPEC.md` za izabrani pravac.

**Prihvatanje:** primenjen izabrani raspored/paleta/tipografija; funkcionalni
ID-jevi i tipovi DOM elemenata kompatibilni sa `requireElement`; `CELL = 20`
i potpis renderer-a sačuvani; logički koordinatni sistem nezavisan od CSS
širine; oštar DPR 1/2 prikaz i pravilno ponovno merenje nakon resize-a.
Stanja ready/running/paused/over/won čitljiva; Arcade nivo jasno prikazan.
Bez AI panela, lažnih metrika ili novih kontrola igre. Nema spoljnih asseta,
fontova ili novih zavisnosti.
Promena CSS širine table mora ukloniti/sinhronizovati postojeći inline
`canvas.style.width` u renderer-u, da se novi raspored stvarno primeni.

**Izlazna komanda:**
`npm run typecheck && npm test && npm run eval && npm run build`.
**Vizuelna provera:** 360 px i desktop, zoom 200%, DPR 1/2, sva stanja igre,
duga config greška, kontrast i fokus. Priložiti stvarne screenshot-e; build
sam nije dokaz da izgled radi. Nova funkcionalna dugmad su zaseban zadatak.

### R4 — Nastavi implementaciju i vrati „AI savet“ sledeće nedelje

**Status:** planirano za 28.09–04.10.2026. AI panel i produkciona integracija
su privremeno uklonjeni; moduli, validatori, fake klijent i testovi ostaju.
**Kontekst:** zajednički; M4, M1, M2; `docs/TOOL_CONTRACT.md`, tadašnji
`src/game/types.ts` i pravila, `src/ai/`, AI testovi, HTML/main/CSS;
izvorni K6–K9 i Plan koraci 9–12 samo prema potrebama konkretnog podzadatka.
**Dozvoljeni fajlovi za početni pregled:** `docs/IMPLEMENTATION_STEPS.md`,
`Plan.md`. Implementacija dobija zasebne podzadatke i precizne liste fajlova.

Polazna tačka je postojeća fake implementacija, ne prazan projekat. Proveriti
šta nedostaje, napraviti podzadatak integracije, pa vratiti panel uz vidljivu
fake oznaku, read-only granicu, runtime validaciju, kontrolisane greške,
pauzu i tastaturni fokus. Rok nije automatski feature flag.

Ako nova pravila utiču na savet, prvo uskladiti alat i testove u zasebnom
koraku. Ne vraćati savet koji ne zna za prepreke ili novi cilj; do usklađivanja
ograničiti AI na podržani Classic režim uz jasnu oznaku. Ne proširivati
snapshot ili allowlist bez revizije ugovora. Live provider nije podrazumevan
deo „implementacije sledeće nedelje“ i zahteva zaseban tehnički zadatak.

**Završno prihvatanje nakon podzadataka:** postojeći AI testovi i nove
regresije prolaze; browser potvrđuje success, nevalidne argumente/nepoznat
alat, provider/timeout/malformed odgovor, blokiranje game input-a dok se
čeka i eksplicitan nastavak Space-om; stanje igre se ne menja savetom.
**Izlaz početnog pregleda:** `git diff --check`.
**Izlaz integracionog podzadatka:**
`npm run typecheck && npm test && npm run eval && npm run build`, uz ručni UI dokaz.

---

## Izvorni koraci K0–K11 — referenca

Sledeći koraci i njihovi testovi ostaju referenca za originalni Core.
Njihovo ranije automatsko redosledno izvršavanje i AI UI iz K0/K9 ne
nadjačavaju aktivni R1/R4 raspored. Za novi rad koristi R zadatke iznad.

Koraci se rade **redom, jedan po jedan**. Svaki korak je jedna AI iteracija.
Posle svakog koraka: pokreni izlaznu komandu sama, upiši red u
`AI_USAGE_LOG.md`, pa commit.

## Kako se šalje korak modelu

Koraci 1–3: pošalji `docs/BUILD_PROMPT_V1.md` sa upisanim brojem koraka.
Ostali koraci: pošalji ovaj kratak prompt.

```
Radiš Korak <N> iz docs/IMPLEMENTATION_STEPS.md, po pravilima iz
.github/copilot-instructions.md. Pročitaj samo fajlove i module iz sekcije
"Kontekst" tog koraka.
Pre izmene: sažmi zadatak, navedi plan, navedi nejasnoće. Ne proširuj scope.
Menjaj samo "Dozvoljeni fajlovi". Testove prepiši tačno i ne menjaj ih.
Gotovo je kad "Izlazna komanda" prođe. Nalepi njen stvarni izlaz.
```

## Budžet (4 sata)

| Korak | Šta | Vreme |
|---|---|---|
| 0 | Projekat i alati | 10 min |
| 1 | Tipovi i GameConfig validacija | 15 min |
| 2 | Logika igre | 25 min |
| 3 | Canvas, tastatura, main | 25 min |
| 4 | Baseline + eval | 15 min |
| 5 | Hipoteza + jedna promena | 20 min |
| 6 | AI tipovi i validatori | 20 min |
| 7 | Alat `get_game_state` | 15 min |
| 8 | Fake klijent + hint flow | 30 min |
| 9 | Dugme u UI | 15 min |
| 10 | Evidence i log | 30 min |
| 11 | (opciono) jedan live poziv | rezerva |

---

## Korak 0 — Projekat i alati (radiš sama, bez AI)

Ako je kurs dao starter, koristi njega i samo prilagodi skripte ispod.

```bash
cd ~/Projects/retro-snake-ai
git init
npm init -y
npm i -D typescript vite vitest
mkdir -p src/game src/ai tests evals docs/runs
```

U `package.json` zameni `"scripts"` i dodaj `"type"`:

```json
"type": "module",
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "typecheck": "tsc --noEmit",
  "test": "vitest run tests",
  "eval": "vitest run evals"
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true
  },
  "include": ["src", "tests", "evals"]
}
```

`.gitignore`:

```
node_modules
dist
.env
.env.*
```

`index.html`:

```html
<!doctype html>
<html lang="sr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pixel Zmija</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <main>
      <h1>Pixel Zmija</h1>
      <p>Poeni: <span id="score">0</span> · <span id="status">Pritisni Space</span></p>
      <p id="config-error" hidden></p>
      <canvas id="board"></canvas>
      <p><button id="hint-btn" type="button">Ask AI for Hint</button> <span id="ai-mode"></span></p>
      <p id="hint" aria-live="polite"></p>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`src/style.css`:

```css
body { margin: 0; background: #111; color: #eee; font-family: system-ui, sans-serif; }
main { max-width: 640px; margin: 0 auto; padding: 16px; }
canvas { display: block; max-width: 100%; border: 1px solid #444; }
#config-error { color: #ff8080; }
#hint { min-height: 1.5em; }
```

`src/main.ts` (privremeno): `export {};`

**Izlazna komanda:** `npm run typecheck`
**Commit:** `git add -A && git commit -m "chore: projekat i docs"`

---

## Korak 1 — Tipovi i GameConfig validacija

**Kontekst:** `.github/copilot-instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md`, `docs/GAME_SPEC.md`, ovaj korak.
**Dozvoljeni fajlovi:** `src/game/types.ts`, `src/game/config.ts`, `tests/config.test.ts`.

### `src/game/types.ts` (prepiši tačno)

```ts
export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type Status = "ready" | "running" | "paused" | "over" | "won";
export type Rng = () => number; // vraća broj u [0, 1)

export type GameConfig = {
  gridSize: number;
  tickMs: number;
  startLength: number;
  winScore: number;
};

export type GameState = {
  config: GameConfig;
  snake: Point[]; // snake[0] je glava
  direction: Direction;
  food: Point | null;
  score: number;
  status: Status;
};
```

### `src/game/config.ts` — šta mora da postoji

```ts
export const DEFAULT_CONFIG: GameConfig; // { gridSize: 20, tickMs: 150, startLength: 3, winScore: 15 }
export function validateConfig(input: unknown):
  | { ok: true; config: GameConfig }
  | { ok: false; errors: string[] };
export function loadConfig(input: unknown): { config: GameConfig; errors: string[] };
```

Pravila za `validateConfig`:
- ulaz mora biti običan objekat (ne `null`, ne niz), inače greška;
- tačno četiri ključa; svaki višak ključ je posebna greška;
- svaka vrednost mora biti ceo broj (`Number.isInteger`) u opsegu:
  `gridSize` 10..30, `tickMs` 60..400, `startLength` 2..5, `winScore` 1..50;
- skuplja **sve** greške, ne staje na prvoj; poruke su kratke, na srpskom,
  npr. `"gridSize mora biti ceo broj od 10 do 30"`;
- kad je validno, vraća **nov** objekat sa samo ta četiri ključa.

`loadConfig`: validan ulaz → `{ config, errors: [] }`; nevalidan →
`{ config: DEFAULT_CONFIG, errors }`.

### `tests/config.test.ts` (prepiši tačno)

```ts
import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, validateConfig, loadConfig } from "../src/game/config";

describe("validateConfig", () => {
  it("prihvata DEFAULT_CONFIG", () => {
    expect(validateConfig(DEFAULT_CONFIG)).toEqual({ ok: true, config: DEFAULT_CONFIG });
  });

  it("prihvata granične vrednosti", () => {
    expect(validateConfig({ gridSize: 10, tickMs: 400, startLength: 2, winScore: 50 }).ok).toBe(true);
    expect(validateConfig({ gridSize: 30, tickMs: 60, startLength: 5, winScore: 1 }).ok).toBe(true);
  });

  it.each([
    ["string", "20"],
    ["null", null],
    ["niz", []],
    ["fali polje", { gridSize: 20, tickMs: 150, startLength: 3 }],
    ["pogrešan tip", { ...DEFAULT_CONFIG, tickMs: "fast" }],
    ["nije ceo broj", { ...DEFAULT_CONFIG, gridSize: 12.5 }],
    ["ispod minimuma", { ...DEFAULT_CONFIG, gridSize: 9 }],
    ["iznad maksimuma", { ...DEFAULT_CONFIG, winScore: 51 }],
    ["višak ključ", { ...DEFAULT_CONFIG, lives: 3 }],
  ])("odbija: %s", (_name, input) => {
    const r = validateConfig(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThan(0);
  });

  it("skuplja sve greške", () => {
    const r = validateConfig({ gridSize: -5, tickMs: "fast" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThanOrEqual(4);
  });
});

describe("loadConfig", () => {
  it("vraća ulaz kad je validan", () => {
    const input = { ...DEFAULT_CONFIG, gridSize: 12 };
    expect(loadConfig(input)).toEqual({ config: input, errors: [] });
  });

  it("vraća DEFAULT_CONFIG i greške kad nije validan", () => {
    const r = loadConfig({ gridSize: -5 });
    expect(r.config).toEqual(DEFAULT_CONFIG);
    expect(r.errors.length).toBeGreaterThan(0);
  });
});
```

**Izlazna komanda:** `npm run typecheck && npm test`

---

## Korak 2 — Logika igre

**Kontekst:** `.github/copilot-instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md`, `docs/GAME_SPEC.md`, ovaj korak, `src/game/types.ts`, `src/game/config.ts`.
**Dozvoljeni fajlovi:** `src/game/logic.ts`, `tests/logic.test.ts`.

### `src/game/logic.ts` — šta mora da postoji

Sve funkcije su čiste: ne menjaju ulaz, vraćaju **nov** objekat, ili **isti**
objekat kad nema promene. Nema `Math.random`, nema DOM-a.

```ts
export function spawnFood(snake: Point[], gridSize: number, rng: Rng): Point | null;
export function createInitialState(config: GameConfig, rng: Rng): GameState;
export function startGame(state: GameState): GameState;
export function togglePause(state: GameState): GameState;
export function changeDirection(state: GameState, dir: Direction): GameState;
export function tick(state: GameState, rng: Rng): GameState;
export function handleSpace(state: GameState, rng: Rng): GameState;
```

- `spawnFood`: napravi listu slobodnih polja redom (y od 0, pa x od 0),
  vrati `free[Math.floor(rng() * free.length)]`; ako nema slobodnih, `null`.
- `createInitialState`: pravilo 2 iz spec-a; `score: 0`, `status: "ready"`,
  `food = spawnFood(...)`.
- `startGame`: `ready` → `running`; inače vraća isto stanje.
- `togglePause`: `running` ↔ `paused`; inače vraća isto stanje.
- `changeDirection`: ako je status `over` ili `won`, ili je `dir` suprotan
  od `state.direction`, vraća isto stanje; inače stanje sa novim smerom.
- `tick`: samo u `running` (inače vraća isto stanje). Nova glava = glava + smer.
  Van table → `status: "over"`, zmija nepromenjena. Jede ako je nova glava na
  hrani. Sudar sa telom: proverava ceo `snake` ako jede, a `snake` bez
  poslednjeg dela ako ne jede → `over`, zmija nepromenjena.
  Jede: `snake = [glava, ...snake]`, `score + 1`; ako `score >= winScore` →
  `won`; inače nova hrana (`null` → `won`).
  Ne jede: `snake = [glava, ...snake bez poslednjeg]`.
- `handleSpace`: `ready` → `startGame`; `running`/`paused` → `togglePause`;
  `over`/`won` → `createInitialState(state.config, rng)`.

### `tests/logic.test.ts` (prepiši tačno)

```ts
import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import {
  createInitialState, startGame, togglePause, changeDirection, tick, spawnFood, handleSpace,
} from "../src/game/logic";
import type { GameState, Point } from "../src/game/types";

const rng = () => 0;
const cfg = { ...DEFAULT_CONFIG, gridSize: 10 };

function running(snake: Point[], extra: Partial<GameState> = {}): GameState {
  return { ...createInitialState(cfg, rng), snake, status: "running", ...extra };
}

describe("createInitialState", () => {
  it("zmija u sredini, smer desno, status ready, hrana na prvom slobodnom polju", () => {
    const s = createInitialState(cfg, rng);
    expect(s.snake).toEqual([{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }]);
    expect(s.direction).toBe("right");
    expect(s.status).toBe("ready");
    expect(s.score).toBe(0);
    expect(s.food).toEqual({ x: 0, y: 0 });
  });
});

describe("start, pauza, space", () => {
  it("startGame: ready -> running", () => {
    expect(startGame(createInitialState(cfg, rng)).status).toBe("running");
  });
  it("togglePause: running <-> paused", () => {
    const p = togglePause(startGame(createInitialState(cfg, rng)));
    expect(p.status).toBe("paused");
    expect(togglePause(p).status).toBe("running");
  });
  it("handleSpace posle kraja pravi novu partiju", () => {
    const over = running([{ x: 5, y: 5 }, { x: 4, y: 5 }], { status: "over", score: 7 });
    const n = handleSpace(over, rng);
    expect(n.status).toBe("ready");
    expect(n.score).toBe(0);
    expect(n.snake).toHaveLength(cfg.startLength);
  });
});

describe("changeDirection", () => {
  const s = startGame(createInitialState(cfg, rng));
  it("prihvata okret za 90°", () => {
    expect(changeDirection(s, "up").direction).toBe("up");
  });
  it("ignoriše okret za 180°", () => {
    expect(changeDirection(s, "left").direction).toBe("right");
  });
  it("ignoriše promenu posle kraja", () => {
    expect(changeDirection({ ...s, status: "over" }, "up").direction).toBe("right");
  });
});

describe("tick", () => {
  it("ne menja stanje kad igra nije running", () => {
    const ready = createInitialState(cfg, rng);
    expect(tick(ready, rng)).toBe(ready);
    const paused = togglePause(startGame(ready));
    expect(tick(paused, rng)).toBe(paused);
  });

  it("pomera zmiju za jedno polje", () => {
    const n = tick(startGame(createInitialState(cfg, rng)), rng);
    expect(n.snake).toEqual([{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }]);
  });

  it("ne menja ulazno stanje", () => {
    const s = startGame(createInitialState(cfg, rng));
    const before = structuredClone(s);
    tick(s, rng);
    expect(s).toEqual(before);
  });

  it("jede hranu: +1 poen, raste, nova hrana nije na zmiji", () => {
    const s = running([{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }], { food: { x: 6, y: 5 } });
    const n = tick(s, rng);
    expect(n.score).toBe(1);
    expect(n.snake).toHaveLength(4);
    expect(n.snake[0]).toEqual({ x: 6, y: 5 });
    expect(n.snake).not.toContainEqual(n.food);
  });

  it("pobeda kad poeni dostignu winScore", () => {
    const s = running([{ x: 5, y: 5 }, { x: 4, y: 5 }], {
      food: { x: 6, y: 5 },
      score: cfg.winScore - 1,
    });
    expect(tick(s, rng).status).toBe("won");
  });

  it("kraj kod gornjeg zida, zmija ostaje na tabli", () => {
    const snake = [{ x: 5, y: 0 }, { x: 5, y: 1 }];
    const n = tick(running(snake, { direction: "up" }), rng);
    expect(n.status).toBe("over");
    expect(n.snake).toEqual(snake);
  });

  it("kraj kad glava udari u telo", () => {
    const snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 }];
    expect(tick(running(snake, { direction: "up" }), rng).status).toBe("over");
  });

  it("polje repa je slobodno kad zmija ne jede", () => {
    const snake = [{ x: 5, y: 5 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 4, y: 5 }];
    const n = tick(running(snake, { direction: "left" }), rng);
    expect(n.status).toBe("running");
    expect(n.snake[0]).toEqual({ x: 4, y: 5 });
  });
});

describe("spawnFood", () => {
  it("vraća jedino slobodno polje", () => {
    const snake: Point[] = [];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (!(x === 9 && y === 9)) snake.push({ x, y });
    expect(spawnFood(snake, 10, () => 0.99)).toEqual({ x: 9, y: 9 });
  });
  it("vraća null kad nema slobodnog polja", () => {
    const snake: Point[] = [];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) snake.push({ x, y });
    expect(spawnFood(snake, 10, rng)).toBeNull();
  });
});
```

**Izlazna komanda:** `npm run typecheck && npm test`

---

## Korak 3 — Canvas, tastatura, main

**Kontekst:** `.github/copilot-instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/04-security.instructions.md`, `docs/GAME_SPEC.md` (sekcije „Kontrole“ i „Vizuelni
zahtevi“), ovaj korak, `index.html`, `src/game/*.ts`.
**Dozvoljeni fajlovi:** `src/render.ts`, `src/main.ts`.

`src/render.ts`:

```ts
export const CELL = 20;
export function render(ctx: CanvasRenderingContext2D, state: GameState): void;
```

Crta pozadinu `#1b1b1b`, hranu `#e04040`, telo `#40c060`, glavu `#208040`,
svako polje kao kvadrat `CELL - 1` px na `(x * CELL, y * CELL)`.

`src/main.ts`:
1. Pročita `?config=` iz `location.search`. Nema parametra → `DEFAULT_CONFIG`.
   `JSON.parse` u `try/catch`; neuspeh → prosledi string `"invalid-json"`.
   Rezultat ide kroz `loadConfig`. Ako ima grešaka, prikaži u `#config-error`
   (skini `hidden`): `"Konfiguracija nije validna, koristi se podrazumevana: "`
   + greške spojene sa `"; "`. Koristi **`textContent`**, nikad `innerHTML`.
2. Canvas `width = height = config.gridSize * CELL`.
3. `let state = createInitialState(config, Math.random)`.
4. `keydown`: strelice i WASD → `changeDirection`; Space → `handleSpace`
   (i `preventDefault`, da strana ne skroluje). Posle svake promene `draw()`.
5. `setInterval(() => { state = tick(state, Math.random); draw(); }, config.tickMs)`.
6. `draw()` poziva `render` i upisuje `#score` i `#status`:
   ready „Pritisni Space“, running „Igra“, paused „Pauza“, over „Kraj — Space za novu“,
   won „Pobeda! — Space za novu“.
7. Dugme `#hint-btn` se **ne** povezuje u ovom koraku.

**Izlazna komanda:** `npm run typecheck && npm test && npm run build`

**Ručna provera** (`npm run dev`, otvori adresu koju ispiše):
- [ ] Space pokreće igru, zmija ide desno
- [ ] strelice i WASD menjaju smer; suprotan smer se ignoriše
- [ ] hrana: +1 poen, zmija raste, nova hrana se pojavi
- [ ] zid → „Kraj“; telo → „Kraj“; Space → nova partija
- [ ] Space tokom igre → „Pauza“, ponovo Space → nastavlja
- [ ] `?config={"gridSize":12,"tickMs":120,"startLength":3,"winScore":2}` → manja tabla, pobeda posle 2 hrane
- [ ] `?config={"gridSize":-5}` → crvena poruka, tabla 20×20 radi

---

## Korak 4 — Baseline i eval (radiš sama, bez AI)

Pravila: `.github/instructions/03-workflow.instructions.md`, `05-commands.instructions.md`.

Napravi `evals/evals.test.ts` (prepiši tačno):

```ts
import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG, validateConfig, loadConfig } from "../src/game/config";
import { createInitialState, startGame, tick, changeDirection, spawnFood } from "../src/game/logic";
import type { Point } from "../src/game/types";

const rng = () => 0;

describe("EVALS", () => {
  it("E1 normalan start", () => {
    const s0 = createInitialState(DEFAULT_CONFIG, rng);
    expect(s0.status).toBe("ready");
    expect(s0.snake).toHaveLength(3);
    expect(s0.snake[0]).toEqual({ x: 10, y: 10 });
    expect(s0.snake).not.toContainEqual(s0.food);
    const s1 = tick(startGame(s0), rng);
    expect(s1.status).toBe("running");
    expect(s1.snake[0]).toEqual({ x: 11, y: 10 });
  });

  it("E2 zid: kraj i zmija ne izlazi van table", () => {
    const cfg = { ...DEFAULT_CONFIG, gridSize: 10 };
    const s = {
      ...createInitialState(cfg, rng),
      status: "running" as const,
      snake: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }],
    };
    const s1 = tick(s, rng);
    expect(s1.status).toBe("over");
    for (const p of s1.snake) {
      expect(p.x >= 0 && p.x < 10 && p.y >= 0 && p.y < 10).toBe(true);
    }
  });

  it("E3 nevalidan config: odbijanje i safe fallback", () => {
    const bad = { gridSize: -5, tickMs: "fast" };
    const v = validateConfig(bad);
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.errors.length).toBeGreaterThanOrEqual(2);
    const l = loadConfig(bad);
    expect(l.config).toEqual(DEFAULT_CONFIG);
    expect(l.errors.length).toBeGreaterThanOrEqual(2);
  });

  it("E4 dva brza pritiska u jednom tick-u ne okreću zmiju u vrat", () => {
    let s = startGame(createInitialState(DEFAULT_CONFIG, rng)); // ide desno
    s = changeDirection(s, "up");
    s = changeDirection(s, "left");
    const s1 = tick(s, rng);
    expect(s1.status).toBe("running");
    expect(s1.snake[0]).toEqual({ x: 10, y: 9 });
  });

  it("E5 hrana se nikad ne stvara na zmiji", () => {
    const snake: Point[] = [];
    for (let y = 0; y < 10; y++) for (let x = 0; x < 10; x++) if (!(x === 9 && y === 9)) snake.push({ x, y });
    for (const r of [0, 0.5, 0.999]) {
      expect(spawnFood(snake, 10, () => r)).toEqual({ x: 9, y: 9 });
    }
  });
});
```

Zatim:

```bash
npm run typecheck && npm test
git add -A && git commit -m "baseline: igra po BUILD_PROMPT_V1"
git tag baseline
npm run eval 2>&1 | tee docs/runs/eval-baseline.txt
```

Napravi screenshot igre u `docs/runs/baseline.png`. Upiši kolonu „Baseline“ u
`docs/EVALS.md` i sekciju „Baseline“ u `docs/EVIDENCE_003.md`.
**Ne popravljaj ništa u ovom koraku.** Commit: `docs: baseline eval rezultati`.

---

## Korak 5 — Jedna hipoteza, jedna promena

Radi se **samo** ako neki eval pada na baseline-u. Uzmi tačno jedan.

Ako pada E4, popuni u `docs/EVIDENCE_003.md` (proveri svaku rečenicu na
stvarnom izlazu pre upisa):

```
Tvrdnja: igra ignoriše okret za 180°.
Signal: E4 pada — posle "gore" pa "levo" u istom tick-u zmija udari u vrat (status over).
Hipoteza: changeDirection poredi novi smer sa poslednjim ZADATIM smerom
  (state.direction), a ne sa smerom kojim se zmija STVARNO pomerila u
  poslednjem tick-u. "gore" menja state.direction, pa "levo" više nije
  suprotno i prolazi.
Najmanja promena: u changeDirection, suprotnost proveravati prema smeru od
  vrata (snake[1]) ka glavi (snake[0]), umesto prema state.direction.
  Samo src/game/logic.ts, bez izmene tipova i testova.
Provera: npm test (svi prethodni testovi i dalje prolaze) + npm run eval (E1–E5).
Rezultat: <upiši stvarni izlaz>
Ograničenje: drugi pritisak u istom tick-u se odbacuje, ne pamti se za
  sledeći tick (nema reda komandi).
```

Prompt za model:

```
Radiš Korak 5 iz docs/IMPLEMENTATION_STEPS.md po .github/copilot-instructions.md.
Kontekst: .github/instructions/03-workflow.instructions.md, .github/instructions/02-testing.instructions.md, src/game/logic.ts, src/game/types.ts, evals/evals.test.ts, docs/EVIDENCE_003.md (hipoteza).
Dozvoljen fajl: samo src/game/logic.ts. Napravi tačno "Najmanju promenu" iz hipoteze, ništa više.
Pre izmene sažmi, plan, nejasnoće. Izlazna komanda: npm run typecheck && npm test && npm run eval. Nalepi stvarni izlaz.
```

Ako pada neki drugi eval, napiši hipotezu u istom formatu za taj eval.
Ako ne pada nijedan, upiši to iskreno i uzmi prvi problem iz ručne provere.

```bash
npm run eval 2>&1 | tee docs/runs/eval-after.txt
git add -A && git commit -m "fix: <kratko>" && git tag after-fix
```

Upiši kolone „Posle izmene“ i „Status“ u `docs/EVALS.md`.

---

## Korak 6 — AI tipovi i validatori

**Kontekst:** `.github/copilot-instructions.md`, `.github/instructions/04-security.instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md`, `docs/TOOL_CONTRACT.md`, ovaj korak, `src/game/types.ts`.
**Dozvoljeni fajlovi:** `src/ai/types.ts`, `src/ai/validate.ts`, `tests/ai-validate.test.ts`.

### `src/ai/types.ts` (prepiši tačno)

```ts
import type { Direction, GameState, Point, Status } from "../game/types";

export const ALLOWED_TOOLS = ["get_game_state"] as const;
export type ToolName = (typeof ALLOWED_TOOLS)[number];
export type Detail = "summary" | "tactical";
export type ToolArgs = { detail: Detail };
export type ToolCall = { name: ToolName; args: ToolArgs };

export type SummarySnapshot = { score: number; length: number; status: Status; direction: Direction };
export type TacticalSnapshot = SummarySnapshot & {
  head: Point;
  food: Point | null;
  gridSize: number;
  danger: Record<Direction, boolean>;
};
export type GameSnapshot = SummarySnapshot | TacticalSnapshot;

export type HintAction = "up" | "down" | "left" | "right" | "keep";
export type HintResponse = { hint: string; suggestedAction: HintAction; urgency: "low" | "medium" | "high" };

export interface AiClient {
  proposeToolCall(): Promise<unknown>;
  produceHint(snapshot: GameSnapshot): Promise<unknown>;
}

export type ExecuteTool = (state: GameState, args: ToolArgs) => unknown;

export type HintFailure =
  | "invalid_tool_call" | "unsupported_tool" | "invalid_tool_output"
  | "invalid_final" | "timeout" | "provider_error";

export type HintResult =
  | { ok: true; hint: HintResponse; toolCalls: number }
  | { ok: false; reason: HintFailure; message: string; toolCalls: number };
```

### `src/ai/validate.ts` — šta mora da postoji

```ts
export function validateToolCall(input: unknown):
  | { ok: true; call: ToolCall }
  | { ok: false; reason: "invalid_tool_call" | "unsupported_tool" };
export function validateSnapshot(input: unknown, detail: Detail): boolean;
export function validateHintResponse(input: unknown):
  | { ok: true; hint: HintResponse }
  | { ok: false };
```

Redosled u `validateToolCall`: nije običan objekat → `invalid_tool_call`;
`name` nije string → `invalid_tool_call`; `name` nije u `ALLOWED_TOOLS` →
`unsupported_tool`; ključevi na vrhu nisu tačno `name` i `args` →
`invalid_tool_call`; `args` nije objekat sa tačno ključem `detail` čija je
vrednost `"summary"` ili `"tactical"` → `invalid_tool_call`. Validan poziv
vraća **nov** objekat.

`validateSnapshot`: tačno ključevi za dati `detail` (ni jedan više), tipovi
kao u `types.ts`, brojevi konačni (`Number.isFinite`).

`validateHintResponse`: tačno tri ključa; `hint` string, dužina posle `trim()`
1..160; `suggestedAction` i `urgency` iz dozvoljenih vrednosti.

### `tests/ai-validate.test.ts` (prepiši tačno)

```ts
import { describe, it, expect } from "vitest";
import { validateToolCall, validateSnapshot, validateHintResponse } from "../src/ai/validate";

describe("validateToolCall", () => {
  it("prihvata dozvoljen poziv", () => {
    expect(validateToolCall({ name: "get_game_state", args: { detail: "tactical" } })).toEqual({
      ok: true,
      call: { name: "get_game_state", args: { detail: "tactical" } },
    });
  });

  it("odbija alat van allowliste", () => {
    expect(validateToolCall({ name: "set_score", args: { value: 999 } })).toEqual({
      ok: false,
      reason: "unsupported_tool",
    });
  });

  it.each([
    ["pogrešan detail", { name: "get_game_state", args: { detail: "everything" } }],
    ["executeCode", { name: "get_game_state", args: { detail: "summary", executeCode: "..." } }],
    ["bez args", { name: "get_game_state" }],
    ["višak ključ na vrhu", { name: "get_game_state", args: { detail: "summary" }, extra: 1 }],
    ["nije objekat", "get_game_state"],
    ["name nije string", { name: 42, args: { detail: "summary" } }],
  ])("odbija: %s", (_n, input) => {
    expect(validateToolCall(input)).toEqual({ ok: false, reason: "invalid_tool_call" });
  });
});

describe("validateSnapshot", () => {
  const summary = { score: 1, length: 4, status: "running", direction: "up" };
  const tactical = {
    ...summary,
    head: { x: 1, y: 2 },
    food: null,
    gridSize: 10,
    danger: { up: false, down: true, left: false, right: false },
  };
  it("prihvata ispravne snapshot-e", () => {
    expect(validateSnapshot(summary, "summary")).toBe(true);
    expect(validateSnapshot(tactical, "tactical")).toBe(true);
  });
  it("odbija višak ključ", () => {
    expect(validateSnapshot({ ...summary, config: {} }, "summary")).toBe(false);
  });
  it("odbija pogrešan tip", () => {
    expect(validateSnapshot({ ...summary, score: "lots" }, "summary")).toBe(false);
  });
  it("odbija tactical bez danger", () => {
    const { danger: _d, ...noDanger } = tactical;
    expect(validateSnapshot(noDanger, "tactical")).toBe(false);
  });
});

describe("validateHintResponse", () => {
  const good = { hint: "Skreni gore, desno je zid.", suggestedAction: "up", urgency: "high" };
  it("prihvata ispravan odgovor", () => {
    expect(validateHintResponse(good)).toEqual({ ok: true, hint: good });
  });
  it.each([
    ["prazan hint", { ...good, hint: "   " }],
    ["predug hint", { ...good, hint: "a".repeat(161) }],
    ["nepoznata akcija", { ...good, suggestedAction: "jump" }],
    ["nepoznat urgency", { ...good, urgency: "extreme" }],
    ["višak ključ", { ...good, command: "rm -rf /" }],
    ["fali ključ", { hint: "x", suggestedAction: "up" }],
    ["nije objekat", "Skreni gore"],
  ])("odbija: %s", (_n, input) => {
    expect(validateHintResponse(input)).toEqual({ ok: false });
  });
});
```

**Izlazna komanda:** `npm run typecheck && npm test`

---

## Korak 7 — Alat `get_game_state`

**Kontekst:** `.github/copilot-instructions.md`, `.github/instructions/04-security.instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md`, `docs/TOOL_CONTRACT.md`, ovaj korak, `src/game/types.ts`, `src/ai/types.ts`.
**Dozvoljeni fajlovi:** `src/ai/tools.ts`, `tests/tool.test.ts`.

```ts
export function getGameState(state: GameState, args: ToolArgs): GameSnapshot;
```

Uvek pravi **nove** objekte (i `head`, `food`), nikad ne vraća reference iz
`state`. `danger[d]`: sledeće polje u smeru `d` je van table ili je u
`snake` bez poslednjeg dela. Ne vraća ništa što nije u `TOOL_CONTRACT.md`.

### `tests/tool.test.ts` (prepiši tačno)

```ts
import { describe, it, expect } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, startGame } from "../src/game/logic";
import { getGameState } from "../src/ai/tools";
import type { TacticalSnapshot } from "../src/ai/types";

const rng = () => 0;
const cfg = { ...DEFAULT_CONFIG, gridSize: 10 };
const state = startGame(createInitialState(cfg, rng)); // (5,5),(4,5),(3,5), hrana (0,0)

describe("getGameState", () => {
  it("summary vraća samo četiri polja", () => {
    expect(getGameState(state, { detail: "summary" })).toEqual({
      score: 0, length: 3, status: "running", direction: "right",
    });
  });

  it("tactical vraća glavu, hranu, tablu i opasnosti", () => {
    expect(getGameState(state, { detail: "tactical" })).toEqual({
      score: 0, length: 3, status: "running", direction: "right",
      head: { x: 5, y: 5 }, food: { x: 0, y: 0 }, gridSize: 10,
      danger: { up: false, down: false, left: true, right: false },
    });
  });

  it("zid se računa kao opasnost", () => {
    const atWall = { ...state, snake: [{ x: 9, y: 5 }, { x: 8, y: 5 }, { x: 7, y: 5 }] };
    const snap = getGameState(atWall, { detail: "tactical" }) as TacticalSnapshot;
    expect(snap.danger.right).toBe(true);
  });

  it("ne vraća zabranjene podatke", () => {
    const snap = getGameState(state, { detail: "tactical" });
    for (const key of ["snake", "config", "tickMs", "winScore", "startLength", "rng"]) {
      expect(Object.keys(snap)).not.toContain(key);
    }
  });

  it("read-only: mutacija snapshot-a ne menja igru", () => {
    const before = structuredClone(state);
    const snap = getGameState(state, { detail: "tactical" }) as TacticalSnapshot;
    snap.head.x = 99;
    if (snap.food) snap.food.x = 99;
    expect(state).toEqual(before);
  });
});
```

**Izlazna komanda:** `npm run typecheck && npm test`

---

## Korak 8 — Fake klijent i hint flow

**Kontekst:** `.github/copilot-instructions.md`, `.github/instructions/04-security.instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md`, `docs/TOOL_CONTRACT.md`, ovaj korak, `src/ai/types.ts`,
`src/ai/validate.ts`, `src/ai/tools.ts`.
**Dozvoljeni fajlovi:** `src/ai/fakeClient.ts`, `src/ai/hintFlow.ts`, `tests/hintFlow.test.ts`.

### `src/ai/fakeClient.ts`

```ts
export const FAKE_MODES = [
  "success", "invalid_args", "unsupported_tool", "timeout", "provider_error", "malformed_final",
] as const;
export type FakeMode = (typeof FAKE_MODES)[number];
export function createFakeClient(mode: FakeMode): AiClient & {
  calls: { proposeToolCall: number; produceHint: number };
};
```

Svaki poziv povećava odgovarajući brojač. `proposeToolCall` po modu:
- `success`, `malformed_final` → `{ name: "get_game_state", args: { detail: "tactical" } }`
- `invalid_args` → `{ name: "get_game_state", args: { detail: "everything", executeCode: "..." } }`
- `unsupported_tool` → `{ name: "set_score", args: { value: 999 } }`
- `timeout` → `new Promise(() => {})` (nikad se ne završi)
- `provider_error` → odbija se sa `new Error("fake provider down")`

`produceHint(snapshot)`:
- `malformed_final` → `{ hint: "", suggestedAction: "jump", urgency: "extreme" }`
- inače: ako snapshot ima `danger` i `danger[direction]` je `true`, vrati prvi
  smer iz `["up","down","left","right"]` gde je `danger` `false`, sa
  `urgency: "high"` i hintom `"Opasnost ispred! Skreni <smer>."`;
  inače `{ hint: "Put je slobodan, nastavi pravo.", suggestedAction: "keep", urgency: "low" }`.

### `src/ai/hintFlow.ts`

```ts
export const SAFE_MESSAGE = "AI savet trenutno nije dostupan. Igra nastavlja normalno.";
export function requestHint(deps: {
  client: AiClient;
  getState: () => GameState;
  executeTool?: ExecuteTool; // podrazumevano getGameState
  timeoutMs?: number;        // podrazumevano 5000
}): Promise<HintResult>;
```

Tačno tok iz `TOOL_CONTRACT.md`. `proposeToolCall` i `produceHint` se svaki
poziva najviše jednom i svaki je umotan u timeout (`Promise.race` sa
`setTimeout`; tajmer se čisti posle). Timeout → `timeout`; bilo koja druga
greška iz klijenta → `provider_error`. `toolCalls` je 1 samo ako je
`executeTool` stvarno pozvan. Svaki neuspeh vraća `message: SAFE_MESSAGE`.
Funkcija nikad ne baca grešku.

### `tests/hintFlow.test.ts` (prepiši tačno)

```ts
import { describe, it, expect, vi } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, startGame } from "../src/game/logic";
import { getGameState } from "../src/ai/tools";
import { createFakeClient, type FakeMode } from "../src/ai/fakeClient";
import { requestHint, SAFE_MESSAGE } from "../src/ai/hintFlow";
import type { ExecuteTool } from "../src/ai/types";

const rng = () => 0;

function setup(mode: FakeMode, execute: ExecuteTool = getGameState) {
  const state = startGame(createInitialState({ ...DEFAULT_CONFIG, gridSize: 10 }, rng));
  const client = createFakeClient(mode);
  const tool = vi.fn(execute);
  return { state, client, tool };
}

describe("requestHint — test matrix", () => {
  it("T1 validan zahtev: jedan poziv alata, validan hint", async () => {
    const { state, client, tool } = setup("success");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r.ok).toBe(true);
    expect(r.toolCalls).toBe(1);
    expect(tool).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledWith(state, { detail: "tactical" });
    expect(client.calls).toEqual({ proposeToolCall: 1, produceHint: 1 });
  });

  it("T2 nevalidni argumenti: alat nije izvršen", async () => {
    const { state, client, tool } = setup("invalid_args");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "invalid_tool_call", message: SAFE_MESSAGE, toolCalls: 0 });
    expect(tool).not.toHaveBeenCalled();
    expect(client.calls.produceHint).toBe(0);
  });

  it("T3 nepoznat alat: ništa nije izvršeno", async () => {
    const { state, client, tool } = setup("unsupported_tool");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "unsupported_tool", message: SAFE_MESSAGE, toolCalls: 0 });
    expect(tool).not.toHaveBeenCalled();
  });

  it("T4 timeout: kontrolisana greška", async () => {
    const { state, client, tool } = setup("timeout");
    const r = await requestHint({ client, getState: () => state, executeTool: tool, timeoutMs: 50 });
    expect(r).toEqual({ ok: false, reason: "timeout", message: SAFE_MESSAGE, toolCalls: 0 });
    expect(client.calls.produceHint).toBe(0);
  });

  it("T5 provider greška: kontrolisana greška", async () => {
    const { state, client, tool } = setup("provider_error");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "provider_error", message: SAFE_MESSAGE, toolCalls: 0 });
  });

  it("T6 neispravan izlaz alata: nema lažnog success-a", async () => {
    const { state, client, tool } = setup("success", () => ({ score: "lots" }));
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "invalid_tool_output", message: SAFE_MESSAGE, toolCalls: 1 });
    expect(client.calls.produceHint).toBe(0);
  });

  it("T7 neispravan finalni odgovor: UI ne dobija hint", async () => {
    const { state, client, tool } = setup("malformed_final");
    const r = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(r).toEqual({ ok: false, reason: "invalid_final", message: SAFE_MESSAGE, toolCalls: 1 });
  });

  it("T8 read-only: stanje igre je isto pre i posle", async () => {
    const { state, client } = setup("success");
    const before = structuredClone(state);
    await requestHint({ client, getState: () => state });
    expect(state).toEqual(before);
  });
});
```

**Izlazna komanda:** `npm run typecheck && npm test`

---

## Korak 9 — Dugme „Ask AI for Hint“

**Kontekst:** `.github/copilot-instructions.md`, `.github/instructions/04-security.instructions.md`, `.github/instructions/01-architecture.instructions.md`, ovaj korak, `src/main.ts`, `src/ai/hintFlow.ts`, `src/ai/fakeClient.ts`.
**Dozvoljeni fajlovi:** `src/main.ts`.

1. Pročita `?ai=` iz URL-a. Ako je vrednost u `FAKE_MODES`, koristi je; inače
   `"success"`. U `#ai-mode` upiše `AI: fake (<mode>)` (iskreno za demo).
2. Klik na `#hint-btn`: ako je status `running`, `state = togglePause(state)` i
   `draw()`. Onemogući dugme, u `#hint` upiše „Razmišljam…“, pozove
   `requestHint({ client, getState: () => state })`.
3. Uspeh → `#hint` = `` `${hint.hint} → ${hint.suggestedAction} (${hint.urgency})` ``.
   Neuspeh → `#hint` = `message`. Uvek `textContent`. Posle toga omogući dugme.
4. AI ne menja `state` ni na koji način osim pauze iz tačke 2 (to radi igra, ne AI).

**Izlazna komanda:** `npm run typecheck && npm test && npm run build`

**Ručna provera:** `/` → savet se pojavi; `/?ai=timeout` → posle 5 s bezbedna
poruka; `/?ai=unsupported_tool` → bezbedna poruka; `/?ai=bilo-sta` → radi kao `success`.

Commit: `feat: AI hint sa read-only alatom (fake klijent)`.

---

## Korak 10 — Evidence i log (radiš sama)

Pravila: `.github/instructions/03-workflow.instructions.md`.

- `docs/EVIDENCE_004.md`: nalepi izlaz `npm test` (T1–T8), screenshot uspeha i
  `?ai=timeout`, popuni kolonu „Stvarni rezultat“ u `EVALS.md`.
- `docs/AI_USAGE_LOG.md`: jedan red po koraku.
- `docs/BUILD_PROMPT_FINAL.md`: kopija V1 + šta si promenila u promptu tokom
  rada i zašto (npr. dodat kratki prompt za korake 4+).
- `README.md`: komande i gde je šta.
- Provera tajni: `git grep -i -e "sk-ant" -e "api_key="` mora biti prazno.

---

## Korak 11 — (opciono) jedan live poziv

Pravila: `.github/instructions/04-security.instructions.md`.
Samo ako je sve gore zeleno i imaš API ključ. Ključ **nikad** ne ide u
browser (Vite bi ga upisao u bundle) ni u repo. Zato je live poziv Node
skripta: `scripts/live-hint.ts`, koja napravi `AiClient` preko zvaničnog SDK-a
(`npm i -D @anthropic-ai/sdk tsx`), čita ključ iz `ANTHROPIC_API_KEY`, i
pokrene isti `requestHint` sa istim validatorima. Najviše 3 live poziva.
Ako to ne stigneš, u predaji jasno napiši: „Core put koristi lokalni fake
klijent; live provider nije testiran.“ Dokument zadatka to prihvata.
