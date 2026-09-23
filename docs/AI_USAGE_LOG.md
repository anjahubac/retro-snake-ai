# AI_USAGE_LOG

Kratka evidencija važnih AI poziva. Bez privatnog chain-of-thought-a, bez tajni.
Pre svakog većeg poziva: *Šta očekujem da se promeni i kojim signalom ću proveriti?*

Budžet iz zadatka: 10–15 coding-agent iteracija, 20–30 live AI poziva u razvoju,
najviše 5 live poziva na demonstraciji.

| # | Faza | Model / alat | Kontekst dat modelu | Zašto je AI pozvan | Šta se očekivalo | Rezultat | Sledeća odluka | Potrošnja (ako je prikazana) | Trajanje (ako je prikazano) |
|---|---|---|---|---|---|---|---|---|---|
| 0 | Plan | Claude Opus 5.5 (Claude Code) | PDF zadatka, razgovor o izboru igre | izbor igre, GAME_SPEC, TOOL_CONTRACT, EVALS, koraci sa testovima | plan koji slabiji model može da izvrši korak po korak | docs/ napisani; testovi iz plana provereni na privremenoj referentnoj implementaciji van repoa (64/64 testova prošlo; E4 pao na naivnoj verziji, prošao posle popravke iz Koraka 5); ta implementacija nije deo projekta | Korak 0 | | |
| 1 | Build K1 / Plan korak 2 | Codex (tačan model nije prikazan) | Svi repo Markdown fajlovi (izričito traženi); K1, Plan korak 2, `GAME_SPEC.md`, M1, M2, postojeći `package.json`, `tsconfig.json`, `src/main.ts` | runtime validacija config-a prema postojećem ugovoru | Tačni tipovi, granice, fallback, nepromenjeni testovi, `npm run typecheck && npm test` | `src/game/types.ts` i `src/game/config.ts` implementirani; postojeći K1 test tačno prepisan; izlaz: 14 testova passed, typecheck passed | commit `8c52dd8` napravljen po izričitom zahtevu korisnika | nije dostupno | nije dostupno |
| 2 | Build K2 / Plan korak 3 | Codex (tačan model nije prikazan) | K2 iz `docs/IMPLEMENTATION_STEPS.md`, `GAME_SPEC.md`, `src/game/types.ts`, `src/game/config.ts`, `.github/copilot-instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md` | implementacija determinističke čiste logike igre | Sve funkcije iz K2, neizmenjeni testovi, `npm run typecheck && npm test` | `src/game/logic.ts` implementiran; K2 test tačno prepisan; typecheck prošao; 31 test passed | commit `feat: cista logika zmije`; sledeći je Plan korak 4 (Canvas) | nije dostupno | nije dostupno |
| 3 | Build K3 / Plan korak 4 | Codex (tačan model nije prikazan) | K3 iz `docs/IMPLEMENTATION_STEPS.md`, Korak 4 iz `Plan.md`, `GAME_SPEC.md`, `index.html`, `src/style.css`, `src/main.ts`, `src/game/types.ts`, `src/game/config.ts`, `src/game/logic.ts`, M1, M4 | povezivanje čiste logike sa Canvas-om, tastaturom i osnovnim HUD-om | Tačan K3 renderer i game loop, sigurno učitavanje config-a, propisana izlazna komanda | typecheck prošao; 31 test passed; build prošao; HTTP smoke test vraća HTML i JS. RUČNA UI lista nije izvršena: browser runtime prijavio da nijedan browser nije dostupan. | baseline E4 potvrđen; screenshot/K3 UI checklist ostaju RUČNO zbog nedostupnog browser-a. Sledeće: K5 minimalna ispravka, pa K7 vizuelni korak. | nije dostupno | nije dostupno |
| 4 | Fix K5 / Plan korak 6 | Codex (tačan model nije prikazan) | K5 iz `docs/IMPLEMENTATION_STEPS.md`, Korak 6 iz `Plan.md`, `src/game/logic.ts`, `src/game/types.ts`, `src/game/config.ts`, `tests/logic.test.ts`, `evals/evals.test.ts`, `docs/EVIDENCE_003.md`, `docs/runs/eval-baseline.txt`, M2, M3 | popravka stvarne baseline E4 greške | Samo `changeDirection` poredi smer sa fizičkim smerom izvedenim iz glave i vrata; typecheck, 31 unit testa, isti eval | 31 unit test i 5/5 eval-a prošli; commit `75635b3`, tag `after-fix`; diff dodiruje samo `src/game/logic.ts` | K7 vizuelni polishing; K3 ručna UI provera i baseline screenshot i dalje nedostaju zbog nedostupnog browser-a | nije dostupno | nije dostupno |
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
- Prvi `git init` pokušaj odbijen je sa `Operation not permitted`; posle zahteva dozvole `git init` je uspešno kreirao lokalni repo na `main`. Setup commit i K1 commit su potom napravljeni po izričitom zahtevu korisnika; tagovi se još nisu pravili.
- Model/tokens/time za setup: ovo je bila ručna priprema, ne zaseban coding-agent poziv; tačan model prikazan u korisničkom UI-ju, potrošnja i trajanje nisu dostupni ovom agentu.
- Setup je pripremljen kao RUČNI korak; kod i dokumentacija su zatim evidentirani u commitovima nakon korisničkog zahteva.
