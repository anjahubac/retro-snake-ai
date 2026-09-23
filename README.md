# Pixel Zmija

Snake-inspired browser igra sa jednom kontrolisanom AI funkcijom („Ask AI for Hint“)
za SITA AI Bootcamp 2026, Retro AI Engineering Challenge.

## Komande

```bash
npm install
npm run dev        # igra u browseru
npm test           # unit testovi + AI test matrix
npm run eval       # eval skup E1–E5
npm run typecheck
npm run build
```

Demo URL parametri: `?config={"gridSize":12,"tickMs":120,"startLength":3,"winScore":10}`,
`?ai=success|invalid_args|unsupported_tool|timeout|provider_error|malformed_final`.

## Gde je šta

| Fajl | Sadržaj |
|---|---|
| `docs/GAME_SPEC.md` | scope, pravila, Definition of Done |
| `docs/IMPLEMENTATION_STEPS.md` | koraci za coding agenta, sa testovima |
| `docs/BUILD_PROMPT_V1.md` | prvi prompt (baseline) |
| `docs/CONTEXT_MANIFEST.md` | šta model dobija, a šta ne |
| `docs/EVALS.md` | eval skup i AI test matrix |
| `docs/TOOL_CONTRACT.md` | ugovor za `get_game_state` |
| `docs/EVIDENCE_003.md`, `docs/EVIDENCE_004.md` | dokazi |
| `docs/AI_USAGE_LOG.md` | evidencija AI poziva |
| `.github/copilot-instructions.md` | pravila koja uvek važe za AI agenta |
| `.github/00-index.instructions.md` | rutiranje: koji modul za koji zadatak |
| `.github/instructions/` | moduli: arhitektura, testiranje, tok rada, bezbednost, komande |
| `AGENTS.md`, `CLAUDE.md` | ulazne tačke koje upućuju na `.github/` |
