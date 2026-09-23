---
description: 'Slojevi, zavisnosti i tok podataka u projektu Pixel Zmija.'
applyTo: 'src/**'
---

# Arhitektura

## Slojevi

```
src/game/    čista logika igre       — types.ts, config.ts, logic.ts
src/ai/      AI hint granica          — types.ts, validate.ts, tools.ts, fakeClient.ts, hintFlow.ts
src/render.ts  crtanje na canvas
src/main.ts    DOM, tastatura, tajmer, povezivanje svega
```

## Ko sme koga da importuje

| Sloj | Sme da importuje | Ne sme |
|---|---|---|
| `src/game/` | samo `src/game/` | DOM, `window`, `Math.random`, `Date`, `setInterval`, `src/ai/` |
| `src/ai/` | `src/game/types.ts`, `src/game/` funkcije za čitanje, `src/ai/` | DOM, `main.ts`, funkcije koje menjaju stanje (`tick`, `changeDirection`...) |
| `src/render.ts` | `src/game/types.ts` | `src/ai/`, menjanje stanja |
| `src/main.ts` | sve iznad | — |

## Pravila

- Funkcije u `src/game/` su čiste: isti ulaz → isti izlaz, ulaz se ne menja,
  vraća se nov objekat ili isti objekat kad nema promene.
- Slučajnost ulazi samo kao parametar `rng: Rng`. `Math.random` se prosleđuje
  jedino iz `main.ts`.
- Stanje igre (`GameState`) drži samo `main.ts` u jednoj promenljivoj `state`.
  Menja se isključivo dodelom rezultata funkcije iz `src/game/logic.ts`.
- AI sloj dobija stanje kroz `getState()` i vraća samo `HintResult`. Nikad ne
  dobija referencu kojom bi mogao da promeni `state`.
- Config ulazi kroz `loadConfig`; ostatak koda veruje samo validnom `GameConfig`.

## Tok podataka

```
tastatura / tajmer -> main.ts -> logic.ts (novo stanje) -> render.ts
klik na hint       -> main.ts -> hintFlow.ts -> validate -> tools.ts (čita) -> validate -> main.ts prikazuje tekst
```
