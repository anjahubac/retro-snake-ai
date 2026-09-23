# Plan implementacije — Pixel Zmija

## Aktivna revizija — 2026-09-23

Ovaj deo zamenjuje ranije vremenske pretpostavke. Izvorni plan A/B ispod
ostaje referenca za prvobitnu implementaciju i testove; nije lista poslova
koje treba ponovo izvršiti. Aktivni zadaci R0–R4 su u
[`docs/IMPLEMENTATION_STEPS.md`](docs/IMPLEMENTATION_STEPS.md#revizija-r--aktivni-zadaci).

### R8 — plan progresije Arcade nivoa 1–10

**Status: specifikacija i plan napravljeni; progresija implementirana u R9.**
Postojeći R7 povećava prepreke samo do 12 i koristi bonus +3/60 poteza.
Ovaj plan proširuje težinu do nivoa 10. Brojevi su početni balans za probno
igranje, ne potvrda da je svaki bonus dostižan iz svake pozicije.

Novi nivo dolazi posle svakih pet običnih hrana. Bonus poeni ne utiču na nivo,
brzinu ili rast zmije. Tempo u tabeli važi za početnih 150 ms; manje je brže.
Broj prepreka je ukupan cilj, ne broj novih prepreka na tom nivou.

| Nivo | Obična hrana ukupno | Interval | Cilj prepreka | Zlatni bonus | Trajanje bonusa |
|---|---|---|---|---|---|
| 1 | 0–4 | 150 ms | 0 | Nema | — |
| 2 | 5–9 | 140 ms | 2 | Nema | — |
| 3 | 10–14 | 130 ms | 4 | +3 poena | 60 poteza |
| 4 | 15–19 | 120 ms | 6 | +3 poena | 56 poteza |
| 5 | 20–24 | 110 ms | 8 | +4 poena | 52 poteza |
| 6 | 25–29 | 100 ms | 10 | +4 poena | 48 poteza |
| 7 | 30–34 | 90 ms | 12 | +5 poena | 44 poteza |
| 8 | 35–39 | 80 ms | 14 | +5 poena | 40 poteza |
| 9 | 40–44 | 70 ms | 16 | +6 poena | 36 poteza |
| 10 | 45–49 | 60 ms | 18 | +6 poena | 32 poteza |

**Kako raste težina:** nivo 2 uvodi prepreke; nivo 3 bonus kao opcioni izazov.
Svaki naredni nivo dodaje dve prepreke i skraćuje vreme za bonus za četiri
poteza. Uz to raste brzina do nivoa 10 i zmija nastavlja da raste. Više poena
za bonus nagrađuje rizik, ali propušten bonus ne kažnjava igrača.

**Precizna pravila za implementaciju:**
- `progress = score - bonusPoints`; prikazani nivo ostaje `1 + floor(progress / 5)`.
  Parametri težine uzimaju se iz reda `min(level, 10)`. Od nivoa 11 igra se
  nastavlja sa parametrima nivoa 10; nema automatske pobede na 10. nivou.
- Za prilagođeni config interval je `max(60, config.tickMs - 10 * (min(level, 10) - 1))`.
  Brži početni config može ranije dostići minimum; ne obećavati ubrzanje posle toga.
- Prepreke zadržavaju R7 raspored, povezane prolaze, slobodan obod i udaljenost
  veću od tri polja od glave. Dopunjuju se pri običnoj hrani, nikada na zmiji,
  hrani ili bonusu. Ne premeštati postojeće prepreke.
- Cilj prepreka ograničiti brojem dozvoljenih kandidata na konkretnoj tabli.
  Na 10×10 tabli R7 raspored ima samo devet kandidata; 18 nije garantovano.
  Zauzeta ili nebezbedna polja odlažu dopunu do sledeće obične hrane. Bezbednost
  ima prednost nad brojem iz tabele. UI prikazuje stvarni broj i dostižni cilj.
- Bonus se pokušava stvoriti pri 10, 15, 20… običnih hrana, najviše jedan aktivan.
  Ako već postoji bonus, ne zamenjuje se i nema naknadno zakazanog bonusa.
  Ako nema slobodnog polja, taj pokušaj se preskače.
- Vrednost i početno trajanje bonusa beleže se pri nastanku. Prelaz nivoa ne
  menja već aktivan bonus. Uzimanje dodaje njegovu vrednost u score i bonusPoints.
  Pauza zamrzava trajanje; poslednji potez važi za uzimanje. Prsten prikazuje
  odnos preostalih poteza prema njegovom početnom trajanju, a ne uvek prema 60.
- Ostaju R7 pravila za običnu hranu, punu tablu, reset i sudare. Classic ostaje
  isti, a AI savet ostaje isključen prema ranijem planu.

**Provera balansa:** odigrati prelaze svih nivoa na 20×20, zatim proveriti
10×10 i 30×30, kao i početne intervale 60 i 400 ms. Proveriti da prepreke
ne zatvaraju prolaze, da su bonus i preostalo vreme čitljivi i da poslednji
nivoi ostaju igrivi. Po potrebi menjati ovu tabelu pre konačnog prihvatanja.

Implementacioni zadatak i kriterijumi su u `docs/IMPLEMENTATION_STEPS.md`, R9. R9 je implementiran i automatizovane provere prolaze.

### R7 — implementirano: prepreke i bonus hrana

Na zahtev korisnika implementiraju se prepreke od nivoa 2 (još dve po nivou,
do 12) i zlatni bonus od nivoa 3 (+3 poena, 60 poteza). Nivoi i tempo računaju
samo običnu hranu. Precizna pravila i bezbedno postavljanje su u GAME_SPEC R7.
Ova odluka zamenjuje ranije predloge za prepreke/bonuse ispod.

### Nalazi pregleda

- Aplikacija, game logika, testovi i AI moduli već postoje. Ranija tvrdnja da
  repo ima samo dokumentaciju više ne opisuje sadašnje stanje.
- `index.html` već prikazuje AI panel, a `src/main.ts` zahteva njegove DOM
  elemente i povezuje lokalni fake klijent. Brisanje samo HTML-a ruši startup.
- Log beleži 72 unit testa i pet eval-a pri ranijoj implementaciji. To je
  istorijski rezultat, ne novo izvršavanje tokom ove revizije. Browser provere
  i screenshot-i u evidenciji još nisu potvrđeni.
- Postojeći spec isključuje nivoe, prepreke, bonuse i čuvanje rekorda.
  Predlozi ispod prvo zahtevaju svoj specifikacioni korak; nisu odobrena
  promena postojećih pravila ili testova.

### Odluke i redosled

| Zadatak | Status / termin | Ishod |
|---|---|---|
| R0 — revizija plana i instrukcija | Ova dokumentaciona iteracija | Stvarno stanje, predlozi i izvršivi zadatak za AI panel |
| R1 — privremeno uklanjanje AI sekcije | Implementirano i provereno | AI moduli/testovi sačuvani; sekcija ostaje isključena do sledeće nedelje |
| R2 — Arcade nivoi i ubrzavanje | Specifikovano i implementirano; 85 unit testa i 5 eval-a prolaze | Classic ostaje isti; Arcade dobija nivoe, ubrzanje i pobedu na punoj tabli |
| R3 — savremeniji izgled | Implementiran; browser review čeka mogućnost pokretanja lokalnog servera | Responsivan raspored, nova paleta, izbor režima i vidljiv Arcade nivo |
| R4 — AI savet | Planiran za 28.09–04.10.2026. | Povratak postojeće fake osnove, integracija i provera |

Na korisnički ispravak, AI panel ostaje privremeno uklonjen do planiranog rada
28.09–04.10.2026. R2 i R3 su već implementirani.

### Preporuka za kompleksnost: nivo + tempo, pa prepreke

Preporučeni prvi paket je **Classic + Arcade sa nivoima i ubrzavanjem**.
Classic čuva sadašnjih +1 poen, pobedu na `winScore` i fiksni tempo. Arcade
daje vidljiv napredak i sve teži izazov uz mali početni skup novih pravila.

| Prioritet | Predlog | Doprinos igri | Obim i zavisnosti |
|---|---|---|---|
| 1 | Arcade nivoi i postepeno ubrzavanje | Svakih 5 običnih hrana novi nivo; igrač planira put pod većim pritiskom | Srednji: pravila nivoa, tempo, UI, reset i testovi |
| 2 | Unapred definisane arene sa preprekama | Put do hrane zahteva izbor rute | Veći: sudari, dostupna polja hrane, validacija mape i AI `danger` |
| 3 | Bonus hrana ograničenog trajanja | Izbor između bezbedne rute i dodatnih poena | Veći: odvojeni poeni i progres, trajanje u tick-ovima, pauza i spawn |
| 4 | Lokalni rekord po režimu | Razlog za novu partiju | Mali/srednji: adapter za localStorage, validacija i fallback pri zabrani storage-a |

Početni predlog za Arcade: nivo `1 + floor(običnaHrana / 5)`, interval
`max(70, početniTickMs - 10 * (nivo - 1))`, bez pobede na 15 poena;
igra se do sudara ili popunjene table. Brojeve tretirati kao početnu hipotezu
za balans, proveriti spor i brz početni tempo i definisati validan Arcade
opseg pre implementacije. `score` i broj pojedenih običnih hrana moraju biti
različiti pojmovi ako se kasnije dodaju bonusi.

Prepreke bih prvo uvela kao odabranu statičnu arenu na početku partije.
Tako prepreka ne može iznenada nastati na zmiji ili preseći tekuću putanju.
Treba proveriti početni slobodan koridor i povezane prolaze; dostupna hrana
ne znači garanciju da zmija nikada neće sama sebi zatvoriti put.

Bonus za kasniju iteraciju: zasebna zlatna hrana, dodatni poeni i trajanje
mereno aktivnim tick-ovima. Pauza zamrzava trajanje. R2 mora precizirati
učestalost, vrednost, rast, kolizije i slučaj bez slobodnog polja.
Portali, pokretni neprijatelji i više istovremenih power-up-ova ostaju za
kasnije: prvo treba izbalansirati tempo i arene.

### Vizuelni predlog: savremena arkada sa pixel identitetom

- **Raspored:** centrirana tabla kao glavni element; na desktopu okvir do
  približno 960 px sa kompaktnim bočnim karticama za status i kontrole.
  Na širini 360 px sve ide u jednu kolonu bez horizontalnog skrola.
- **Paleta:** skoro crna `#0B1018`, površine `#151E2B`, glavni tekst
  `#F3F7FC`, sekundarni `#A6B4C8`, mint zmija `#6EE7B7`, koralna hrana
  `#FB7185`, ljubičasti UI akcent `#A78BFA`. Boje su predlog; kontrast
  proveriti na stvarnim kombinacijama pre prihvatanja.
- **Tipografija:** sistemski sans-serif za naslove i uputstva, monospace i
  tabularne cifre za poene. Bez preuzimanja fontova ili slika.
- **Tabla:** diskretnija mreža, oštri pixel segmenti i oči koje pokazuju
  smer; zaobljen spoljašnji okvir i blaga senka daju moderan okvir igri.
  Logička mreža i `CELL = 20` ostaju odvojeni od CSS veličine i DPR bitmap-a.
- **Informacije:** sada poeni i status; nivo, progres do sledećeg nivoa i
  rekord prikazivati tek kada odgovarajuće funkcije postoje. Bez izmišljenih
  brojeva ili neaktivnih selektora režima.
- **Kontrole i stanja:** čitljive oznake tastera, jasni start/pauza/kraj
  overlay-i. Vidljiva Start/Pauza/Nova partija dugmad i touch upravljanje
  su zasebni funkcionalni predlozi, nisu deo čiste vizuelne izmene R3.
- **Pristupačnost:** vidljiv fokus, tekstualni status pored boje, DOM opis
  table, kontrast običnog teksta najmanje 4.5:1. Za buduća dugmad ciljati
  najmanje 44 × 44 CSS px kao projektni izbor. Dekorativni motion ostaviti
  za kasniju odluku; sačuvati postojeći `prefers-reduced-motion` tretman.

Osnova pristupačnosti: [W3C — kontrast teksta](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
i [W3C — veličina kontrola](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
Ovo su smernice za predlog, ne potvrda vizuelnog testa ili pune pristupačnosti.

### Granice ove revizije

Menjaju se plan, rutiranje i fazna dokumentacija. Kod aplikacije, postojeći
testovi, ugovor alata, raniji promptovi, log i sirova evidencija ostaju
istorijski izvori. Zahtev korisnika za ovu reviziju zamenjuje raniju zabranu
izmene instrukcionih fajlova za R0; ne daje narednim zadacima opštu dozvolu
za menjanje svih dokumenata. Budžet proširenja proceniti zasebno; raniji
četvoročasovni plan nije procena za novu mehaniku.

---

## Izvorni plan A/B — istorijska referenca

Pri prvom pisanju plana projekat je sadržao dokumentaciju i instrukcije,
bez aplikacije. Tvrdnje o „ovoj nedelji“, dozvoljenim izmenama i stanju
implementacije u nastavku odnose se na taj trenutak; aktivna revizija iznad
i zadaci R imaju prednost za novi rad. Spec i ugovor i dalje određuju
ponašanje igre; predlog sam po sebi ne menja njihove ugovore.

## Pregled i zaključane odluke

Napraviti malu Snake-inspired browser igru sa originalnim CSS/canvas izgledom. **DEO A** završava Week 3 / Sesiju 003 i vizuelno doterivanje za najviše četiri sata, bez AI koda ili AI dugmeta u igri. **DEO B** je zaseban posao za Week 4 / Sesiju 004, procenjen na dva sata; ne izvršava se ove nedelje.

Tehnologija: Vite + TypeScript (`strict: true`) + Vitest + Canvas 2D; ESM, npm, bez framework-a. Jedine direktne razvojne zavisnosti su `typescript`, `vite`, `vitest`. Nema produkcionih zavisnosti. Sistem ostaje bez backend-a, baze, deploy-a, naloga, leaderboard-a i spoljnih asseta/fontova.

`docs/IMPLEMENTATION_STEPS.md` ostaje izvor postojećih tipova, potpisa, testova i eval-a. U ovom planu **K0–K11** znače originalne korake iz tog dokumenta, a **Korak 1–13** znače korake ovog plana. Postojeći kod testova prepisuje se tačno; ne prepisuju se uobličeni ili „poboljšani“ ekvivalenti. Podatak o 64 prolazna testa i E4 padu odnosi se na raniju referentnu implementaciju van projekta, ne na lokalno izvršavanje. Eval-i E1–E5 su zaseban skup.

Korisnik je izričito odobrio sledeće dopune, bez menjanja postojećih ugovora:

- AI dugme i panel uvode se tek u Delu B; HTML iz K0 se u tom detalju prilagođava.
- K10 se deli na završetak A i završetak B. `BUILD_PROMPT_FINAL.md` nastaje već pri predaji A.
- Zaseban vizuelni korak dolazi **posle** tagova `baseline` i `after-fix`; obuhvata `src/render.ts`, `src/style.css`, `index.html`.
- `CELL = 20` i `render(ctx, state): void` ostaju isti. Veličina `gridSize * CELL` je logička veličina; CSS prikaz je prilagodljiv, a bitmap prati DPR.
- Tokom čekanja AI odgovora komande igre se ignorišu. Posle rezultata igra ostaje u stanju u kom je čekala; ako je prethodno pauzirana, nastavlja se tek Space-om. Dugme zadržava standardnu aktivaciju tastaturom.
- Provera tajni razlikuje dokumentovane obrasce od stvarnih credential-a; ne zahteva prazan rezultat pretrage koja pronalazi sopstvena uputstva.
- Usvojena je paleta i vizuelni pravac iz Koraka 7.

Ovo su odobrene dopune korisničkog zahteva postojećim koracima, ne dozvola za proizvoljno odstupanje. Ostali konflikti se prijavljuju. Ne menjati `.github/`, `AGENTS.md`, `GAME_SPEC.md`, `TOOL_CONTRACT.md` ili originalni `IMPLEMENTATION_STEPS.md` u toku ovog plana. Izmene evidencije i manifesta navedene ispod radi korisnik RUČNO, tek tokom izvršavanja odgovarajućeg koraka. Samo pisanje ovog plana ne menja nijedan od njih.

## Struktura foldera nakon implementacije

```text
/
├── Plan.md
├── AGENTS.md                         # postojeći, ne menja se
├── .github/                          # postojeće instrukcije, ne menjaju se
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── index.html
├── src/
│   ├── main.ts                       # DOM, tastatura, tajmer, jedna promenljiva state
│   ├── render.ts                     # canvas, CSS tokeni, DPR; bez izmene igre
│   ├── style.css
│   ├── game/
│   │   ├── types.ts
│   │   ├── config.ts
│   │   └── logic.ts                  # čiste funkcije; nema DOM-a/tajmera/Math.random
│   └── ai/                          # tek u B
│       ├── types.ts
│       ├── validate.ts
│       ├── tools.ts
│       ├── fakeClient.ts
│       └── hintFlow.ts
├── tests/
│   ├── config.test.ts
│   ├── logic.test.ts
│   ├── ai-validate.test.ts           # odavde naniže tek u B
│   ├── ai-boundary.test.ts           # novi, tačan kod u Koraku 9
│   ├── tool.test.ts
│   ├── hintFlow.test.ts
│   └── hintFlow-boundary.test.ts     # novi, tačan kod u Koraku 11
├── evals/
│   └── evals.test.ts
└── docs/
    ├── GAME_SPEC.md
    ├── IMPLEMENTATION_STEPS.md
    ├── TOOL_CONTRACT.md
    ├── BUILD_PROMPT_V1.md             # original ostaje nepromenjen
    ├── BUILD_PROMPT_FINAL.md
    ├── CONTEXT_MANIFEST.md
    ├── EVALS.md
    ├── EVIDENCE_003.md
    ├── EVIDENCE_004.md
    ├── AI_USAGE_LOG.md
    └── runs/                         # stvarni izlazi i screenshot-i, tačna imena u koracima
```

Nema `CLAUDE.md` u postojećem projektu; ukloniti netačnu referencu iz README-a pri predaji A. Ne dodavati taj fajl. `node_modules/` i `dist/` nisu predajni kod i ne ulaze u Git.

## Kriterijum → deo i korak → dokaz

Izvor: lokalni dokument „Retro AI Engineering Challenge — Sesije 003 i 004“, svih 11 strana. Tabela obuhvata završnu listu kriterijuma i obavezne detalje iz opisa sesija. Sadržaj koji je samo specificiran ne predstavlja dokaz izvršenja.

| Kriterijum | Deo / korak | Fajl i proverljiv dokaz |
|---|---|---|
| Mali scope i proverljiv DoD, zaključani pre velike implementacije | A / 1, 8 | `docs/GAME_SPEC.md`, početni commit; odvojeni DoD A/B u ovom planu |
| Spec: naziv, 3–5 rečenica, cilj/kontrole, loop, win/lose, 5–8 pravila, vizuelni minimum, van scope-a | A / 1 | Postojeći `docs/GAME_SPEC.md`, osam pravila; originalan naziv i bez preuzetih asseta |
| Prompt pre prve implementacije, svih deset zahtevanih elemenata | A / 1–4 | `docs/BUILD_PROMPT_V1.md` sačuvan u početnom commitu; konkretan broj koraka i kontekst u logu |
| Manifest: uključen/izostavljen izvor, razlog, prioritet, rizik | A / 1, 8; B / 13 | `docs/CONTEXT_MANIFEST.md`, stvarne liste po pozivu u `AI_USAGE_LOG.md` |
| Sačuvan baseline, nezamenjen finalnom verzijom | A / 5 | Tag `baseline`, hash u `EVIDENCE_003.md`, `docs/runs/baseline.png` |
| Baseline: prompt, kontekst, rezultat, start komanda/output, prvi problem, status testova | A / 5 | V1, manifest/log, `baseline-dev.txt`, `baseline-checks.txt`, `eval-baseline.txt`, `EVIDENCE_003.md` |
| Strukturisan deo: oblik, validan/nevalidan primer, runtime validacija i fallback | A / 2, 4, 8 | `src/game/config.ts`, `tests/config.test.ts`, `config-invalid.png`, `EVIDENCE_003.md` |
| Najmanje četiri eval-a, očekivanja pre pokretanja | A / 5 | Nepromenjeni E1–E5 iz K4 u `evals/evals.test.ts`; očekivanja u `docs/EVALS.md` |
| Eval pokazuje stvaran baseline problem | A / 5 | Stvarni E4 pad u `eval-baseline.txt`; ako ga nema, iskren bloker, bez podmetanja baga |
| Jedna hipoteza, signal, minimalna promena, rezultat i ograničenje | A / 6 | Sedam polja u `EVIDENCE_003.md`; `git diff baseline after-fix -- src/` |
| Isti eval-i ponovljeni posle promene | A / 6 | `eval-after.txt`, uporedna tabela u `EVALS.md`; nepromenjen eval fajl između tagova |
| TOOL_CONTRACT: purpose, caller, read-only, input, output, zabranjeni podaci, failure | B / 9, 10 | Postojeći `docs/TOOL_CONTRACT.md`, `src/ai/types.ts`, `src/ai/tools.ts` |
| Model predlaže; aplikacija proverava ime, argumente, allowlist i scope pre alata | B / 9, 11 | `validate.ts`, `hintFlow.ts`, T2/T3: `toolCalls = 0` i spy nije pozvan |
| Read-only granica stvarno testirana, uključujući mutaciju snapshot-a | B / 10, 11 | `tests/tool.test.ts`, T8, novi success test u `hintFlow-boundary.test.ts` |
| Validacija tool output-a i strukturisanog finalnog odgovora | B / 9, 11 | `validateSnapshot`, `validateHintResponse`, T6/T7 i dodatni boundary testovi |
| UI prikazuje samo validna polja ili safe error; ne izvršava savet | B / 12 | `src/main.ts`, `textContent`, ručna provera i `hint-success.png` |
| Fake/mock putanja prethodi live-u | B / 11, 13 | `createFakeClient`, bez mrežnih poziva; oznaka fake u UI-u i `EVIDENCE_004.md` |
| Matrica: validan zahtev, invalid args, unsupported, timeout/provider, malformed tool/final | B / 11, 13 | T1–T8 nepromenjeni; `ai-test-matrix.txt`, popunjeni stvarni rezultati u `EVALS.md` |
| Dokaz poslatog, broja poziva, odgovora i neizvršenih radnji | B / 11 | Spy asercije T1–T8 plus novi test tačnog snapshot-a i finalnog odgovora |
| Success, negative i failure dokaz, status/attempts | B / 11–13 | Testovi i brojači klijenta; `EVIDENCE_004.md`, `hint-success.png`, `hint-timeout.png` |
| EVIDENCE_003 sa stvarnim komandama, ograničenjem i doprinosom oba člana | A / 5, 6, 8 | Popunjen `docs/EVIDENCE_003.md`, sirovi izlazi bez doterivanja |
| EVIDENCE_004 sa ugovorom, tri putanje, finalnim JSON-om, ograničenjem i doprinosima | B / 13 | Popunjen `docs/EVIDENCE_004.md`, reference na stvarne testove i screenshot-e |
| AI_USAGE_LOG: važni pozivi, očekivanje, rezultat, sledeća odluka i potrošnja | A+B / svaki AI korak, ručni upis | `docs/AI_USAGE_LOG.md`, stvaran model/alat, kontekst; nedostupna potrošnja označena `nije dostupno` |
| Obavezna dokumentacija lako pronađena | A / 8; B / 13 | Svi dokumenti iz PDF strukture, uključujući `BUILD_PROMPT_FINAL.md`, linkovi u README-u |
| Rad u paru, zamena vozača/posmatrača i doprinos oba člana | A+B / ručne tačke u koracima | Imena i stvarni doprinosi u oba evidence dokumenta; oba člana objašnjavaju po jedan deo |
| Budžet: najviše 15 značajnih coding-agent iteracija; bez paralelnih agenata | A+B / sva izvršavanja | Devet planiranih implementacionih poziva, odvojeno evidentirano planiranje i rezerva |
| Live guardrail: 20–30 razvojnih, najviše pet demo poziva | B / 13 | Planirani live pozivi: **0**; fake je validan Core put; ne tvrditi da je live testiran |
| Bez tajni, privatnih URL-ova, nepotrebnih payload-a i osetljivih stack trace-ova | A / 1, 8; B / 12, 13 | `.gitignore`, pregled diff-a/artefakata, postupak provere tajni ispod |
| Predaja: dokumenti, kod, testovi, stvarni rezultati i čist diff | A / 8; B / 13 | Završne komande, čist `git status`, kompletni dokazni fajlovi |
| Demonstracija 6–7 minuta i ponovljiv dokaz za partnera | B / 13; A / 8 skraćena | Redosled demonstracije u završnim koracima; isti eval scenario pre/posle |
| Postupak kad problem traje oko 20 min | A+B / svaki korak | Prekid posle tri ista neuspeha ili oko 20 min; precizan bloker, bez širenja scope-a |
| Vizuelni zahtevi korisnika: tokeni, pixel izgled, HUD, overlay-i, DPR, 360 px, pristupačnost | A / 7, 8; B / 12 | CSS/canvas implementacija i ručne provere, `week3-final.png`, `week3-360.png` |

## Budžet, kontekst i pravila izvršavanja

| Koraci | Rad | Rezerva | Ukupno | AI iteracije |
|---|---:|---:|---:|---:|
| Deo A, 1–8 | 190 min | 50 min | najviše 240 min | 5 |
| Deo B, 9–13, zasebna nedelja | 110 min | 10 min | približno 120 min | 4 |

Procene uključuju proveru korisnika, upis u log i lokalni commit. Početni raniji planerski poziv i dve faze ovog planiranja evidentirati kao stvarne značajne pozive: sa devet implementacionih poziva to je 12, sa najviše tri dodatne značajne iteracije do granice 15. Ako je bilo drugih poziva, računati i njih i umanjiti rezervu. Ručni koraci ne troše AI iteraciju. Nemoj pokretati AI samo da popuni log ili napravi commit.

Jedan **AI** korak = jedan zadatak modelu i jedna završna provera; ne spajati sledeći korak u isti zadatak. Ispravke unutar istog zadatka ograničene su repo pravilom o tri pokušaja. Novi značajan prompt koji menja pristup beleži se kao nova iteracija. Nema subagenata.

**Kontekst za svaki korak:** njegova lista ispod je zatvorena lista. `AGENTS.md`, `.github/copilot-instructions.md`, `.github/00-index.instructions.md`, `docs/GAME_SPEC.md` i samo tekući korak `Plan.md` uvek su uključeni. Sekcija „Kontekst“ ispod dodaje tačno navedene izvore. Skraćenice modula znače sledeće tačne putanje:

- M1 = `.github/instructions/01-architecture.instructions.md`
- M2 = `.github/instructions/02-testing.instructions.md`
- M3 = `.github/instructions/03-workflow.instructions.md`
- M4 = `.github/instructions/04-security.instructions.md`
- M5 = `.github/instructions/05-commands.instructions.md`

Ne čitati ceo originalni plan, sve module, PDF, generički primer ili druge projekte tokom implementacije. Delove ovog plana koji sadrže zajedničke procedure (ova pravila i provera tajni) korisnik prosleđuje zajedno sa tekućim korakom kada se na njih poziva. U `CONTEXT_MANIFEST.md` se beleži ovaj izuzetak za planiranje: široko čitanje bilo je potrebno za mapiranje zahteva; nije obrazac konteksta za coding model.

Za Korake 2–4 korisnik šalje nepromenjen sadržaj V1 sa originalnim brojem K1, K2 ili K3, plus odgovarajući korak ovog plana i odobrene dopune koje ga se tiču. V1 fajl se ne prepisuje. Za ostale AI korake šalje: „Uradi samo Korak N iz Plan.md, kao dopunu originalnog Kx. Čitaj samo navedeni kontekst. Ne menjaj postojeće testove, tipove i potpise. Prvo sažmi razumevanje, plan i nejasnoće. Menjaj samo dozvoljene fajlove. Pokreni izlaznu komandu i priloži stvarni rezultat.“

Posmatrač pre svakog poziva navodi očekivani rezultat i signal provere. Korisnik RUČNO ponavlja izlaznu komandu i pravi commit. Pre commita: `git diff --check`, pregled `git diff` i `git status --short`; zatim `git add` sa **eksplicitnim fajlovima iz koraka**, bez `git add -A`. Log se dodaje svakom AI commitu; agent ga ne menja. Tagovi se nikad ne pomeraju. Ne raditi automatski reset/checkout preko nečijeg rada; sačuvati izmene i prijaviti bloker pre vraćanja na zeleno stanje.

**Provera tajni za oba završetka:** prvo `git add` samo pregledanih dozvoljenih fajlova, da pretraga uključi i novododate fajlove. Pokrenuti:

```bash
git diff --cached --check
git grep --cached -n -i -e 'sk-ant' -e 'api_key='
git ls-files --cached -- '.env' '.env.*'
git diff --cached
```

Kod `git grep`, izlaz 1 bez rezultata znači da nema poklapanja; izlaz 0 znači da postoje nalazi za pregled; izlaz veći od 1 je greška komande. Postojeći dokumentovani obrasci u instrukcijama/spec-u/planu su očekivani nalazi. Pregledati svaki nalaz; ne dodavati stvarni nalaz na slepu allowlist-u. `.env` lista mora biti prazna. Pretraga nije potpun secret scanner: RUČNO pregledati source/config, staged diff, sirove izlaze i svaki screenshot na credential-e, privatne URL-ove i osetljive poruke. Ne lepiti sumnjivu vrednost u evidence ili AI prompt. U evidence upisati samo rezultat pregleda i broj očekivanih dokumentacionih nalaza. Ovaj postupak dopunjuje neizvodljiv zahtev da literalna samopronalazeća pretraga bude prazna; ne slabi zabranu tajni.

---

# DEO A — Week 3 / Sesija 003

Završava se samostalno, bez ijedne AI funkcije u igri. Budžet: 190 minuta + 50 minuta rezerve. Posle Koraka 8 stati; ne započinjati Deo B ove nedelje.

## Korak 1 — RUČNO: priprema projekta i konteksta (originalni K0)

### Cilj
Pripremiti minimalni projekat i sačuvati specifikaciju, početni prompt i plan pre implementacije. U početnom HTML-u nema AI dugmeta ni AI panela.

### Kontekst
Zajednički kontekst; M3, M5; K0 iz `docs/IMPLEMENTATION_STEPS.md`; `README.md`, `docs/BUILD_PROMPT_V1.md`, `docs/CONTEXT_MANIFEST.md`, `docs/AI_USAGE_LOG.md`. Nema drugih modula.

### Dozvoljeni fajlovi
RUČNO: `.gitignore`, `package.json`, `package-lock.json`, `tsconfig.json`, `index.html`, `src/style.css`, `src/main.ts`, `docs/CONTEXT_MANIFEST.md`, `docs/AI_USAGE_LOG.md`. Git inicijalizacija je dozvoljena ručna operacija. Postojeći neizmenjeni dokumenti, instrukcije i `Plan.md` ulaze u početni commit.

### Šta tačno da uradi
1. Proveri radni folder, `node --version`, `npm --version`, `git --version`. Ako Git već postoji, pregledaj status i sačuvaj tuđe izmene. Ako ne postoji, `git init`. Ne kopirati referentnu implementaciju.
2. Iz K0 preuzmi `package.json` skripte, `type: module`, kompletan `tsconfig.json` i `.gitignore`. Jedine direktne zavisnosti instaliraj RUČNO: `npm init -y`, zatim `npm i -D typescript vite vitest`. Ovo su već odobrene tehnologije, ne dodatni paketi. Sačuvaj lockfile; kasnije ne pokretati update niti dodavati SDK, linter, DOM emulator ili canvas paket.
3. Pre instalacije proveri kompatibilnost izabranih paketa sa Node verzijom. Vite dokumentacija navodi najmanje 20.19+ ili 22.12+; ne tumači repo „20+“ kao bilo koju verziju 20. Zabeleži stvarne instalirane verzije kroz `npm ls --depth=0`, bez izmišljanja ili unapred tvrdog pinovanja neproverenih verzija.
4. Napravi `src/game`, `tests`, `evals`, `docs/runs`; `src/ai` još nije potreban. `src/main.ts` privremeno sadrži samo `export {};`.
5. Preuzmi K0 HTML/CSS, ali **izostavi** red sa `hint-btn`/`ai-mode` i red `hint`. Zadrži `lang="sr"`, viewport, `score`, `status`, `config-error`, `board`, stylesheet i module script. Time nema nepovezanog dugmeta u A.
6. U manifest RUČNO dodaj red za `Plan.md`: uključen samo tekući korak i potrebne zajedničke procedure; razlog odobrene dopune; prioritet korisničkih odluka nad dopunjenim delovima starih koraka; rizik čitanja budućih koraka. Evidentiraj razliku između širokog planerskog konteksta i uskog implementacionog konteksta. Ne prepravljaj postojeće ugovore.
7. U log dodaj stvarne planerske pozive, bez menjanja ranijeg zapisa. Dodaj kolone „Potrošnja (tokeni/trošak ako prikazani)“ i „Trajanje“; ako podaci nisu prikazani, napiši `nije dostupno`. Ne izmišljaj naziv modela: zapiši ono što UI zaista prikazuje.

### Testovi
Nema novih testova; još nema funkcionalne aplikacije. Ne pokretati `npm test` da bi odsustvo testova bilo lažno prikazano kao uspeh.

### Izlazna komanda
```bash
npm run typecheck && npm ls --depth=0
```
Obe komande moraju uspeti; sačuvaj stvarne verzije u logu.

### Ručna provera
- [ ] Spec, V1, manifest i ovaj plan postoje pre prvog build poziva.
- [ ] Samo tri odobrene direktne razvojne zavisnosti; postoji lockfile.
- [ ] U HTML-u nema `hint-btn`, `hint` ili `ai-mode`.
- [ ] `.env`, `.env.*`, `node_modules`, `dist` su ignorisani.
- [ ] Par određuje vozača i posmatrača za prvi blok.

### Šta NE sme da radi u tom koraku
Bez logike igre, AI modula, eval pokretanja, novih biblioteka, izmena `.github/` ili originalnih spec/test dokumenata. Nema push-a.

### Procena vremena
15 minuta RUČNO, uključujući početni commit. Problemi okruženja koriste rezervu A.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO upiši planerske pozive, kontekst, odobrene odluke i stvarni ishod setup-a. Setup nije nova AI iteracija. Commit: `chore: priprema projekta i dokumentacije`. Eksplicitno dodaj početne dokumente, `.github` fajlove i dozvoljene setup fajlove; proveri da nema generisanih direktorijuma.

## Korak 2 — Tipovi i GameConfig validacija (originalni K1, AI iteracija A1)

### Cilj
Uvesti nepromenjene game tipove i proveru nepouzdanog config ulaza u runtime-u. Nevalidan ulaz daje sve greške i `DEFAULT_CONFIG`.

### Kontekst
Zajednički kontekst; M1, M2; K1 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/BUILD_PROMPT_V1.md`, `package.json`, `tsconfig.json`. Ako već postoje, čitati samo fajlove iz dozvoljene liste.

### Dozvoljeni fajlovi
AI: `src/game/types.ts`, `src/game/config.ts`, `tests/config.test.ts`. RUČNO posle provere: `docs/AI_USAGE_LOG.md`.

### Šta tačno da uradi
1. `types.ts` prepiši tačno iz K1: `Point`, `Direction`, `Status`, `Rng`, `GameConfig`, `GameState`; bez dodatnih polja ili `readonly` promena javnih tipova.
2. Implementiraj tačne potpise `DEFAULT_CONFIG: GameConfig`, `validateConfig(input: unknown)` sa postojećom diskriminisanom unijom, i `loadConfig(input: unknown): { config: GameConfig; errors: string[] }`.
3. Podrazumevane vrednosti su `{ gridSize: 20, tickMs: 150, startLength: 3, winScore: 15 }`. Opsezi redom: 10–30, 60–400, 2–5, 1–50; svi brojevi celi.
4. Prihvataj samo običan objekat, bez `null` i nizova. Za svaki očekivani ključ proveri sopstveno polje i vrednost. Sakupi sve greške u redosledu četiri definisana ključa, zatim višak ključeva; ne prekidaj posle prve greške.
5. Validan ulaz daje nov objekat sa tačno četiri polja. Nevalidan `loadConfig` vraća `DEFAULT_CONFIG` i greške. Poruke su kratke na srpskom; ne prikazuju originalni payload.

### Testovi
Prepiši **ceo** `tests/config.test.ts` iz K1 tačno. Ne dodavati novi test fajl u ovom koraku i ne menjati očekivanja.

### Izlazna komanda
```bash
npm run typecheck && npm test
```

### Ručna provera
- [ ] Diff sadrži samo tri AI fajla i ručni log.
- [ ] `strict` ostaje uključen; nema `any`, `@ts-ignore` ili isključivanja testova radi prolaza.

### Šta NE sme da radi u tom koraku
Bez DOM-a, canvas-a, game loop-a, AI tipova, novih paketa i promene postojećih ugovora.

### Procena vremena
15 minuta, uključujući ponovnu proveru korisnika i commit.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: faza `A1 / K1`, stvarni model, tačan kontekst, očekivanje runtime odbijanja, rezultat komande, dostupna potrošnja i trajanje bez privatnog chain-of-thought-a, sledeći Korak 3. Commit: `feat: validacija konfiguracije igre`.

## Korak 3 — Čista logika igre (originalni K2, AI iteracija A2)

### Cilj
Implementirati sva pravila igre u čistim funkcijama prema K2. Dobiti osnovnu implementaciju za stvarni baseline i kasniju ciljanu popravku.

### Kontekst
Zajednički kontekst; M1, M2; K2 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/BUILD_PROMPT_V1.md`, `src/game/types.ts`, `src/game/config.ts`, `tests/config.test.ts`. Ako postoje: `src/game/logic.ts`, `tests/logic.test.ts`.

### Dozvoljeni fajlovi
AI: `src/game/logic.ts`, `tests/logic.test.ts`. RUČNO: `docs/AI_USAGE_LOG.md`.

### Šta tačno da uradi
1. Zadrži potpise K2: `spawnFood(snake: Point[], gridSize: number, rng: Rng): Point | null`, `createInitialState(config: GameConfig, rng: Rng): GameState`, `startGame(state: GameState): GameState`, `togglePause(state: GameState): GameState`, `changeDirection(state: GameState, dir: Direction): GameState`, `tick(state: GameState, rng: Rng): GameState`, `handleSpace(state: GameState, rng: Rng): GameState`.
2. `spawnFood`: slobodna polja redom y pa x; indeks `Math.floor(rng() * free.length)`; puna tabla daje `null`. RNG je parametar, nikad globalna slučajnost.
3. Početak: glava u `floor(gridSize / 2)`, telo ulevo, smer `right`, score 0, status `ready`. Kreiraj nove tačke.
4. Status prelazi i `changeDirection` tačno po K2. U ovoj osnovnoj verziji suprotnost se proverava prema `state.direction`. Ne čitaj buduću hipotezu niti preventivno dodaj novu kontrolu ulaza. Ne ubacuj poseban kod da bi test padao.
5. `tick`: prvo status; zatim nova glava; zid; da li jede; provera tela (rep izuzet samo kada ne jede); novo telo i score; pobeda; po potrebi nova hrana. Pri gubitku zmija ostaje na tabli. Ne mutirati ulaz, niz zmije ili tačke.
6. `handleSpace`: ready→running, running↔paused, over/won→nova partija u `ready`. Za novu partiju je potreban sledeći Space za start; ne preskakati `ready`.

### Testovi
Prepiši ceo `tests/logic.test.ts` iz K2 tačno. Svi prethodni testovi se ponovo izvršavaju. Bez novih testova u ovom koraku.

### Izlazna komanda
```bash
npm run typecheck && npm test
```

### Ručna provera
- [ ] `src/game/` nema DOM, `window`, `Date`, tajmere, `Math.random` ili AI import-e.
- [ ] Nema mutacije argumenata ili deljenog promenljivog stanja.
- [ ] Na kraju bloka zameniti vozača i posmatrača pre rada na prikazu.

### Šta NE sme da radi u tom koraku
Bez izmene tipova, K5 popravke unapred, command queue-a, tastature, renderovanja ili namernog kvarenja implementacije radi E4.

### Procena vremena
25 minuta, uključujući provere i commit.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `A2 / K2`, očekivana pravila i signal postojeće test suite, stvarni broj testova/rezultat, kontekst i potrošnja. Commit: `feat: cista logika zmije`.

## Korak 4 — Canvas, tastatura i osnovni HUD (originalni K3, AI iteracija A3)

### Cilj
Povezati postojeću čistu logiku u igrivu browser aplikaciju. Napraviti osnovni prikaz i ručno proveriti pravila bez AI funkcije.

### Kontekst
Zajednički kontekst; M1, M4 (deo o bezbednom DOM prikazu); K3 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/BUILD_PROMPT_V1.md`, `index.html`, `src/style.css`, `src/main.ts`, `src/game/types.ts`, `src/game/config.ts`, `src/game/logic.ts`.

### Dozvoljeni fajlovi
AI: `src/render.ts`, `src/main.ts`. RUČNO: `docs/AI_USAGE_LOG.md`.

### Šta tačno da uradi
1. Renderer za baseline: `export const CELL = 20; export function render(ctx: CanvasRenderingContext2D, state: GameState): void;`. Boje i kvadrati `CELL - 1` tačno kao K3; vizuelno doterivanje još ne radi.
2. DOM elemente pronađi i proveri odgovarajućim DOM tipom; nedostajući canvas/context tretiraj kao inicijalizacionu grešku, bez nastavka sa `null` referencom. Ne uvodi novi ekran igre ili promenu status unije.
3. `?config=` učitaj preko `URLSearchParams`. Odsustvo parametra koristi `DEFAULT_CONFIG`. Prisutan prazan ili neispravan JSON kroz `try/catch` daje `loadConfig("invalid-json")`. Svaki parsirani ulaz ide kroz `loadConfig`.
4. Greške prikaži u `#config-error`: tačan prefiks iz K3 + poruke spojene sa `; `; skini `hidden`, koristi `textContent`. Nikad ne ubacuj URL sadržaj kroz `innerHTML`.
5. Canvas logički `width = height = config.gridSize * CELL`. Jedina promenljiva autoritativnog stanja: `let state = createInitialState(config, Math.random)` u `main.ts`.
6. Jedan `keydown` handler: strelice i W/A/S/D (oba registra slova) mapiraju na četiri smera; Space na `handleSpace`; samo obrađenim komandama pozovi `preventDefault()`. Ignoriši ponovljeni `keydown` za Space (`event.repeat`) da držanje tastera ne menja pauzu više puta. Neprepoznate tastere ostavi browseru.
7. Posle komande pozovi `draw()`. Jedan `setInterval` sa `config.tickMs`: dodeli rezultat `tick(state, Math.random)`, pa `draw()`. Nema dodatne animacione petlje, ubrzavanja, akumulacije propuštenih tick-ova ili novih game događaja.
8. `draw()` poziva renderer i koristi tačne tekstove K3 za `#score` i `#status`. `textContent` dodeli samo ako se nova vrednost razlikuje od postojeće, da kasniji live region ne najavljuje isti status pri svakom tick-u. Nema AI importa, čitanja `?ai=`, pristupa nepostojećem AI dugmetu ili mrežnog poziva.

### Testovi
Nema novih automatizovanih testova niti DOM zavisnosti. Postojeći `config.test.ts` i `logic.test.ts` ostaju nepromenjeni; prikaz se proverava build-om i sledećom ručnom listom.

### Izlazna komanda
```bash
npm run typecheck && npm test && npm run build
```

### Ručna provera
RUČNO pokreni `npm run dev` i otvori adresu koju ispiše:
- [ ] Space startuje; glava se pomera desno za jedno polje.
- [ ] Strelice/WASD rade, neposredni suprotan smer se ignoriše.
- [ ] Hrana dodaje jedan poen i segment; nova hrana nije na zmiji.
- [ ] Zid i telo završavaju partiju; zmija ne izlazi van table.
- [ ] Space pauzira/nastavlja; posle kraja prvi Space resetuje u ready.
- [ ] `?config={"gridSize":12,"tickMs":120,"startLength":3,"winScore":2}` daje pobedu posle dve hrane.
- [ ] `?config={"gridSize":-5}` i `?config=%7B` prikazuju poruku i funkcionalni default.
- [ ] Bez config parametra nema poruke o grešci.
- [ ] Nema AI dugmeta, AI panela ili konzolne greške zbog njihovog odsustva.

### Šta NE sme da radi u tom koraku
Ne menjati `src/game/`, HTML, CSS ili postojeće testove. Bez vizuelnog redizajna, AI koda, dodatnih kontrola ili baseline popravke unapred.

### Procena vremena
25 minuta, uključujući ručnu proveru i commit.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `A3 / K3`, stvarni build/test izlaz, prolaz ili neuspeh svake ručne provere, tačan kontekst i sledeća odluka baseline. Commit: `feat: osnovna igriva canvas verzija`.

## Korak 5 — RUČNO: baseline i E1–E5 (originalni K4)

### Cilj
Sačuvati stvarnu početnu verziju i isti eval skup za poređenje. Zabeležiti stvaran problem bez menjanja koda.

### Kontekst
Zajednički kontekst; M3, M2, M5; K4 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/BUILD_PROMPT_V1.md`, `docs/CONTEXT_MANIFEST.md`, `docs/EVALS.md`, `docs/EVIDENCE_003.md`, `docs/AI_USAGE_LOG.md`, `src/game/types.ts`, `src/game/config.ts`, `src/game/logic.ts`.

### Dozvoljeni fajlovi
RUČNO: `evals/evals.test.ts`, `docs/EVALS.md`, `docs/EVIDENCE_003.md`, `docs/AI_USAGE_LOG.md`, `docs/runs/baseline-checks.txt`, `docs/runs/baseline-dev.txt`, `docs/runs/eval-baseline.txt`, `docs/runs/baseline.png`.

### Šta tačno da uradi
1. Proveri da očekivanja E1–E5 već postoje u `EVALS.md`. Prepiši kompletan eval kod K4 tačno u `evals/evals.test.ts`.
2. Pokreni izlaznu komandu ispod; sačuvaj stvarni izlaz. Posmatrač proverava testove i diff, pa napravi baseline commit i tag **pre popravke**.
3. `git tag baseline` kreira tag samo ako ne postoji. Ako postoji, stani i proveri čemu pripada; ne koristi `-f`. Zabeleži `git rev-parse baseline`.
4. Pokreni `bash -o pipefail -c 'npm run eval 2>&1 | tee docs/runs/eval-baseline.txt'`. Očekivani E4 pad daje nenulti kod; to je eksperimentalni rezultat, ne komanda koju treba nasilno učiniti zelenom. `pipefail` sprečava da uspešan `tee` sakrije neuspešan eval.
5. Proveri da E1, E2, E3, E5 prolaze i da E4 pokazuje konkretan problem dvostrukog pritiska. Ako izlaz odstupa, zabeleži stvarni rezultat. Ako E4 prolazi i nema drugog stvarnog problema, ne ubacuj bag i ne menjaj postojeći eval; prijavi bloker za izbor nove hipoteze i čekaj odluku.
6. Pokreni `npm run dev`, sačuvaj njegov stvarni startup izlaz u `baseline-dev.txt` kopiranjem iz terminala bez uređivanja sadržaja; browser screenshot početne igre u `baseline.png`. Zaustavi server Ctrl-C kad završiš proveru.
7. Popuni baseline sekciju evidence-a: tačan V1/K1–K3, kontekst svakog poziva, tag/hash, komande, status testova, prvi problem, putanje dokaznih fajlova. Popuni samo stvarno izvršene kolone `EVALS.md`.

### Testovi
Tačan postojeći K4 `evals/evals.test.ts`; ne dodavati, menjati ili preskakati E1–E5. Početni unit testovi moraju biti zeleni; očekivani neuspeh se odnosi na eval E4.

### Izlazna komanda
Ova komanda mora proći; eval se zasebno beleži sa stvarnim statusom kako je gore opisano. `pipefail` obuhvata celu cev i ne zavisi od aktivnog shell-a:
```bash
bash -o pipefail -c '(npm run typecheck && npm test) 2>&1 | tee docs/runs/baseline-checks.txt'
```

### Ručna provera
- [ ] Tag pokazuje kod pre ciljane popravke.
- [ ] Sirovi izlazi nisu ručno doterani; screenshot je stvaran.
- [ ] Stvarni unit rezultati odvojeni su od eval rezultata.
- [ ] Prvi problem i očekivanje poklapaju se sa izlazom.
- [ ] Partner može ponoviti isti eval scenario; pre narednog bloka zameniti uloge.

### Šta NE sme da radi u tom koraku
Ne popravljati kod, eval, očekivanja ili testove. Ne pokretati novi AI poziv samo radi obrade izlaza. Ne pomerati baseline tag niti tvrditi da je ceo eval zelen.

### Procena vremena
15 minuta RUČNO, uključujući evidenciju i dva commita.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
Nema nove AI iteracije; dopuni odluku posle A3 stvarnim baseline ishodom. Prvi commit: `test: sacuvana baseline igra i eval skup`, zatim `git tag baseline`. Drugi commit sa rezultatima: `docs: baseline eval rezultati`. Screenshot i logovi ulaze u drugi commit; baseline kod ostaje nepromenjen.

## Korak 6 — Jedna hipoteza i jedna promena (originalni K5, AI iteracija A4)

### Cilj
Popraviti samo stvarno potvrđen E4 problem i proveriti istim eval-ima da promena deluje. Sačuvati granicu između ove promene i kasnijeg vizuelnog rada.

### Kontekst
Zajednički kontekst; M3, M2; K5 iz `docs/IMPLEMENTATION_STEPS.md`; `src/game/logic.ts`, `src/game/types.ts`, `src/game/config.ts`, `tests/logic.test.ts`, `evals/evals.test.ts`, `docs/EVIDENCE_003.md`, `docs/runs/eval-baseline.txt`.

### Dozvoljeni fajlovi
AI: **samo** `src/game/logic.ts`. RUČNO: `docs/EVIDENCE_003.md`, `docs/EVALS.md`, `docs/AI_USAGE_LOG.md`, `docs/runs/eval-after.txt`, `docs/runs/after-fix-diff.txt`.

### Šta tačno da uradi
1. RUČNO pre poziva popuni prvih pet polja hipoteze iz K5 prema stvarnom E4 padu: tvrdnja, signal, hipoteza, najmanja promena, provera. Ako E4 nije potvrđen, ne izvršavati ovu popravku po automatizmu.
2. AI menja samo proveru suprotnosti u `changeDirection`: smer poslednjeg fizičkog pomeranja izvedi iz glave i vrata (`snake[0] - snake[1]`): x=1→right, x=-1→left, y=1→down, y=-1→up. Za nedostajući ili neodrediv vrat zadrži `state.direction` kao fallback. Ne dodavati polje u `GameState`.
3. Ako je traženi smer suprotan fizičkom smeru, vrati postojeći `state`; inače zadrži ostatak ponašanja K2. Status pravila ostaju ista.
4. Posle provere RUČNO sačuvaj `npm run eval` preko `bash -o pipefail -c 'npm run eval 2>&1 | tee docs/runs/eval-after.txt'`. Popuni rezultat i ograničenje, kolone „Posle izmene“ i „Status“.
5. Precizno ograničenje: odbija se smer koji vodi nazad u vrat; nema reda komandi, a druga dozvoljena komanda unutar tick-a i dalje može zameniti ranije zadati smer. Ne tvrditi da se svaki drugi pritisak odbacuje.
6. RUČNO pregled i commit, zatim `git tag after-fix` bez `-f`. Pročitaj `git rev-parse after-fix` i tek tada dopuni hash u evidence-u; commit ne treba da sadrži sopstveni budući hash. Sačuvaj `git diff baseline after-fix -- src/` u `after-fix-diff.txt`; diff sme menjati samo ciljanu logiku. Dokazni diff i hash zatim ulaze u mali dokumentacioni commit.

### Testovi
Svi postojeći testovi + isti E1–E5; nema novih testova niti izmene postojećih fajlova testova. `git diff baseline after-fix -- tests/ evals/ src/game/types.ts` mora biti prazan.

### Izlazna komanda
```bash
npm run typecheck && npm test && npm run eval
```

### Ručna provera
- [ ] U igri koja ide desno, brz gore→levo više ne vodi u vrat.
- [ ] Normalan okret za 90° i kretanje i dalje rade.
- [ ] E4 i ostali eval-i prolaze na ovom stvarnom izvršavanju.
- [ ] Između tagova nema vizuelnih promena, izmene šeme, prompta ili testova.

### Šta NE sme da radi u tom koraku
Bez vizuelnih izmena, input queue-a, prepravke spec-a, testova, tipova ili drugih game funkcija. Ne pripisivati ovoj promeni poboljšanja koja nisu merena.

### Procena vremena
20 minuta, uključujući hipotezu, proveru, tag i evidenciju.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `A4 / K5`, konkretna hipoteza, signal E4, tačan kontekst, rezultat istih eval-a, ograničenje i sledeća odluka vizuelni rad. Commit: `fix: zabrana okreta u vrat pri brzom unosu`, tag `after-fix`. Zatim dokazni hash/diff commit: `docs: dokaz ciljane E4 popravke`.

## Korak 7 — Originalan pixel izgled i pristupačnost (dopuna K3, AI iteracija A5)

### Cilj
Dobiti doteranu, čitljivu igru koja radi na 360 px i retina ekranima. Sačuvati sva pravila, state i javni renderer potpis.

### Kontekst
Zajednički kontekst; M1, M4 (bezbedan DOM prikaz); K3 iz `docs/IMPLEMENTATION_STEPS.md` samo kao referenca postojećeg renderer API-ja; `src/render.ts`, `src/style.css`, `index.html`, `src/main.ts`, `src/game/types.ts`. Nema čitanja ili izmene AI sloja.

### Dozvoljeni fajlovi
AI: `src/render.ts`, `src/style.css`, `index.html`. RUČNO: `docs/AI_USAGE_LOG.md`. Screenshot-i se prikupljaju u Koraku 8.

### Šta tačno da uradi
1. **Jedan izvor boja.** U `:root` u `style.css` definiši sledeće CSS promenljive. Nijedan hex/RGB literal za boje ne duplirati u TypeScript-u:

   | Token | Vrednost | Uloga |
   |---|---|---|
   | `--page-bg` | `#0B1210` | stranica |
   | `--panel-bg` | `#15251E` | HUD, overlay, budući hint panel |
   | `--board-bg` | `#101E18` | tabla |
   | `--grid` | `#20382A` | mreža/dekorativni okvir |
   | `--text` | `#EDF7E9` | glavni tekst, oči |
   | `--text-muted` | `#A5BCAA` | pomoćni tekst i kontrole |
   | `--accent` | `#F5CC74` | naslovni detalj, fokus |
   | `--snake-head` | `#2E9B62` | glava |
   | `--snake-body` | `#62D98B` | prvi segment tela |
   | `--snake-tail` | `#ACEDA8` | poslednji segment |
   | `--food` | `#FF6B7A` | crvena hrana |
   | `--success` | `#8EE6AB` | pobeda i budući validan savet |
   | `--error` | `#FF8F9C` | greška konfiguracije i budući safe error |

2. **HTML i raspored.** Zadrži postojeće ID-eve. Naslov `Pixel Zmija`, kratak podnaslov `Sakupi hranu. Izbegni zidove.`; HUD iznad table sa poenima i `#status`; postojeći `#config-error` odmah ispod HUD-a. Canvas postavi u `div id="board-frame"`. Ispod dodaj statički tekst sa `id="controls"`: `Strelice / W A S D — smer · Space — start, pauza, nastavak`. Poseban red: `Posle kraja: Space za novu partiju, zatim Space za start.` Bez dugmadi za start/reset/touch i bez AI elemenata.
3. Canvas dobija `role="img"`, `aria-label="Tabla igre Pixel Zmija"`, `aria-describedby="status controls"` i fallback tekst `Za igru je potreban browser sa podrškom za canvas. Kontrole su opisane ispod table.` `#status` dobija `role="status"`, `aria-live="polite"`, `aria-atomic="true"`. Ne postavljati live region na celu tablu/poene i ne tvrditi da je time cela igra potpuno igriva čitačem ekrana.
4. **CSS mere.** Globalni `box-sizing: border-box`; body margin 0; `main` width 100%, max-width 704px, margin-inline auto, padding 24px 16px. Na širini do 480px padding 16px 12px. Font `ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace`; osnovni tekst 16px/1.5; naslov 32px/1.15, na maloj širini 28px. Razmaci: 8, 12, 16, 24px. HUD `display:flex`, `flex-wrap:wrap`, gap 8px 16px; poeni 24px i `font-variant-numeric: tabular-nums`.
5. `#board-frame`: flex centriranje, padding 8px, 1px dekorativni okvir `--grid`, pozadina `--panel-bg`, `min-width:0`. Canvas `display:block`, `max-width:100%`, `height:auto`, `aspect-ratio:1`, `image-rendering:pixelated`, bez CSS border-a i padding-a na samom canvas-u. Poruke `overflow-wrap:anywhere`. Ne koristiti `overflow-x:hidden` da sakrije neispravan raspored. Ne dozvoli da drugo CSS pravilo poništi `[hidden]`; eksplicitno `[hidden] { display: none !important; }`.
6. **DPR i dimenzije ostaju u rendereru.** Zadrži `CELL = 20` i postojeći `render(ctx, state): void`. Pri svakom crtanju postavi CSS željenu širinu canvas-a na `gridSize * CELL` px; CSS max-width je smanjuje. Iz `getBoundingClientRect().width` pročitaj stvarnu CSS ivicu. Za pozitivnu ivicu izračunaj `pixelEdge = max(1, round(cssEdge * (window.devicePixelRatio || 1)))`; width i height bitmap-a menjaj samo ako se razlikuju. Ako ivica trenutno nije pozitivna, preskoči crtanje. Logički koordinatni prostor ostaje `gridSize * CELL`.
7. Posle moguće promene bitmap-a postavi **apsolutni** `ctx.setTransform(pixelEdge / logicalEdge, 0, 0, pixelEdge / logicalEdge, 0, 0)` i `ctx.imageSmoothingEnabled = false`. Ne kumulirati `scale()` između frame-ova. Za kvadratne detalje zaokruži ivice na fizičke piksele: lokalna pomoćna funkcija koristi `round(logicalCoordinate * scale) / scale`. Pozadinu uvek popuni preko cele logičke table. Ne menjati `main.ts`; postojeći draw svakog tick-a proverava veličinu i DPR i u ready/paused stanju, bez novog `resize` listener-a ili observer-a.
8. Jednim `getComputedStyle(document.documentElement)` po renderu pročitaj potrebne tokene i trimuj ih. Pomoćne funkcije za čitanje boja, pravougaonike, telo i oči ostaju privatne u `render.ts`. Renderer može čitati DOM radi dimenzija/tokena, ali ne menja igru i ne importuje `main.ts`, AI ili game logiku. Gradijent tela dobija se numeričkom interpolacijom dve pročitane hex boje, bez treće kopije palete.
9. **Redosled crtanja:** pozadina → mreža → hrana → telo od repa ka vratu → glava/oči → overlay ako status nije running. Mreža: linije na granicama ćelija bojom `--grid`, debljine jednog fizičkog piksela; koristiti tanke popunjene pravougaonike sa poravnatim ivicama.
10. **Zmija:** svaka ćelija ima blok na `(x*20+1, y*20+1)` veličine 18×18 logičkih px. Telo interpolira `--snake-body` kod vrata do `--snake-tail` kod repa; za indeks `i` od 1 do `length-1` faktor je `(i-1)/max(1,length-2)`. Glava je `--snake-head`. Oči su dva svetla kvadrata 3×3 px sa tamnom zenicom 1×1 px u smeru kretanja. Za smer right gornji levi uglovi očiju unutar ćelije su `(13,4)` i `(13,13)`, zenice `(15,5)` i `(15,14)`. Za down rotiraj raspored za 90°, left 180°, up 270° oko centra ćelije; sve ostaje unutar glave. Koristi `--text` za oči i `--board-bg` za zenice. Smer očiju je postojeći `state.direction`.
11. **Hrana:** stepenasti romb u `--food`, bez animacije: pravougaonici unutar ćelije `(8,3,4,3)`, `(5,6,10,3)`, `(3,9,14,3)`, `(5,12,10,3)`, `(8,15,4,2)`. Ovaj oblik je različit od tela čak i bez razlikovanja boja. Hrana `null` se ne crta.
12. **Četiri overlay-a:** centralni neprozirni panel u `--panel-bg`, širine `min(300, logicalEdge-24)`, visine 104 px, sa okvirom 2 px u `--accent` (won koristi `--success`, over `--error`). Naslov 20px bold monospace; dve linije uputstva 12px. Centriranje preko `textAlign="center"`; `save()/restore()` oko lokalnih text/overlay podešavanja. Tačni tekstovi:

   | Status | Naslov | Linija 1 | Linija 2 |
   |---|---|---|---|
   | ready | `SPREMNI?` | `Pritisni Space` | `Strelice / W A S D` |
   | paused | `PAUZA` | `Space za nastavak` | `Partija je zaustavljena` |
   | over | `KRAJ IGRE` | `Space za novu partiju` | `Zatim Space za start` |
   | won | `POBEDA!` | `Space za novu partiju` | `Zatim Space za start` |

   Za najmanju logičku tablu, po potrebi prelom druge linije ili smanji font na 11px ako `measureText` prelazi panel width−16; ne dozvoli odsečen tekst. DOM status K3 ostaje nepromenjen i vidljiv.
13. **Pristupačnost:** svi obični tekstovi moraju imati kontrast najmanje 4.5:1. Predložene tekstualne boje na `--panel-bg` izračunate su na najmanje 7.35:1; ponovo proveri stvarne kombinacije, bez prozirnosti na tekstu. `--grid` je samo dekoracija, ne tekst ili indikator stanja. Definiši `button:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }` za dugme koje stiže u B. Bez treperenja, scanline efekata ili dekorativne animacije. Dodaj `@media (prefers-reduced-motion: reduce)` pravila koja ukidaju dekorativne animacije/tranzicije i postavljaju `scroll-behavior:auto`; postojeće kretanje po tick-u ostaje jedina animacija.

### Testovi
Nema novih automatizovanih vizuelnih testova i nema novih zavisnosti. Postojeći testovi i E1–E5 moraju ostati zeleni. Ručna provera stvarnog canvas-a je dokaz izgleda; build nije zamena za nju.

### Izlazna komanda
```bash
npm run typecheck && npm test && npm run eval && npm run build
```

### Ručna provera
- [ ] Na viewport-u 360px nema horizontalnog skrola; `document.documentElement.scrollWidth <= window.innerWidth` je true.
- [ ] Proveriti gridSize 10, 20 i 30; sve tri table su kvadratne i staju u raspored.
- [ ] Proveriti DPR 1 i 2 kroz DevTools, kao i stvarni retina ekran ako je dostupan; bitmap dimenzija prati prikazanu širinu×DPR.
- [ ] Posle sužavanja/proširivanja prozora prikaz se osveži bez gomilanja scale-a, promenjene brzine ili reseta stanja.
- [ ] Oči su ispravne u sva četiri smera, glava tamnija, prelaz tela blag, hrana se razlikuje oblikom.
- [ ] Ready/paused/over/won overlay-i su nacrtani na canvas-u i čitljivi i na gridSize 10. Won se proverava config-om sa `winScore:1`, igranjem bez debug prečice.
- [ ] HUD, greška config-a i kontrole su čitljivi; tekst ne preliva okvir.
- [ ] Emulacija reduced motion ne uvodi dekorativno kretanje; screen reader dobija status i opis kontrola.
- [ ] Nema AI dugmeta, spoljnih asseta, font zahteva ili promena u `src/game/` i `main.ts`.
- [ ] Ponoviti sve gameplay provere iz Koraka 4.

### Šta NE sme da radi u tom koraku
Ne menjati logiku, tipove, potpise, `main.ts`, testove, eval-e ili tagove. Bez CSS biblioteka, slike, SVG asseta, font preuzimanja, novih kontrola, zvuka, animacionih petlji ili novih game događaja. Ne implementirati AI panel unapred.

### Procena vremena
45 minuta sa vizuelnom i funkcionalnom proverom. Ako se pojavi problem izgleda, koristiti rezervu A; ne skraćivati evidence da bi se prikrilo prekoračenje.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `A5 / vizuelna dopuna K3`, tri izmenjena fajla, usvojena paleta, stvarni rezultati komandi i viewport/DPR provera, poznata ograničenja. Commit: `feat: originalan pixel izgled i pristupacan prikaz`.

## Korak 8 — RUČNO: EVIDENCE_003 i predaja Week 3 (deo originalnog K10)

### Cilj
Završiti sve obaveze „Posle Sesije 003, pre review sesije“ i proveriti doteranu igru. Predaja A ne zavisi od AI implementacije.

### Kontekst
Zajednički kontekst; M3, M5; deo K10 iz `docs/IMPLEMENTATION_STEPS.md` koji se odnosi na dokumentaciju; Koraci 4–7 ovog plana samo njihove ručne provere; `README.md`, `docs/BUILD_PROMPT_V1.md`, `docs/CONTEXT_MANIFEST.md`, `docs/EVALS.md`, `docs/EVIDENCE_003.md`, `docs/AI_USAGE_LOG.md`; dokazni fajlovi iz Koraka 5/6. Zajednička procedura provere tajni iz ovog plana.

### Dozvoljeni fajlovi
RUČNO: `README.md`, `docs/BUILD_PROMPT_FINAL.md`, `docs/CONTEXT_MANIFEST.md`, `docs/EVIDENCE_003.md`, `docs/EVALS.md`, `docs/AI_USAGE_LOG.md`, `docs/runs/week3-checks.txt`, `docs/runs/week3-final.png`, `docs/runs/week3-360.png`, `docs/runs/config-invalid.png`.

### Šta tačno da uradi
1. Popuni sva polja `EVIDENCE_003.md` stvarnim podacima: početna tvrdnja, baseline hash, problem, hipoteza, minimalna promena, isti E1–E5 rezultati, komande, ograničenje, oba člana i njihovi stvarni doprinosi. Hash tagova pročitaj, ne nagađaj. Poveži već sačuvane sirove izlaze.
2. Navedi da je izgled doteran tek posle `after-fix`, sa zasebnim commitom; to nije deo eksperimenta jedne promene. Rezultate finalnog build-a drži odvojeno od istorijskog baseline izlaza.
3. Sačuvaj screenshot konačne igre u running stanju (`week3-final.png`), rasporeda na 360px (`week3-360.png`) i stvarnog nevalidnog config-a sa fallback-om (`config-invalid.png`). Bez doterivanja slika i privatnih browser podataka.
4. `BUILD_PROMPT_FINAL.md`: sačuvaj kopiju originalnog V1 kao istorijsku osnovu i poseban odeljak sa stvarno korišćenim dopunama: tekući `Plan.md` korak, odsustvo AI u A, odvojeni vizuelni korak, precizan kontekst. Zabeleži da E4 popravka nije menjala prompt/šemu/eval. Ne tvrdi da je rađen prompt ablation.
5. Ažuriraj manifest stvarnim kontekstom, a log stvarnim pozivima i potrošnjom. Dodaj dva odeljka „Kontekst planiranja“ i „Kontekst implementacije“; ne prepisuj da je PDF dat svakom coding pozivu.
6. README uskladi sa trenutnim stanjem: igra radi lokalno; komande; URL config; kontrole; tagovi; gde je evidence. Jasno napiši `Week 3 završen; AI Hint je planiran za Week 4 i još nije implementiran`. `?ai=` primere prebaci pod budući Deo B, ne predstavi ih kao aktivne. Ukloni referencu na odsutni `CLAUDE.md`.
7. Izvrši zajedničku proveru tajni, diff-a i sadržaja predaje. Pregledaj i ignorisanje `.env` i generisanih direktorijuma. Ne menjaj postojeće spec/instruction dokumente da bi uklonila dokumentovana grep poklapanja.
8. Sa partnerom pripremi review A: igra/kontrole; spec i V1; baseline→E4 hipoteza→isti eval; invalid config/fallback; evidence, AI budžet i ograničenje. Oboje moraju objasniti svoj doprinos. Zamenite vozača/posmatrača na polovini ovog bloka.

### Testovi
Svi postojeći game testovi i E1–E5; nema novih testova. Status `EVIDENCE_004.md` ostaje šablon za sledeću nedelju, ne uslov prolaza A.

### Izlazna komanda
```bash
bash -o pipefail -c '(npm run typecheck && npm test && npm run eval && npm run build) 2>&1 | tee docs/runs/week3-checks.txt'
git diff --check
```
Obe moraju proći; posle commita `git status --short` mora biti prazan za predajni rad.

### Ručna provera
- [ ] Sve ručne provere Koraka 4 i 7 su izvršene; ograničenja iskreno zabeležena.
- [ ] Baseline i after-fix tagovi postoje, njihov source diff ostaje samo ciljana popravka.
- [ ] Evidence nema nepopunjenih obaveznih placeholder-a ili izmišljenih rezultata.
- [ ] Postoje GAME_SPEC, V1, FINAL, manifest, eval-i, EVIDENCE_003 i početni/dopunjeni log.
- [ ] A je potpuno igriv bez `src/ai/`; nema AI dugmeta ni AI runtime poziva.
- [ ] Oba člana su navedena sa stvarnim doprinosima; potrošnja se ne izmišlja.
- [ ] Ukupno A vreme sa evidencijom staje u 240 minuta, ili je prekoračenje/bloker iskreno prijavljen.

### Šta NE sme da radi u tom koraku
Ne implementirati B, dopunjavati evidence izmišljenim testovima, menjati sirove izlaze, pomerati tagove ili skrivati neuspele provere. Bez push-a/deploy-a.

### Procena vremena
30 minuta RUČNO. Preostala rezerva A do 50 minuta pokriva setup, popravke i dodatni pregled; nije novi scope.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
Nema novog AI poziva. RUČNO kompletirati A redove i ukupni broj značajnih poziva, stvarno vreme i potrošnju ako dostupna. Commit: `docs: dokazi i predaja za sesiju 003`. **Ovde završiti rad ove nedelje.**

---

# DEO B — Week 4 / Sesija 004

Ovaj deo je detaljno isplaniran, ali se **ne izvršava ove nedelje**. Preduslov je završen i sačuvan Deo A. Budžet je približno 110 minuta + 10 minuta rezerve; nije deo četiri sata A. Koraci koriste postojeći `TOOL_CONTRACT.md`, fake klijent i nula live poziva.

## Korak 9 — AI tipovi i runtime validatori (originalni K6, AI iteracija B1)

### Cilj
Definisati nepromenjenu AI granicu i runtime odbijanje nevalidnih poziva, snapshot-a i odgovora. Još ne uvoditi alat, provider ili UI.

### Kontekst
Zajednički kontekst; M4, M1, M2; K6 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/TOOL_CONTRACT.md`, `src/game/types.ts`; ako postoje, fajlovi sa dozvoljene AI liste ispod.

### Dozvoljeni fajlovi
AI: `src/ai/types.ts`, `src/ai/validate.ts`, `tests/ai-validate.test.ts`, `tests/ai-boundary.test.ts`. RUČNO: `docs/AI_USAGE_LOG.md`.

### Šta tačno da uradi
1. Prepiši ceo `src/ai/types.ts` iz K6 bez promene. Allowlista ostaje tačno `get_game_state`; `HintAction` ostaje `up | down | left | right | keep`; `HintFailure` ostaje postojeća unija šest razloga. Ne dodavati novo polje u `AiClient` ili `HintResult`.
2. Tačni javni potpisi ostaju iz K6: `validateToolCall(input: unknown)` vraća postojeću uniju sa `call` ili `reason`; `validateSnapshot(input: unknown, detail: Detail): boolean`; `validateHintResponse(input: unknown)` vraća `{ ok: true; hint: HintResponse } | { ok: false }`.
3. `validateToolCall` mora pratiti postojeći redosled: običan objekat → name string → allowlista → tačno name/args → args običan objekat sa tačno detail → summary/tactical. Nepoznato string ime daje `unsupported_tool`, nevalidan oblik daje `invalid_tool_call`. Vrati nov normalizovan objekat.
4. Snapshot: summary ima tačno score/length/status/direction; tactical dodaje tačno head/food/gridSize/danger. Proveri konačnost brojeva, enum vrednosti, `head` i nenull `food` sa tačno x/y konačnim brojevima, danger sa tačno četiri smera i boolean vrednostima. Arrays/null nisu objekti za ove strukture. Ne uvoditi dodatne domenske opsege koji nisu u postojećem ugovoru.
5. Hint ima tačno tri postojeća ključa; trimuj `hint`, dužina 1–160, dozvoljeni action/urgency. Vrati nov objekat sa trimovanim stringom. Tekst je podatak, ne HTML ili komanda.

### Testovi
Postojeći `tests/ai-validate.test.ts` iz K6 prepisati potpuno nepromenjen. Novi `tests/ai-boundary.test.ts` prepisati tačno:

```ts
import { describe, it, expect } from "vitest";
import { validateSnapshot, validateHintResponse } from "../src/ai/validate";

const tactical = {
  score: 0, length: 3, status: "paused", direction: "right",
  head: { x: 5, y: 5 }, food: { x: 0, y: 0 }, gridSize: 10,
  danger: { up: false, down: false, left: true, right: false },
};

describe("AI granica — dodatne provere", () => {
  it("odbija nekonacne brojeve i u ugnjezdenim tackama", () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      expect(validateSnapshot({ ...tactical, score: value }, "tactical")).toBe(false);
      expect(validateSnapshot({ ...tactical, head: { x: value, y: 5 } }, "tactical")).toBe(false);
      expect(validateSnapshot({ ...tactical, food: { x: 0, y: value } }, "tactical")).toBe(false);
    }
  });

  it("odbija dodatna ugnjezdena polja i neboolean danger", () => {
    const invalid: unknown[] = [
      { ...tactical, head: { x: 5, y: 5, secret: "not-allowed" } },
      { ...tactical, food: { x: 0, y: 0, extra: true } },
      { ...tactical, danger: { ...tactical.danger, diagonal: false } },
      { ...tactical, danger: { ...tactical.danger, right: "false" } },
    ];
    for (const value of invalid) {
      expect(validateSnapshot(value, "tactical")).toBe(false);
    }
  });

  it("vraca trimovan hint bez menjanja ulaza", () => {
    const input = { hint: "  Nastavi pravo.  ", suggestedAction: "keep", urgency: "low" };
    const before = structuredClone(input);
    expect(validateHintResponse(input)).toEqual({
      ok: true,
      hint: { hint: "Nastavi pravo.", suggestedAction: "keep", urgency: "low" },
    });
    expect(input).toEqual(before);
  });
});
```

### Izlazna komanda
```bash
npm run typecheck && npm test
```

### Ručna provera
- [ ] Tipovi i potpisi su identični K6; novi testovi su u odvojenom fajlu.
- [ ] Nema izvršavanja alata, DOM-a, mreže ili bilo kog AI poziva.
- [ ] Pre narednog većeg bloka par proverava očekivanja T1–T8 u postojećem `EVALS.md`.

### Šta NE sme da radi u tom koraku
Bez Zod-a i drugih biblioteka, proširenja allowliste, novih action/status/failure vrednosti, promene `TOOL_CONTRACT.md` ili game tipova.

### Procena vremena
20 minuta sa proverama i commitom.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `B1 / K6`, očekivana validacija sva tri ugovora, stvarni rezultati, lista konteksta i potrošnja. Commit: `feat: runtime validacija AI ugovora`.

## Korak 10 — Read-only get_game_state (originalni K7, AI iteracija B2)

### Cilj
Napraviti jedini dozvoljeni alat koji vraća mali snapshot i ne izlaže reference igre. Dokazati da mutiranje njegovog rezultata ne menja stanje.

### Kontekst
Zajednički kontekst; M4, M1, M2; K7 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/TOOL_CONTRACT.md`, `src/game/types.ts`, `src/game/config.ts`, `src/game/logic.ts`, `src/ai/types.ts`.

### Dozvoljeni fajlovi
AI: `src/ai/tools.ts`, `tests/tool.test.ts`. RUČNO: `docs/AI_USAGE_LOG.md`.

### Šta tačno da uradi
1. Implementiraj `export function getGameState(state: GameState, args: ToolArgs): GameSnapshot` bez promene potpisa.
2. Summary: nov objekat sa score, `snake.length`, status, direction; nijedno drugo polje.
3. Tactical: summary plus novi `head`, novi `food` ili null, gridSize i nov `danger` objekat. Ne vraćaj `snake`, `config`, tickMs, RNG, URL, DOM ili greške konfiguracije.
4. Za svaki smer sledeća tačka je glava + jedinični vektor. `danger` je true za izlazak van table ili poklapanje sa segmentom u `snake.slice(0,-1)`. Prati tačnu definiciju alata; ovo nije algoritam koji garantuje pobedu niti provera svih budućih poteza.
5. Alat ne poziva `tick`, `changeDirection`, `togglePause`, `handleSpace` ili bilo koju write operaciju. Produkcioni pozivalac je samo `hintFlow.ts`; direktni pozivi iz testova su provera ugovora, ne drugi produkcioni caller.

### Testovi
Prepiši `tests/tool.test.ts` iz K7 tačno. Posebno moraju proći tačan skup izlaznih polja, opasnost zida, zabranjena polja i mutiranje `head`/`food` bez promene igre. Bez novih testova u ovom koraku.

### Izlazna komanda
```bash
npm run typecheck && npm test
```

### Ručna provera
- [ ] Alat importuje samo dozvoljene tipove/čitanje; ne menja state.
- [ ] Snapshot nema deljene reference na head/food i ne sadrži ceo niz tela.
- [ ] Partner proverava read-only dokaz; zameniti uloge pre hint flow bloka.

### Šta NE sme da radi u tom koraku
Bez DOM-a, klijenta, tajmera, mreže, novih alata, promene game pravila ili većeg snapshot-a.

### Procena vremena
15 minuta sa proverama i commitom.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `B2 / K7`, očekivana polja/read-only signal, rezultat tool testova i sledeći korak. Commit: `feat: read-only snapshot igre`.

## Korak 11 — Fake klijent i kontrolisani hint tok (originalni K8, AI iteracija B3)

### Cilj
Povezati jedan validiran predlog alata sa jednim validiranim odgovorom, bez mreže i mutacije igre. Dokazati success, negative, failure i timeout putanje pre rada na dugmetu.

### Kontekst
Zajednički kontekst; M4, M1, M2; K8 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/TOOL_CONTRACT.md`, AI test matrix sekcija `docs/EVALS.md`, `src/ai/types.ts`, `src/ai/validate.ts`, `src/ai/tools.ts`, `src/game/types.ts`, `src/game/config.ts`, `src/game/logic.ts`.

### Dozvoljeni fajlovi
AI: `src/ai/fakeClient.ts`, `src/ai/hintFlow.ts`, `tests/hintFlow.test.ts`, `tests/hintFlow-boundary.test.ts`. RUČNO: `docs/AI_USAGE_LOG.md`.

### Šta tačno da uradi
1. `FAKE_MODES`, `FakeMode` i potpis `createFakeClient(mode: FakeMode): AiClient & { calls: { proposeToolCall: number; produceHint: number } }` ostaju tačno iz K8. Šest režima: success, invalid_args, unsupported_tool, timeout, provider_error, malformed_final. Ne dodavati URL režim za malformed tool output; taj slučaj se proverava injekcijom `executeTool` u testu.
2. Fake nema mrežu. Povećaj odgovarajući brojač jednom po stvarnom pozivu. Vrati tačne predloge i nevalidne primere iz K8. Timeout režim ima Promise koji se nikad ne završi; provider_error odbija Promise; malformed_final vraća tačan nevalidan objekat.
3. Uspešan fake savet koristi redosled smerova up, down, left, right iz K8. Ako je trenutni smer bez opasnosti, tačan postojeći savet `Put je slobodan, nastavi pravo.`, action keep, urgency low. Ako je opasan, prvi smer bez opasnosti i postojeći tekst `Opasnost ispred! Skreni <smer>.`, urgency high. Ako nema nijednog smera bez opasnosti, ne vraćati undefined/izmišljeni smer: `{ hint: "Nema bezbednog smera. Proveri tablu pre nastavka.", suggestedAction: "keep", urgency: "high" }`. Ovo samo popunjava granu postojeće funkcije postojećim ugovorom; savet ne garantuje bezbednost niti sam nastavlja igru.
4. `SAFE_MESSAGE` ostaje tačno `AI savet trenutno nije dostupan. Igra nastavlja normalno.`. Sačuvaj postojeći potpis `requestHint(deps: { client: AiClient; getState: () => GameState; executeTool?: ExecuteTool; timeoutMs?: number }): Promise<HintResult>`; default alat `getGameState`, default timeout 5000ms.
5. Tačan redosled: pozovi propose jednom sa timeout-om → validiraj call/allowlist/args → uzmi kopiju trenutnog stanja pomoću `structuredClone(getState())` → izvrši dozvoljeni alat jednom → validiraj snapshot prema traženom detail → pozovi produceHint jednom sa timeout-om → validiraj final → vrati postojeći `HintResult`. Ako validator odbije, odmah vrati odgovarajući failure; sledeća faza se ne pokreće. Pošto postojeći `validateSnapshot` vraća boolean, a `ExecuteTool` unknown, dozvoljen je lokalni `as GameSnapshot` tek **posle** uspešne runtime provere; ne menjaj potpis validatora u type predicate i ne uvodi `any`.
6. `toolCalls` kreće od 0; postavi ga na 1 neposredno pre stvarnog poziva executeTool, nakon dobijanja kopije stanja. Broj je 1 i ako izvršeni alat baci grešku; 0 ako je predlog ranije odbijen ili do alata nije došlo. UI nikad ne prikazuje interne razloge ili brojače kao sirovu grešku.
7. Timeout se primenjuje **zasebno** na propose i produceHint kao u K8; ukupno čekanje dve spore faze može biti do približno 10 sekundi. Fake timeout u prvoj fazi završava oko 5 sekundi. Ne tvrdi da ceo tok uvek ima globalni limit 5 sekundi.
8. Koristi privatni helper koji radi `Promise.race` i u `finally` čisti `setTimeout` tajmer. Timeout razlikuj sopstvenom internom oznakom/klasom, ne string porukom provider-a. Ne dodavati retry, petlju, drugi alat, autonomni nastavak ili novi javni tip. Zakašnjeli Promise rezultat se ignoriše: iza neuspešnog await-a nema daljeg izvršavanja alata ili produceHint-a. Lokalni race ne otkazuje stvarni provider zahtev; ovde nema mreže.
9. `requestHint` ne baca. Svaki neuspeh vraća `message: SAFE_MESSAGE`; timeout→timeout, nevalidni oblici→postojeći validator razlog. Ostale uhvaćene greške, uključujući injektovani executeTool/getState izuzetak, mapiraj u postojeći `provider_error` bez curenja poruke/stack-a. Ne uvoditi sedmu failure vrednost.

### Testovi
`tests/hintFlow.test.ts` iz K8 prepiši tačno: T1–T8 ostaju isti. Dodatni `tests/hintFlow-boundary.test.ts` prepiši tačno:

```ts
import { describe, it, expect, vi } from "vitest";
import { DEFAULT_CONFIG } from "../src/game/config";
import { createInitialState, startGame } from "../src/game/logic";
import { getGameState } from "../src/ai/tools";
import { createFakeClient } from "../src/ai/fakeClient";
import { requestHint, SAFE_MESSAGE } from "../src/ai/hintFlow";
import type { AiClient, GameSnapshot, HintResponse } from "../src/ai/types";

const call = { name: "get_game_state", args: { detail: "tactical" } };
const answer: HintResponse = {
  hint: "Nastavi pravo.", suggestedAction: "keep", urgency: "low",
};
const makeState = () => startGame(createInitialState(DEFAULT_CONFIG, () => 0));

describe("requestHint — dodatne granice", () => {
  it("salje tacan snapshot, vraca tacan odgovor i cuva igru od mutacije klijenta", async () => {
    const state = makeState();
    const before = structuredClone(state);
    let received: GameSnapshot | undefined;
    const client = {
      proposeToolCall: vi.fn(async () => call),
      produceHint: vi.fn(async (snapshot: GameSnapshot) => {
        received = structuredClone(snapshot);
        if ("head" in snapshot) snapshot.head.x = 99;
        return answer;
      }),
    } satisfies AiClient;
    const tool = vi.fn(getGameState);
    const result = await requestHint({ client, getState: () => state, executeTool: tool });
    expect(received).toEqual(getGameState(before, { detail: "tactical" }));
    expect(result).toEqual({ ok: true, hint: answer, toolCalls: 1 });
    expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
    expect(client.produceHint).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledWith(before, { detail: "tactical" });
    expect(state).toEqual(before);
  });

  it("kontrolise provider gresku u drugoj fazi bez ponavljanja poziva", async () => {
    const state = makeState();
    const client = {
      proposeToolCall: vi.fn(async () => call),
      produceHint: vi.fn(async () => { throw new Error("test second phase failure"); }),
    } satisfies AiClient;
    const tool = vi.fn(getGameState);
    expect(await requestHint({ client, getState: () => state, executeTool: tool })).toEqual({
      ok: false, reason: "provider_error", message: SAFE_MESSAGE, toolCalls: 1,
    });
    expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
    expect(client.produceHint).toHaveBeenCalledTimes(1);
    expect(tool).toHaveBeenCalledTimes(1);
  });

  it("timeout druge faze cisti tajmere i ignorise zakasneli finalni odgovor", async () => {
    vi.useFakeTimers();
    try {
      const state = makeState();
      const before = structuredClone(state);
      let finish!: (value: unknown) => void;
      const late = new Promise<unknown>((resolve) => { finish = resolve; });
      const client = {
        proposeToolCall: vi.fn(async () => call),
        produceHint: vi.fn(() => late),
      } satisfies AiClient;
      const tool = vi.fn(getGameState);
      const pending = requestHint({ client, getState: () => state, executeTool: tool, timeoutMs: 50 });
      await vi.advanceTimersByTimeAsync(51);
      const result = await pending;
      expect(result).toEqual({ ok: false, reason: "timeout", message: SAFE_MESSAGE, toolCalls: 1 });
      expect(vi.getTimerCount()).toBe(0);
      finish(answer);
      await vi.advanceTimersByTimeAsync(0);
      expect(await pending).toEqual(result);
      expect(tool).toHaveBeenCalledTimes(1);
      expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
      expect(client.produceHint).toHaveBeenCalledTimes(1);
      expect(state).toEqual(before);
    } finally {
      vi.useRealTimers();
    }
  });

  it("zakasneli predlog posle timeout-a nikad ne izvrsava alat", async () => {
    vi.useFakeTimers();
    try {
      const state = makeState();
      let finish!: (value: unknown) => void;
      const late = new Promise<unknown>((resolve) => { finish = resolve; });
      const client = {
        proposeToolCall: vi.fn(() => late),
        produceHint: vi.fn(async () => answer),
      } satisfies AiClient;
      const tool = vi.fn(getGameState);
      const pending = requestHint({ client, getState: () => state, executeTool: tool, timeoutMs: 50 });
      await vi.advanceTimersByTimeAsync(51);
      expect(await pending).toEqual({
        ok: false, reason: "timeout", message: SAFE_MESSAGE, toolCalls: 0,
      });
      finish(call);
      await vi.advanceTimersByTimeAsync(0);
      expect(tool).not.toHaveBeenCalled();
      expect(client.produceHint).not.toHaveBeenCalled();
      expect(client.proposeToolCall).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("izuzetak izvrsenog alata vraca safe error i ne salje finalni zahtev", async () => {
    const state = makeState();
    const client = createFakeClient("success");
    const tool = vi.fn(() => { throw new Error("test tool failure"); });
    expect(await requestHint({ client, getState: () => state, executeTool: tool })).toEqual({
      ok: false, reason: "provider_error", message: SAFE_MESSAGE, toolCalls: 1,
    });
    expect(tool).toHaveBeenCalledTimes(1);
    expect(client.calls).toEqual({ proposeToolCall: 1, produceHint: 0 });
  });
});
```

Ovo je osam novih testova ukupno sa Korakom 9. Nisu izvršeni pri pisanju plana. Ne tvrditi unapred da su prošli. Ako se pojavi problem testa, prijaviti tačan izlaz; ne menjati test bez odobrenja.

### Izlazna komanda
```bash
npm run typecheck && npm test && npm run eval
```

### Ručna provera
- [ ] T1–T8 dokazuju pozive i neizvršavanje, ne samo postojanje funkcije.
- [ ] Greške ne izlažu originalni Error tekst; svaki failure ima SAFE_MESSAGE.
- [ ] Nema mreže, SDK-a, tajni, proizvoljnog izvršavanja ili retry petlje.
- [ ] Sve proverene timeout putanje čiste tajmere i ne nastavljaju tok kasnim rezultatom.

### Šta NE sme da radi u tom koraku
Bez UI dugmeta, DOM-a, promene game state-a, live poziva, novih tipova/potpisa, proširenja fake režima ili izmene postojećih T1–T8.

### Procena vremena
30 minuta sa testovima, pregledom i commitom; složeniji problem koristi rezervu B, ne slabljenje provera.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `B3 / K8`, očekivanje validiranog toka i neizvršavanja odbijenih zahteva, stvarni T1–T8 i dodatni rezultati, potrošnja, potvrda fake puta i nula live poziva. Commit: `feat: kontrolisani fake AI hint tok`.

## Korak 12 — AI dugme i pristupačan panel (originalni K9, AI iteracija B4)

### Cilj
Dodati jednu korisničku AI funkciju koja prikazuje validan savet ili bezbednu grešku. Igra zadržava autoritet, ostaje zaustavljena tokom zahteva i ne izvršava predloženu akciju.

### Kontekst
Zajednički kontekst; M4, M1; K9 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/TOOL_CONTRACT.md`, `index.html`, `src/style.css`, `src/main.ts`, `src/render.ts`, `src/game/types.ts`, `src/game/logic.ts`, `src/ai/types.ts`, `src/ai/fakeClient.ts`, `src/ai/hintFlow.ts`.

### Dozvoljeni fajlovi
AI: `src/main.ts`, `index.html`, `src/style.css`. RUČNO: `docs/AI_USAGE_LOG.md`. `render.ts` se samo čita; njegov paused overlay već postoji.

### Šta tačno da uradi
1. Ispod table/kontrola dodaj `section id="hint-panel" data-state="idle"` sa vidljivim naslovom `AI savet`, `button id="hint-btn" type="button"` sa tačnim tekstom `Ask AI for Hint`, `span id="ai-mode"`, `p id="hint-label"` sa tekstom `Savet nije zatražen`, i `p id="hint" aria-live="polite" aria-atomic="true"`. Live region postoji prazan pre prvog zahteva; ne kreiraj ga tek kada stigne odgovor.
2. Dodaj odvojeni ne-live tekst `Savet važi za stanje pri zahtevu. Igra ne izvršava predloženi potez.` i `Space za nastavak pauzirane igre.` Ovim se objašnjava pauza bez izmene tačnog SAFE_MESSAGE stringa.
3. Panel koristi postojeće tokene: pozadina `--panel-bg`, tekst `--text`, border `--grid`, padding 16px, gap 12px; na maloj širini dugme može prelomiti tekst. Dugme min-height 44px, padding 10px 14px, monospace nasleđen; tekst `--page-bg` na `--accent`, vidljiv outline iz Koraka 7. Disabled stanje ima stvarni `disabled` atribut i tekstualno čekanje; ne oslanjaj se samo na bledu boju.
4. U `main.ts` proveri nove DOM elemente. `?ai=` validiraj preko `FAKE_MODES`; nepoznat/odsutan→success. Napravi fake klijent. `#ai-mode.textContent = "AI: fake (" + mode + ")"`; oznaka je iskrena i vidljiva.
5. Lokalni UI flag `hintPending: boolean = false` nije deo `GameState`. U click handleru prvo ako pending vrati se; zatim postavi pending=true, onemogući dugme, `aria-busy="true"` na hint region, `data-state="pending"` na `#hint-panel`, `#hint-label.textContent = "Savet se priprema"` i `hint.textContent = "Razmišljam…"`.
6. Ako je `state.status === "running"`, dodeli `togglePause(state)` i pozovi `draw()`. Za ready/paused/over/won ne menjaj state. Pozovi tačno jednom `requestHint({ client, getState: () => state })`; game timer ostaje isti i tick u pauzi ništa ne menja.
7. Prilagodi postojeći `keydown` handler, bez novih vrsta event-a: ako je target dugme, propusti browseru nativni Space/Enter i ne pozivaj game komandu. Ako `hintPending`, ignorisati strelice/WASD/Space; za te tastere van dugmeta sprečiti scroll. Ostale tastere ne presretati. Van čekanja i van dugmeta zadržati K3 kontrole i `event.repeat` zaštitu za Space.
8. Uspeh: postojeći format `${hint.hint} → ${hint.suggestedAction} (${hint.urgency})` upiši kroz `#hint.textContent`; `#hint-panel` dobija `data-state="success"`, a `#hint-label.textContent` vrednost `Savet spreman`. Greška: isključivo `message`/SAFE_MESSAGE kroz `#hint.textContent`, `data-state="error"` na panelu, label `Savet nije dostupan`. Oznake ne sadrže interni `reason` ili stack. Za success boja label-a i naglašenog okvira je `--success`, za error `--error`; tekstualna oznaka je obavezna pored boje. Live region sadrži sam savet ili bezbednu poruku; ne prepisuj ga pri game tick-u. Idle/pending koriste neutralni okvir `--grid` i label `--text-muted`.
9. U `finally` pending=false, dugme enabled, ukloni aria-busy. Ne pozivaj `togglePause`, reset ili automatski start na završetku. Ako je fokus bio na dugmetu pri aktivaciji i browser ga je izgubio zbog disabled stanja, vrati fokus na dugme samo ako korisnik nije u međuvremenu fokusirao drugi element; ne otimaj fokus. Za nastavak tastaturom korisnik može Tab-om izaći iz dugmeta pa pritisnuti Space.
10. Rezultat nikad ne prosleđuj `changeDirection`, sintetisanom event-u, `eval`, `innerHTML` ili HTML parseru. Ne menjaj score/snake/food/status direktno. Pauza je jedina game promena izazvana korisnikovim klikom i izvodi se postojećom game funkcijom pre ulaska u AI tok.

### Testovi
Nema novih DOM test zavisnosti. Izvrši postojeću kompletnu suite, E1–E5 i build; UI događaje, fokus i live najave proveri ručno.

### Izlazna komanda
```bash
npm run typecheck && npm test && npm run eval && npm run build
```

### Ručna provera
- [ ] `/`: pokreni igru, klikni dugme; igra se pauzira, pojavi se validan savet i fake oznaka.
- [ ] Posle saveta igra ostaje paused; ne menja pravac/poene; Space van dugmeta nastavlja.
- [ ] `/?ai=timeout`: tokom čekanja tasteri ne menjaju igru; nakon oko 5s prikazan je tačan SAFE_MESSAGE, dugme opet dostupno i igra i dalje paused.
- [ ] Brzi dupli klik ne pokreće paralelni zahtev; za vreme čekanja dugme je disabled.
- [ ] `/?ai=invalid_args`, `/?ai=unsupported_tool`, `/?ai=provider_error`, `/?ai=malformed_final` daju istu bezbednu poruku, bez nevalidnog hint-a ili stack trace-a.
- [ ] `/?ai=bilo-sta` jasno prikazuje fake success režim.
- [ ] Klik u ready/paused/over/won ne startuje/resetuje igru; odgovarajući status ostaje isti.
- [ ] Tab fokus je vidljiv; Space/Enter na dugmetu aktiviraju savet bez istovremene game komande. Tab može napustiti panel, nema zamke fokusa.
- [ ] Screen reader najavi savet/grešku; oznake razlikuju uspeh i grešku i bez boje.
- [ ] Panel, najduži dozvoljeni hint i dugme staju na 360px bez horizontalnog skrola; reduced motion ostaje ispoštovan.
- [ ] Network panel ne pokazuje AI mrežne pozive; app koristi samo lokalni fake.

### Šta NE sme da radi u tom koraku
Bez automatskog igranja/nastavka, novih komandi, touch dugmadi, provider-a, promena ugovora, game logike, renderera ili testova. Ne prikazivati nevalidan odgovor ni tehničke interne detalje greške.

### Procena vremena
20 minuta, uključujući ručni pregled interakcije i commit.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
RUČNO: `B4 / K9`, očekivano ponašanje pauze i fokusa, validan/failure prikaz, stvarne provere, kontekst, potrošnja i nula live poziva. Commit: `feat: AI hint dugme i pristupacan panel`.

## Korak 13 — RUČNO: EVIDENCE_004 i završna predaja (ostatak originalnog K10)

### Cilj
Sačuvati ponovljiv dokaz celog AI toka i dovršiti Core paket za obe sesije. Jasno navesti šta fake testovi dokazuju, a šta nije provereno na live provider-u.

### Kontekst
Zajednički kontekst; M3, M5; K10 iz `docs/IMPLEMENTATION_STEPS.md`; `docs/TOOL_CONTRACT.md`, `docs/EVALS.md`, `docs/EVIDENCE_003.md`, `docs/EVIDENCE_004.md`, `docs/AI_USAGE_LOG.md`, `docs/BUILD_PROMPT_V1.md`, `docs/BUILD_PROMPT_FINAL.md`, `docs/CONTEXT_MANIFEST.md`, `README.md`; `tests/hintFlow.test.ts`, `tests/hintFlow-boundary.test.ts`, `tests/tool.test.ts`; ručna lista Koraka 12 i zajednička procedura provere tajni.

### Dozvoljeni fajlovi
RUČNO: `README.md`, `docs/EVIDENCE_004.md`, `docs/EVALS.md`, `docs/AI_USAGE_LOG.md`, `docs/BUILD_PROMPT_FINAL.md`, `docs/CONTEXT_MANIFEST.md`, `docs/runs/ai-test-matrix.txt`, `docs/runs/week4-checks.txt`, `docs/runs/hint-success.png`, `docs/runs/hint-timeout.png`.

### Šta tačno da uradi
1. Pre pokretanja ponovo pročitaj već zapisana očekivanja T1–T8. Sačuvaj detaljan stvarni izlaz `bash -o pipefail -c 'npm test -- --reporter=verbose 2>&1 | tee docs/runs/ai-test-matrix.txt'`. Izlaz mora prikazati imena matrix i dodatnih testova; ne izmišljaj rezultat ako se komanda prekine.
2. U `EVALS.md` popuni stvarni rezultat svakog T1–T8, sa brojem alata i relevantnim client attempts iz asercija. Dodaj zaseban odeljak za osam novih boundary testova; ne prepravljaj postojeće očekivanje, T ID ili istorijske kolone E1–E5.
3. U `EVIDENCE_004.md` navedi TOOL_CONTRACT i fake Core put; priloži izlaz ili link i relevantne neizmenjene delove izlaza. T1 + dodatni success test dokazuju tačan snapshot, arg, broj poziva i finalni response. T2/T3 dokazuju da alat nije izvršen; T4/T5/T6/T7 i dodatni testovi pokrivaju failure.
4. Prikazan uspešan `HintResponse` zapiši kao stvarni JSON sa sva tri polja prepisana iz potvrđenog rezultata; ne koristi placeholder `...` i ne predstavljaj izmišljeni primer kao runtime izlaz. Sačuvaj stvarne UI screenshot-e `/` uspeha i `/?ai=timeout` greške. Matrica je izvor dokaza callCount/attempts; screenshot sam ne dokazuje neizvršavanje alata.
5. Navedi read-only dokaze T8, mutaciju snapshot-a u `tool.test.ts` i mutaciju snapshot-a od strane klijenta u dodatnom testu. Pauza iz UI-a se događa pre AI granice; nije mutacija stanja od strane alata.
6. Ograničenja: fake deterministički savet, bez kvalitativnog eval-a saveta, bez garancije preživljavanja/pobede, lokalni timeout ne otkazuje eventualan budući mrežni zahtev, testirana snapshot read-only granica ne dokazuje kvalitet live modela. Tačna izjava: `Core put koristi lokalni fake klijent; live provider nije testiran.` Broj live poziva: 0.
7. Dopuni oba stvarna doprinosa para za B, log, dostupnu potrošnju, tačan kontekst i završni prompt stvarno korišćenim instrukcijama. README sada aktivno dokumentuje AI dugme, šest fake režima, fallback za nepoznat režim i komande; ne tvrdi da postoji live browser integracija.
8. Ponovi zajedničku proveru tajni i pregled predajnih artefakata. Sačuvaj završne izlaze narednom komandom; napravi dokumentacioni commit, bez menjanja baseline/after-fix tagova.
9. RUČNO uvežbaj demo: 0:00–0:45 igra; 0:45–1:30 spec/prompt/granice; 1:30–2:30 baseline→jedna promena→isti eval; 2:30–3:15 runtime config; 3:15–4:45 AI hint/ugovor; 4:45–5:45 negative/failure; 5:45–6:30 evidence/budžet; do 7:00 ograničenje. Oba člana objašnjavaju doprinos i odgovaraju na bar jedno pitanje. Na polovini pripreme zameni uloge.

### Testovi
Kompletna suite: originalni game/AI testovi, osam novih boundary testova, isti E1–E5. Stvarni broj i status upiši tek iz izlaza; referentnih 64/64 nije lokalni dokaz. Nema live testova ili novih test fajlova u ovom koraku.

### Izlazna komanda
```bash
bash -o pipefail -c '(npm run typecheck && npm test && npm run eval && npm run build) 2>&1 | tee docs/runs/week4-checks.txt'
git diff --check
```
Obe komande moraju proći. Prethodna verbose test komanda služi dokaznom izlazu; ne ponavljati dalje testove bez nove izmene ili neuspeha. Posle commita `git status --short` mora biti prazan za predajni rad.

### Ručna provera
- [ ] Svi T1–T8 rezultati popunjeni stvarnim dokazima, uključujući attempts/callCount.
- [ ] Success, neizvršen alat i failure imaju zasebne, proverljive dokaze.
- [ ] Finalni JSON je stvaran; tekst prikazan u UI-u odgovara validiranim poljima.
- [ ] EVIDENCE_004 ima ograničenje i oba stvarna doprinosa; fake je jasno označen.
- [ ] Week 3 istorija i dokazi ostaju sačuvani; Week 4 ih ne prepisuje.
- [ ] Komande za setup/test/build i kompletna dokumentacija postoje u README-u.
- [ ] Testovi ne pozivaju mrežu; nema tajni niti novih direktnih paketa.
- [ ] AI budžet je sabran iz stvarnih poziva, bez paralelnih agenata.

### Šta NE sme da radi u tom koraku
Bez live poziva, SDK-a, menjanja koda radi lepšeg demo-a, doterivanja sirovih izlaza, izmišljenog kvaliteta saveta, push-a, deploy-a ili pomeranja tagova.

### Procena vremena
25 minuta RUČNO; rezerva B 10 minuta. Ako se otkrije stvaran implementacioni problem, nova AI iteracija troši preostali budžet i zahteva nove relevantne provere.

### Šta se upisuje u AI_USAGE_LOG.md i koji commit se pravi
Nema novog AI poziva za samo popunjavanje evidence-a. Kompletiraj log i ukupan budžet sa stvarnom potrošnjom ili `nije dostupno`. Commit: `docs: dokazi i predaja za sesiju 004`.

---

## Definition of Done — Deo A

- [ ] Završeni Koraci 1–8; ukupno najviše 240 minuta uključujući ručni rad, ili je iskreno dokumentovan bloker umesto lažnog „gotovo“.
- [ ] `npm run typecheck && npm test && npm run eval && npm run build` prolazi na završnom stanju A; stvarni izlaz je `docs/runs/week3-checks.txt`.
- [ ] `git rev-parse baseline` i `git rev-parse after-fix` daju sačuvane hash-eve; oba taga ostaju nepromenjena.
- [ ] `git diff baseline after-fix -- src/` prikazuje samo ciljanu popravku; `git diff baseline after-fix -- tests/ evals/ src/game/types.ts` je prazan.
- [ ] Postoje originalni prompt, manifest, baseline screenshot/startup output, početni testovi, isti eval-i pre/posle, hipoteza i ograničenje.
- [ ] `docs/EVIDENCE_003.md`, `docs/EVALS.md`, `docs/AI_USAGE_LOG.md`, `docs/BUILD_PROMPT_FINAL.md` sadrže stvarne podatke i oba doprinosa.
- [ ] `npm run dev` omogućava sve kontrole, jelo, rast, sudare, pauzu, reset i pobedu iz ručne liste K3.
- [ ] Nevalidan i neparsabilan `?config=` prikazuju poruku i funkcionalan DEFAULT_CONFIG; bez parametra nema greške.
- [ ] CSS je jedini izvor boja; renderer ne menja igru; retina i 360px provere prošle; četiri canvas overlay-a, mreža, oči i oblik hrane postoje.
- [ ] Kontrast običnog teksta ≥4.5:1, postoje DOM status/opis i reduced motion ponašanje; ne tvrdi se potpuna pristupačnost canvas gameplay-a bez dodatnog dokaza.
- [ ] Nema AI dugmeta, panela, AI runtime koda ili mrežnog AI poziva u A. TOOL_CONTRACT i EVIDENCE_004 mogu ostati dokumenti za buduću nedelju.
- [ ] `git diff --check` i `git diff --cached --check` prolaze; završena zajednička provera tajni i screenshot-a; posle commita `git status --short` je prazan.
- [ ] Spec i instrukcije nisu promenjeni, nisu uvedene dodatne zavisnosti/feature-i; nema push-a/deploy-a.

## Definition of Done — Deo B / ceo Core

- [ ] Deo A je sačuvan; završeni Koraci 9–13 tek u Week 4.
- [ ] `npm run typecheck && npm test && npm run eval && npm run build` prolazi; stvarni izlaz je `docs/runs/week4-checks.txt`.
- [ ] Originalni testovi/tipovi/potpisi i E1–E5 nisu izmenjeni; osam dodatnih testova je odvojeno i izvršeno.
- [ ] Jedina allowlista je `get_game_state`; input, output i final odgovor validiraju se pre sledeće faze.
- [ ] T2/T3 dokazuju nula izvršenja, T1 tačne argumente/jedan poziv, T6 da nema finalnog poziva posle nevalidnog snapshot-a.
- [ ] Read-only je dokazan poređenjem stanja i mutacijom vraćenih referenci; AI ne kontroliše igru.
- [ ] Timeout/failure vraćaju SAFE_MESSAGE, bez curenja detalja; svaki timeout tajmer se čisti; nema retry petlje ili kasnog nastavka toka.
- [ ] `npm run dev` i ručna lista Koraka 12 potvrđuju fake success/failure, pauzu, čekanje, fokus, aria-live, šest režima i fallback.
- [ ] `EVIDENCE_004.md`, matrica, log, završni prompt i README kompletni; `hint-success.png`, `hint-timeout.png`, `ai-test-matrix.txt` postoje i sadrže stvarne rezultate.
- [ ] Nula live poziva i jasna izjava da live provider nije testiran; fake prihvaćen Core put.
- [ ] Najviše 15 značajnih AI iteracija ukupno sa planiranjem i popravkama; nema paralelnih agenata.
- [ ] Oba člana mogu ponoviti dokaze i objasniti doprinos; demo traje 6–7 minuta.
- [ ] Ponovljena zajednička provera tajni; `git diff --check`, `git diff --cached --check` prolaze i završni `git status --short` je prazan.

## Rizici i ublažavanje

| Rizik | Ublažavanje / granica dokaza |
|---|---|
| Četiri sata A potroše setup ili neplanirane greške | Rezerva 50 min, samo odobrene zavisnosti, jedan korak po pozivu; posle tri ista neuspeha ili oko 20 min precizan bloker. Ne izbacivati obaveznu evidenciju. |
| Model preventivno ukloni E4 pre baseline-a | Dati samo K2 tokom logike i sačuvati stvaran rezultat; ne podmetati bug. Ako E4 ipak prođe, prijaviti i izabrati stvaran problem uz odluku korisnika. |
| Vizuelna promena zamagli eksperiment jedne promene | `baseline` i `after-fix` pre dizajna; K5 menja samo logic.ts; posle njega zaseban vizuelni commit. |
| Plan se sukobi sa uskim listama starih koraka | Korisnik šalje odobreni tekući korak kao dopunu starom K; proširenja dozvola eksplicitna; bez menjanja testova/spec-a. |
| Node/package kompatibilnost ili različiti rezultati verzija | Provera engine-a i stvarnih verzija pri setup-u, commit lockfile-a; dalje `npm ci` za ponovljivo instaliranje. Bez oportunističkih upgrade-a. |
| `tee` sakrije status komande | Sve dokazne cevi koriste `bash -o pipefail -c`; baseline eval pad se beleži kao podatak, ne maskira. |
| DPR resetuje canvas podešavanja ili uvećava transform svake slike | Bitmap dimenzije samo kad se promene; zatim apsolutni setTransform i smoothing=false; proveriti DPR 1/2 i promenu širine. |
| `imageSmoothingEnabled=false` samo po sebi nije dovoljno za oštre pravougaonike | Poravnati ivice na fizičke piksele i kontrolisati CSS/intrinsic veličine; bez CSS transform skaliranja. |
| Canvas tekst nije dostupan screen reader-u | Vidljivi DOM status, kontrole i canvas opis; AI savet u live regionu. Ne tvrditi potpun WCAG conformance cele igre. |
| Space na AI dugmetu istovremeno pokrene/pauzira igru | Ne presretati nativni button input u globalnom game handleru; pending blokira samo game komande; ručna keyboard provera. |
| Pozni AI rezultat menja stanje ili nastavi lanac posle timeout-a | Await sa timeout granicom po fazi, bez `.then` grane koja nezavisno izvršava alat; dodatni testovi obe timeout faze. |
| Fiksni SAFE_MESSAGE sugeriše automatski nastavak | Ne menjati ugovorni tekst; odvojeno stalno uputstvo za Space, ručno dokazati da ostaje paused. |
| Fake savet se protumači kao proverena inteligencija | Oznaka fake u UI-u/evidence-u; testovi dokazuju granice, ne kvalitet saveta. Bez obećanja bezbednog ili optimalnog poteza. |
| Sanitizovan snapshot procuri preko deljenih objekata | Alat pravi nove objekte; flow dobija kopiju stanja; test mutacije snapshot-a i state equality. |
| Secret grep ima lažno pozitivne nalaze iz dokumentacije ili propusti drugi format tajne | Pregled svih nalaza i staged sadržaja/screenshot-a, uz strogo odsustvo `.env`; ne predstavljati substring pretragu kao potpunu bezbednosnu garanciju. |
| Raniji referentni testovi budu navedeni kao lokalni | Jasno odvojiti poreklo; sva polja PASS/FAIL, broj testova i izlazi popunjavaju se tek posle lokalnog izvršavanja. |
| Budžet AI poziva se troši na ponavljanje već zelenih provera | Devet planiranih implementacionih zadataka; ručni evidence/log; dodatne iteracije samo uz konkretan neuspeh i signal. |

## Van scope-a

- Backend, baza, deploy, hosting, autentikacija, nalozi, multiplayer i leaderboard.
- Čuvanje rekorda, uključujući localStorage; dodatne postavke ili config editor.
- Touch/mobilne kontrole: 360px je zahtev za raspored, ne nova ulazna mehanika.
- Zvuk, muzika, spoljni fontovi/slike, preuzeti asseti/logoi i imitacija identiteta postojeće igre.
- Dekorativne animacije, dodatni nivoi, prepreke, power-up-ovi, procedural generation.
- AI igrač, protivnik ili automatsko izvršenje suggestedAction; write alat, drugi alat, autonomna petlja, retry/caching sistem.
- Live provider i originalni opcioni K11 u ovom izvršnom planu: zahtevao bi dodatne pakete i odvojenu odluku. API ključ nikad ne ide u browser, Vite env, log ili repo.
- Stretch eksperimenti iz PDF-a: prompt ablation, context reduction, dodatni holdout skup, telemetry i quality eval. Postojeći URL GameConfig ostaje obavezni strukturisani deo, bez novih config feature-a.
- Novi test framework, DOM/canvas emulator, end-to-end runner, linter, CSS framework ili biblioteka za validaciju.
- Izmena originalnih 64 test slučaja, pet eval-a, tipova/potpisa; prepisivanje referentne implementacije.
- Git push, PR, release i pomeranje postojećih tagova.

Ako se vremenska procena pokaže preoptimističnom, live i Stretch su već izostavljeni. Ne izbacivati nijedan obavezni dokaz ili zahtevani vizuelni element bez nove odluke; prijaviti konkretan bloker i utrošeno vreme. Nije pošteno označiti nepotpun Core kao završen da bi stao u procenu.

## Otvorena pitanja i podaci koji se popunjavaju pri izvršavanju

Nema preostale blokirajuće odluke za pisanje ovog plana: budžet A, dopune starih koraka, ponašanje čekanja i paleta su izričito odobreni. Sledeće vrednosti se ne izmišljaju:

- Imena oba člana para, početne uloge i stvarni doprinosi; unosi korisnik u evidence. Ako se radi samostalno, ne izmišljati partnera — tražiti odluku predavača o odstupanju od zadatka u paru.
- Stvarne instalirane verzije tri paketa i njihov lockfile; utvrđuju se u Koraku 1. Ako postoji kurs starter van ovog foldera, koristiti ga samo nakon provere da poštuje odobreni stack i skripte; ne uvoditi njegove dodatne feature-e.
- Stvarni hash-evi, rezultati, vremena, screenshot-i, model/alat i dostupna potrošnja; unose se posle izvršavanja.
- Ako lokalni baseline nema E4 pad, novi izbor stvarnog problema zahteva odluku korisnika; ne menjati postojeće E1–E5 ili namerno pokvariti kod.
- Budući live put ostaje van plana. Ako se naknadno traži, prvo razrešiti dodatne zavisnosti i Node-only bezbednu integraciju; nije dozvoljen ključ u browser-u.

## Pročitani izvori i granice ovog plana

Pri planiranju pročitani su svi postojeći fajlovi projekta (18):

- `README.md`, `AGENTS.md`.
- `.github/copilot-instructions.md`, `.github/00-index.instructions.md`.
- `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md`, `.github/instructions/03-workflow.instructions.md`, `.github/instructions/04-security.instructions.md`, `.github/instructions/05-commands.instructions.md`.
- `docs/GAME_SPEC.md`, `docs/TOOL_CONTRACT.md`, `docs/IMPLEMENTATION_STEPS.md`, `docs/BUILD_PROMPT_V1.md`, `docs/CONTEXT_MANIFEST.md`, `docs/EVALS.md`, `docs/EVIDENCE_003.md`, `docs/EVIDENCE_004.md`, `docs/AI_USAGE_LOG.md`.

Pročitan je ceo PDF `/Users/anjahubac/Desktop/week-03-week-04-retro-ai-engineering-challenge.pdf` (11 strana). U `/Users/anjahubac/Desktop/generic-instruction-files-example/` pročitani su svi traženi fajlovi (12):

- `README.md`, `.github/copilot-instructions.md`, `.github/00-index.instructions.md`.
- `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-conventions.instructions.md`, `.github/instructions/03-testing.instructions.md`, `.github/instructions/04-workflow.instructions.md`, `.github/instructions/05-security.instructions.md`, `.github/instructions/06-build-and-commands.instructions.md`, `.github/instructions/07-common-tasks.instructions.md`, `.github/instructions/08-code-review.instructions.md`, `.github/instructions/09-external-services.instructions.md`.

Generički primer korišćen je samo za odvajanje kratkih opštih pravila, rutiranja i modula. Njegovi React/Fastify/Zod, persistence, Docker, cloud, SDK, servisni i remote tokovi namerno nisu preneti: nisu tehnologija ili scope Pixel Zmije. PDF i generički primer nisu deo konteksta svakog implementacionog koraka.

Za tehničku proveru konsultovani su primarni izvori: [Vite — Getting Started](https://vite.dev/guide/), [Vitest — Getting Started](https://vitest.dev/guide/), [MDN — Optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas), [W3C — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Oni nisu novi runtime servisi niti obavezan dodatni kontekst za coding model; relevantne odluke već su zapisane u koracima.

Pri pisanju `Plan.md` nije implementirana aplikacija, instaliran paket, izvršen aplikacioni test/build/eval ili napravljen commit. Novi testovi su izvršiva specifikacija za buduće korake, a ne tvrdnja o već dobijenom rezultatu.
