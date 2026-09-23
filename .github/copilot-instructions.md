# Pixel Zmija — pravila za AI coding agenta

## Svrha

Kratka pravila koja važe za svaki zadatak. Detalji su u modulima; za zadatak
otvori samo module koje navodi `.github/00-index.instructions.md` ili sekcija
„Kontekst“ tekućeg koraka.

## Prioritet izvora

1. Zahtev korisnika.
2. `docs/GAME_SPEC.md`.
3. `docs/TOOL_CONTRACT.md`.
4. Tekući korak iz `docs/IMPLEMENTATION_STEPS.md`.
5. Relevantan numerisani modul iz `.github/instructions/`.
6. Ovaj fajl.
7. Postojeći kod.

Izričita korisnička revizija menja samo navedeni scope. Primeni već odobrenu
odluku i uskladi dokumente u dozvoljenom koraku; ne traži ponovo odobrenje.
Za preostali nerešeni konflikt prijavi tačnu razliku pre zavisne izmene.

## Pravila koja uvek važe

- Radiš **jedan** korak. Ne prelaziš na sledeći.
- Aktivni zadatak i njegov status traži na početku
  `docs/IMPLEMENTATION_STEPS.md`. `Plan.md` daje prioritete i predloge;
  istorijski koraci se ne ponavljaju, a predlog nije nalog za implementaciju.
- Pre izmene:
  1. Sažmi razumevanje zadatka.
  2. Navedi plan u nekoliko koraka.
  3. Navedi nejasnoće ili pretpostavke.
  4. Ne proširuj scope bez eksplicitnog razloga.
- Menjaš **samo** fajlove iz „Dozvoljeni fajlovi“ tekućeg koraka.
- Logika igre (`src/game/`) je čista: bez DOM-a, bez `Math.random`, bez tajmera.
- Igra je jedini autoritet nad stanjem. AI samo predlaže; aplikacija validira.
- Testove iz plana prepisuješ tačno i **nikad** ih ne menjaš, ne brišeš, ne
  preskačeš i ne slabiš.
- Ne dodaješ zavisnost, fajl, funkciju ili feature koji nisu u koraku.
- Nikad ne tvrdiš da je komanda prošla ako je nisi pokrenuo i video izlaz.
- Nikad ne upisuješ API ključ, token ili `.env` sadržaj bilo gde.
- Nema push-a, deploy-a ni pull request-a bez izričitog zahteva korisnika.
- Ista greška posle 3 pokušaja: stani i napiši cilj, očekivano, dobijeno,
  šta si proverio i precizno pitanje.

## Moduli

- Indeks i rutiranje: `.github/00-index.instructions.md`
- Arhitektura: `.github/instructions/01-architecture.instructions.md`
- Testiranje: `.github/instructions/02-testing.instructions.md`
- Tok rada: `.github/instructions/03-workflow.instructions.md`
- Bezbednost: `.github/instructions/04-security.instructions.md`
- Komande: `.github/instructions/05-commands.instructions.md`

## Minimum za „gotovo“

Izlazna komanda koraka prolazi, a njen stvarni izlaz je nalepljen u odgovor.
Za dokumentacioni korak dovoljne su propisane provere dokumentacije; ne
tvrditi da su aplikacioni testovi ili browser provera izvršeni ako nisu.
