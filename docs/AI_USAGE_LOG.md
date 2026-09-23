# AI_USAGE_LOG

Kratka evidencija važnih AI poziva. Bez privatnog chain-of-thought-a, bez tajni.
Pre svakog većeg poziva: *Šta očekujem da se promeni i kojim signalom ću proveriti?*

Budžet iz zadatka: 10–15 coding-agent iteracija, 20–30 live AI poziva u razvoju,
najviše 5 live poziva na demonstraciji.

| # | Faza | Model / alat | Kontekst dat modelu | Zašto je AI pozvan | Šta se očekivalo | Rezultat | Sledeća odluka | Potrošnja (ako je prikazana) | Trajanje (ako je prikazano) |
|---|---|---|---|---|---|---|---|---|---|
| 0 | Plan | Claude Opus 5.5 (Claude Code) | PDF zadatka, razgovor o izboru igre | izbor igre, GAME_SPEC, TOOL_CONTRACT, EVALS, koraci sa testovima | plan koji slabiji model može da izvrši korak po korak | docs/ napisani; testovi iz plana provereni na privremenoj referentnoj implementaciji van repoa (64/64 testova prošlo; E4 pao na naivnoj verziji, prošao posle popravke iz Koraka 5); ta implementacija nije deo projekta | Korak 0 | | |
| 1 | Build K1 / Plan korak 2 | Codex (tačan model nije prikazan) | Svi repo Markdown fajlovi (izričito traženi); K1, Plan korak 2, `GAME_SPEC.md`, M1, M2, postojeći `package.json`, `tsconfig.json`, `src/main.ts` | runtime validacija config-a prema postojećem ugovoru | Tačni tipovi, granice, fallback, nepromenjeni testovi, `npm run typecheck && npm test` | `src/game/types.ts` i `src/game/config.ts` implementirani; postojeći K1 test tačno prepisan; izlaz: 14 testova passed, typecheck passed | Korak 3; commit pravi korisnik prema repo uputstvu | nije dostupno | nije dostupno |
| 2 | Build K2 | | | | | | | | |
| 3 | Build K3 | | | | | | | | |
| 4 | Fix K5 | | | | | | | | |
| 5 | AI K6 | | | | | | | | |
| 6 | AI K7 | | | | | | | | |
| 7 | AI K8 | | | | | | | | |
| 8 | AI K9 | | | | | | | | |

## RUČNA priprema A0

- Datum: 2026-09-23.
- Node.js: `v26.8.1`; npm: `11.19.0`.
- Pokrenuto `npm i -D typescript vite vitest`: prošlo; 39 paketa dodato, 40 provereno, 0 prijavljenih ranjivosti.
- `npm run typecheck`: prošlo uz privremeni `src/main.ts` iz K0.
- `npm ls --depth=0`: TypeScript `7.0.2`, Vite `8.3.0`, Vitest `5.0.1`.
- Prvi `git init` pokušaj odbijen je sa `Operation not permitted`; posle zahteva dozvole `git init` je uspešno kreirao lokalni repo na `main`. Repo još nema commit ni tag. Korisnik pravi commit prema repo uputstvu.
- Model/tokens/time za setup: ovo je bila ručna priprema, ne zaseban coding-agent poziv; tačan model prikazan u korisničkom UI-ju, potrošnja i trajanje nisu dostupni ovom agentu.
- Sledeće: korisnik pregleda i pravi RUČNI setup commit, zatim sledeća AI iteracija nastavlja `Plan.md` Korak 3. Ne kreirati prazan ili tuđi commit.
