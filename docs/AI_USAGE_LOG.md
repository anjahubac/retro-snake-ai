# AI_USAGE_LOG

Kratka evidencija važnih AI poziva. Bez privatnog chain-of-thought-a, bez tajni.
Pre svakog većeg poziva: *Šta očekujem da se promeni i kojim signalom ću proveriti?*

Budžet iz zadatka: 10–15 coding-agent iteracija, 20–30 live AI poziva u razvoju,
najviše 5 live poziva na demonstraciji.

| # | Faza | Model / alat | Kontekst dat modelu | Zašto je AI pozvan | Šta se očekivalo | Rezultat | Sledeća odluka | Potrošnja (ako je prikazana) | Trajanje (ako je prikazano) |
|---|---|---|---|---|---|---|---|---|---|
| 0 | Plan | Claude Opus 5.5 (Claude Code) | PDF zadatka, razgovor o izboru igre | izbor igre, GAME_SPEC, TOOL_CONTRACT, EVALS, koraci sa testovima | plan koji slabiji model može da izvrši korak po korak | docs/ napisani; testovi iz plana provereni na privremenoj referentnoj implementaciji van repoa (64/64 testova prošlo; E4 pao na naivnoj verziji, prošao posle popravke iz Koraka 5); ta implementacija nije deo projekta | Korak 0 | | |
| 1 | Build K1 / Plan korak 2 | Codex (tačan model nije prikazan) | Svi repo Markdown fajlovi (izričito traženi); K1, Plan korak 2, `GAME_SPEC.md`, M1, M2, postojeći `package.json`, `tsconfig.json`, `src/main.ts` | runtime validacija config-a prema postojećem ugovoru | Tačni tipovi, granice, fallback, nepromenjeni testovi, `npm run typecheck && npm test` | `src/game/types.ts` i `src/game/config.ts` implementirani; postojeći K1 test tačno prepisan; izlaz: 14 testova passed, typecheck passed | commit `8c52dd8` napravljen po izričitom zahtevu korisnika | nije dostupno | nije dostupno |
| 2 | Build K2 / Plan korak 3 | Codex (tačan model nije prikazan) | K2 iz `docs/IMPLEMENTATION_STEPS.md`, `GAME_SPEC.md`, `src/game/types.ts`, `src/game/config.ts`, `.github/copilot-instructions.md`, `.github/instructions/01-architecture.instructions.md`, `.github/instructions/02-testing.instructions.md` | implementacija determinističke čiste logike igre | Sve funkcije iz K2, neizmenjeni testovi, `npm run typecheck && npm test` | `src/game/logic.ts` implementiran; K2 test tačno prepisan; typecheck prošao; 31 test passed | commit `675fd58`; sledeći je K3 Canvas | nije dostupno | nije dostupno |
| 3 | Build K3 / Plan korak 4 | Codex (tačan model nije prikazan) | K3 iz `docs/IMPLEMENTATION_STEPS.md`, Korak 4 iz `Plan.md`, `GAME_SPEC.md`, `index.html`, `src/style.css`, `src/main.ts`, `src/game/types.ts`, `src/game/config.ts`, `src/game/logic.ts`, M1, M4 | povezivanje čiste logike sa Canvas-om, tastaturom i osnovnim HUD-om | Tačan K3 renderer i game loop, sigurno učitavanje config-a, propisana izlazna komanda | typecheck prošao; 31 test passed; build prošao; HTTP smoke test vraća HTML i JS. RUČNA UI lista nije izvršena: browser runtime prijavio da nijedan browser nije dostupan. | K3 automatizovane provere su prošle; stvarni browser review i screenshot nedostaju zbog nedostupnog browser-a. Commit `cd76dfe`. | nije dostupno | nije dostupno |
| 4 | Fix K5 / Plan korak 6 | Codex (tačan model nije prikazan) | K5 iz `docs/IMPLEMENTATION_STEPS.md`, Korak 6 iz `Plan.md`, `src/game/logic.ts`, `src/game/types.ts`, `src/game/config.ts`, `tests/logic.test.ts`, `evals/evals.test.ts`, `docs/EVIDENCE_003.md`, `docs/runs/eval-baseline.txt`, M2, M3 | popravka stvarne baseline E4 greške | Samo `changeDirection` poredi smer sa fizičkim smerom izvedenim iz glave i vrata; typecheck, 31 unit testa, isti eval | 31 unit test i 5/5 eval-a prošli; commit `75635b3`, tag `after-fix`; diff dodiruje samo `src/game/logic.ts` | K7 vizuelni polishing; K3 ručna UI provera i baseline screenshot i dalje nedostaju zbog nedostupnog browser-a | nije dostupno | nije dostupno |
| 5 | Build A5 / Plan korak 7 — vizuelni sloj | Codex (tačan model nije prikazan) | Korak 7 iz `Plan.md`, K3 renderer API, `GAME_SPEC.md`, `index.html`, `src/style.css`, `src/render.ts`, `src/main.ts`, `src/game/types.ts`, M1, M4 | originalan pixel prikaz, responsivnost i pristupačnost bez promene logike | Tačna CSS paleta kao jedini izvor boja, retina Canvas, HUD/overlay, dostupne tekstualne informacije; kompletne lokalne komande | 31 unit test, 5 eval-a, typecheck i build prošli; kontrast: text/page 17.22:1, text/panel 14.51:1, muted/panel 7.89:1, accent/panel 10.47:1, success/panel 10.69:1, error/panel 7.35:1. Browser ručne provere nisu izvršene jer nijedan browser nije dostupan. | K8 evidence; potrebni su browser screenshot-i i stvarne viewport/DPR/gameplay provere | nije dostupno | nije dostupno |
| 6 | Build B1 / Plan korak 9 | Codex (tačan model nije prikazan) | K6 iz `docs/IMPLEMENTATION_STEPS.md`, Korak 9 iz `Plan.md`, `docs/TOOL_CONTRACT.md`, `src/game/types.ts`, postojeći AI fajlovi (nijedan), M1, M2, M4 | definisanje i validacija AI granice bez izvršavanja alata | Tačni AI tipovi, validacija tool call/snapshot/final, postojeći K6 test i novi boundary test, `npm run typecheck && npm test` | typecheck prošao; 4 test fajla, 54 testa prošla. Nema provider-a, mreže ni UI integracije. | Sledeći Korak 10: read-only get_game_state alat | nije dostupno | nije dostupno |
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
