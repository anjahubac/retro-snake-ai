# BUILD_PROMPT_V1

Ovaj prompt se koristi za baseline (Koraci 1–3). Za svaki korak se šalje
posebno, sa brojem koraka upisanim umesto `<N>`. Ne menja se posle baseline-a;
poboljšana verzija ide u `BUILD_PROMPT_FINAL.md`.

---

```
Pre implementacije:
1. Sažmi razumevanje zadatka.
2. Navedi plan u nekoliko koraka.
3. Navedi nejasnoće ili pretpostavke.
4. Ne proširuj scope bez eksplicitnog razloga.

ULOGA
Ti si coding agent koji implementira jedan mali, unapred isplaniran korak
TypeScript browser igre. Ne dizajniraš igru; ona je već specificirana.

CILJ I OČEKIVANI REZULTAT
Implementiraj Korak <N> iz docs/IMPLEMENTATION_STEPS.md. Rezultat je kod koji
prolazi "Izlaznu komandu" tog koraka, i stvarni izlaz te komande nalepljen
u odgovoru.

GRANICE (ne smeš)
- menjati fajlove van liste "Dozvoljeni fajlovi" za Korak <N>
- dodavati zavisnosti, backend, bazu, login, leaderboard, zvuk, nivoe
- menjati, brisati, preskakati ili slabiti testove
- raditi Korak <N+1>
- upisivati API ključeve ili tajne bilo gde

TEHNIČKI KONTEKST I FAJLOVI
Vite + TypeScript (strict) + Vitest, prikaz na <canvas>, bez backend-a.
Logika igre je u čistim funkcijama u src/game/ (bez DOM-a, bez Math.random:
RNG se prosleđuje kao parametar). DOM i canvas su samo u src/main.ts i
src/render.ts. Pročitaj: .github/copilot-instructions.md, docs/GAME_SPEC.md,
sekciju Koraka <N> u docs/IMPLEMENTATION_STEPS.md i fajlove i module iz
njegove sekcije "Kontekst" (izbor modula: .github/00-index.instructions.md).

GAMEPLAY PRAVILA
Pravila 1–8 iz docs/GAME_SPEC.md. Ako se kod i spec razlikuju, spec ima
prednost.

DEFINITION OF DONE ZA OVAJ KORAK
"Izlazna komanda" Koraka <N> prolazi. Za Korak 3 i ručna provera iz koraka.

DOZVOLJENI FAJLOVI
Tačno oni navedeni u Koraku <N>.

PROVERE KOJE MORAŠ DA IZVRŠIŠ
Izlazna komanda Koraka <N>. Nalepi stvarni izlaz. Ako padne, popravi kod
(ne test) najviše 3 puta, pa stani i prijavi: cilj, očekivano, dobijeno,
šta si proverio, precizno pitanje.

NEJASNOĆE
Ako je nešto nejasno ili se izvori razlikuju, navedi to pre izmene i izaberi
najjednostavnije tumačenje u skladu sa GAME_SPEC. Ne proširuj scope.
```


---

# Stvarno korišćene dopune za implementaciju

Ovaj fajl čuva V1 neizmenjen kao istorijsku osnovu. Svaki coding zadatak je
ograničen tekućim Plan.md korakom, originalnim K1/K2/K3 kada je primenljivo,
zatvorenom listom dozvoljenih fajlova i kontekstom usmerenim prema
`.github/00-index.instructions.md`. Plan koraka i AI_USAGE_LOG.md čuvaju stvarne
module i fajlove po iteraciji.

## Dopune za Week 3

- Koraci A1–A3 su sprovedeni zasebno uz tipove i potpise iz postojećih
  ugovora; postojeći testovi nisu menjani osim što su test fajlovi iz originalnog
  plana tačno dodati.
- Deo A nema AI dugme, AI panel, `src/ai/` implementaciju niti AI mrežni poziv.
- A4/K5 je koristio samo potvrđeni E4 baseline signal i menjao samo
  `src/game/logic.ts`; nije promenio prompt, šemu, testove ili eval očekivanja.
- A5 je bio odvojena vizuelna promena posle taga `after-fix`, u rendereru,
  CSS-u i HTML-u.
- Lokalni typecheck, unit testovi, eval i build su zeleni. Browser interakcije,
  viewport/DPR i screenshot dokazi nisu provereni zbog nedostupnog browser-a.

## Dopune za Week 4

- Week 4 implementacija se nastavlja zasebnim plan koracima 9–13, sa
  `docs/TOOL_CONTRACT.md`, fake klijentom, runtime validacijom i test matrix.
- Nula live poziva; nema browser API ključa. Live provider ostaje van scope-a.
- Svaki korak koristi samo vlastitu zatvorenu listu fajlova i module koje navodi
  rutiranje; ne uključuje PDF u coding kontekst.
- Nema prompt-ablation eksperimenta.


## Stvarno sprovedene Week 4 dopune

- B1: AI tipovi i validatori za tool proposal, summary/tactical snapshot i
  finalni HintResponse; tačni K6 i dodatni boundary testovi. Kontekst: security,
  architecture, testing, TOOL_CONTRACT, game types.
- B2: jedini read-only `get_game_state` snapshot, kopirani head/food/danger;
  exact output tests, bez DOM-a i bez poziva game mutatora.
- B3: lokalni `createFakeClient` i `requestHint`; jedan proposal, validacija pre
  alata, `structuredClone` stanja, jedan read-only poziv, validacija output-a i
  finala, odvojeni timeout-i i safe errors. Nema live request-a.
- B4: `?ai=` fake-mode UI, pauza samo ako igra radi, disabled/pending state,
  fokus i keyboard zaštita, accessible live region, safe text render. `main.ts`
  pokazuje samo validan HintResponse ili SAFE_MESSAGE; ne izvršava akciju.
- K13 evidence navodi lokalne fake rezultate i manual UI review kao odvojen
  dokaz koji nije dostupan ovom coding okruženju.
