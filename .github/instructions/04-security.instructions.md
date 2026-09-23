---
description: 'Granica AI alata, validacija, tajne i bezbedan prikaz.'
applyTo: 'src/ai/**,src/main.ts,scripts/**'
---

# Bezbednost

## Granice poverenja

| Ulaz | Verujemo? | Gde se proverava |
|---|---|---|
| `?config=` iz URL-a | Ne | `validateConfig` / `loadConfig` |
| `?ai=` iz URL-a | Ne | allowlista `FAKE_MODES`, inače `"success"` |
| Predlog tool poziva od modela | Ne | `validateToolCall` (allowlista + tačni argumenti) |
| Izlaz alata | Ne | `validateSnapshot` |
| Finalni odgovor modela | Ne | `validateHintResponse` |

## AI alat

- Allowlista ima tačno jedan alat: `get_game_state`. Nepoznat alat → ništa se
  ne izvršava.
- Nevalidni argumenti (npr. `detail: "everything"`, `executeCode`) → poziv se
  odbija **pre** izvršenja alata.
- Alat je READ ONLY: ne menja score, zmiju, hranu, status ni config, ne resetuje
  igru, ne piše fajlove, ne izvršava komande, ne poziva drugi alat.
- Najviše jedan tool poziv i jedan finalni odgovor po kliku. Nema petlje.
- Alat vraća samo polja iz `docs/TOOL_CONTRACT.md`, kao nove objekte.
- Nikad se ne izvršava proizvoljan kod ili alat koji model predloži.

## Prikaz

- UI prikazuje samo `hint`, `suggestedAction`, `urgency` validnog odgovora, ili
  `SAFE_MESSAGE`.
- Uvek `textContent`, nikad `innerHTML`.
- `suggestedAction` se samo prikazuje; ne pretvara se u pritisak tastera.
- Greške se korisniku prikazuju kao `SAFE_MESSAGE`, bez stack trace-a.

## Tajne

- API ključ nikad ne ide u browser kod (Vite ga upisuje u bundle), repo,
  prompt, screenshot, evidenciju ni log.
- Live poziv je samo Node skripta koja čita `ANTHROPIC_API_KEY` iz okruženja.
- `.env` i `.env.*` su u `.gitignore`.
- Provera pre predaje: `git grep -i -e "sk-ant" -e "api_key="` mora biti prazno.
