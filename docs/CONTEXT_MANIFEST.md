# CONTEXT_MANIFEST

Coding agent u svakom koraku dobija **samo** fajlove iz sekcije „Kontekst“ tog
koraka u `IMPLEMENTATION_STEPS.md`. Ova tabela objašnjava zašto.

| Izvor | Uključen? | Zašto? | Prioritet | Rizik |
|---|---|---|---|---|
| `docs/GAME_SPEC.md` | Da, uvek | Pravila, scope, DoD | 2 (posle zahteva korisnika) | Nizak |
| `docs/TOOL_CONTRACT.md` | Da, samo koraci 6–9 | Granica AI alata | 3 | Nizak |
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
Ako agent primeti konflikt, staje i prijavljuje ga umesto da bira sam.

## Eksperiment (Stretch, opciono)

Isti korak (npr. Korak 8) se pokrene dva puta na čistoj grani: (a) samo sa
`copilot-instructions.md`, (b) sa modulima iz rutiranja. Porede se pretpostavke,
preskočene provere i rezultat izlazne komande. Upis u `AI_USAGE_LOG.md`.
