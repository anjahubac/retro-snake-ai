# CONTEXT_MANIFEST

Coding agent u svakom koraku dobija **samo** fajlove iz sekcije „Kontekst“ tog
koraka u `IMPLEMENTATION_STEPS.md`. Ova tabela objašnjava zašto.

Za novi rad prvo se bira aktivni R zadatak na početku tog dokumenta.
Aktivna revizija `Plan.md` daje prioritete i predloge; stari A/B koraci se
čitaju samo kada ih tekući zadatak navodi. Rokovi u starom planu nisu
aktivni raspored. R0 je dokumentacioni pregled, bez implementacije R1–R4.

| Izvor | Uključen? | Zašto? | Prioritet | Rizik |
|---|---|---|---|---|
| `docs/GAME_SPEC.md` | Da, uvek | Pravila, scope, DoD | 2 (posle zahteva korisnika) | Nizak |
| `docs/TOOL_CONTRACT.md` | Da, koraci 6–9 i R4; novi game zadatak samo ako navodi izmenu AI ugovora | Granica AI alata | 3 | Nizak |
| `docs/IMPLEMENTATION_STEPS.md` (samo tekući korak) | Da | Šta se radi sada, dozvoljeni fajlovi, testovi | 4 | Srednji: agent može da pređe na sledeći korak; zato samo tekući |
| Postojeći kod iz „Dozvoljeni fajlovi“ i fajlovi koje oni importuju | Da | Da agent ne izmisli API | 7 | Nizak |
| `.github/copilot-instructions.md` | Da, uvek | Kratka pravila koja uvek važe | 6 | Nizak |
| `Plan.md` | Da, samo tekući korak i zajedničke procedure | Dopunjuje odobrene korake; AI korak, dozvoljeni fajlovi, testovi i granice | Izvorni prioriteti važe; odobrene dopune imaju prioritet nad delovima starih koraka koje eksplicitno menjaju | Čitanje budućih koraka može proširiti scope; zato se prosleđuje samo tekući korak |
| `.github/instructions/*` moduli | Samo oni iz „Kontekst“ tekućeg koraka (rutiranje: `.github/00-index.instructions.md`) | Arhitektura, testiranje, bezbednost... bez ostatka | 5 | Srednji: previše modula = šum; zato rutiranje |
| PDF zadatka (Retro AI Engineering Challenge) | Ne | Dugačak; relevantni zahtevi su već prepisani u GAME_SPEC i TOOL_CONTRACT | — | Šum, troši tokene |
| Stari chat transkripti (uključujući razgovor u kom je nastao plan) | Ne | Nisu autoritativni; odluke su zapisane ovde | — | Konflikt sa spec-om |
| Primeri Snake igara sa weba | Ne | Nisu potrebni; druga pravila i stil | — | Šum, kopiranje asseta |
| Drugi projekti (npr. `zanimljiva-geografija-live`) | Ne | Nepovezan domen | — | Konflikt pravila |
| `node_modules/`, `dist/`, `package-lock.json` | Ne | Generisano | — | Troši tokene |
| `.env` / API ključevi | **Nikad** | Tajne | — | Curenje ključa |

## Odgovori

**Šta je model stvarno dobio?** Tekući korak, GAME_SPEC, (u AI koracima)
TOOL_CONTRACT, `.github/copilot-instructions.md`, module iz rutiranja i
fajlove iz liste tog koraka. Tačnu listu po pozivu
beležimo u `AI_USAGE_LOG.md`.

**Šta je namerno izostavljeno?** PDF zadatka, transkripti, web primeri, drugi
repoi, generisani fajlovi i tajne. Razlog je u tabeli.

**Koji izvor ima prioritet kad se razlikuju?**
zahtev korisnika > `GAME_SPEC.md` > `TOOL_CONTRACT.md` > tekući korak >
numerisani modul > `copilot-instructions.md` > postojeći kod (isto kao u `.github/copilot-instructions.md`).
Izričita korisnička revizija važi u svom scope-u; već odobrena odluka se ne
traži ponovo. Nerešen konflikt se prijavljuje pre zavisne izmene.

## Eksperiment (Stretch, opciono)

Isti korak (npr. Korak 8) se pokrene dva puta na čistoj grani: (a) samo sa
`copilot-instructions.md`, (b) sa modulima iz rutiranja. Porede se pretpostavke,
preskočene provere i rezultat izlazne komande. Upis u `AI_USAGE_LOG.md`.


## Kontekst planiranja

Revizija R0 od 2026-09-23 koristi lokalni plan, korake/spec, rutiranje, M3/M5,
manifest, postojeću evidenciju i UI izvorne fajlove za pregled stvarnog
stanja. Nisu potrebni stari PDF, privatni fajlovi ili ponovno čitanje svih
modula. Javne W3C smernice služe za predlog pristupačnosti u `Plan.md`,
ne kao dokaz testiranja aplikacije. Ovo je poseban planerski kontekst;
R1 i naredni zadaci koriste samo svoje zatvorene liste.

Planiranje je koristilo zadati izazov/PDF i sva tada postojeća projektna
Markdown dokumenta, zatim traženi primer generičkih instructions. Ovaj široki
čitalački kontekst bio je samo za planiranje; PDF i primer nisu prosleđivani
u svakom implementacionom pozivu.

## Kontekst implementacije

Stvarni per-iteration kontekst je evidentiran u `AI_USAGE_LOG.md`. Ukratko:
K1 — K1, GAME_SPEC, M1/M2 i početni project setup; K2 — K2, GAME_SPEC, tipovi/config
i M1/M2; K3 — K3, GAME_SPEC, index/style/main/types/config/logic i M1/M4; K5 —
K5 hipoteza, game kod/testovi/eval i baseline izlaz uz M2/M3; K7 — odobreni
vizuelni korak, renderer API, GAME_SPEC, tri UI/render fajla i M1/M4. Za Week 4
se koristi samo kontekst u Koracima 9–13, uključujući TOOL_CONTRACT i security
modul. Na korisnikov kasniji izričit zahtev nastavljen je i Deo B; prvobitni
raspored u ovom manifestu odražavao je plan „ne ove nedelje“. Nisu prosleđivani privatni URL-ovi, tajne, spoljni game primeri ili ceo
PDF po implementacionom koraku.

Zaštita tajni i generisanih fajlova: `.gitignore` isključuje `node_modules`,
`dist`, `.env` i `.env.*`; završna predajna provera se čuva u K13 evidence.
