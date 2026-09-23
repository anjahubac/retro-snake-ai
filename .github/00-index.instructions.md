---
description: 'Indeks i rutiranje za AI instrukcije projekta Pixel Zmija.'
applyTo: '**/*'
---

# Indeks instrukcija — Pixel Zmija

## Svrha

Za svaki zadatak otvori najmanji skup modula koji ga pokriva. Više konteksta
nije bolji kontekst: čitaj samo ono što tabela ispod navodi.

## Moduli

1. [01-architecture](instructions/01-architecture.instructions.md): slojevi,
   ko sme koga da importuje, tok podataka, autoritet nad stanjem.
2. [02-testing](instructions/02-testing.instructions.md): Vitest, testovi
   iz plana, eval skup, šta se smatra dokazom.
3. [03-workflow](instructions/03-workflow.instructions.md): jedan korak,
   commit, baseline, hipoteza, evidencija.
4. [04-security](instructions/04-security.instructions.md): granica AI alata,
   validacija, tajne, prikaz u UI.
5. [05-commands](instructions/05-commands.instructions.md): podržane komande
   i šta koja proverava.

## Rutiranje

| Zadatak | Prvo pročitaj | Obično još |
|---|---|---|
| GameConfig / validacija (Korak 1) | Arhitektura | Testiranje |
| Pravilo igre, `tick`, sudar, hrana (Korak 2) | Arhitektura | Testiranje |
| Canvas, tastatura, `main.ts` (Korak 3) | Arhitektura | Bezbednost (samo `textContent`) |
| Baseline i eval (Korak 4) | Tok rada | Testiranje, komande |
| Hipoteza i jedna promena (Korak 5) | Tok rada | Testiranje |
| AI tipovi, validatori, alat, hint flow (Koraci 6–8) | Bezbednost | Arhitektura, testiranje |
| Dugme „Ask AI for Hint“ (Korak 9) | Bezbednost | Arhitektura |
| Evidencija, log, README (Korak 10) | Tok rada | Komande |
| Live provider (Korak 11) | Bezbednost | Komande |
| Commit ili predaja | Tok rada | — |

Uz module, agent uvek dobija `docs/GAME_SPEC.md` i tekući korak; u Koracima 6–9
i `docs/TOOL_CONTRACT.md`. Zašto baš to: `docs/CONTEXT_MANIFEST.md`.

## Osnova repozitorijuma

- Node.js 20+, TypeScript (strict), npm.
- Vite za browser, Vitest za testove, `<canvas>` za prikaz.
- Nema backend-a, baze, deploy-a ni naloga.

## Održavanje

- Kad se pravilo promeni, menja se **jedan**, najuži modul; pravilo se ne
  kopira u više fajlova.
- Instrukcije opisuju stvarni repo, ne željeno stanje.
- Zadatak i kriterijumi prihvatanja su u `docs/`, ne u ovim fajlovima.
