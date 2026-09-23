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
