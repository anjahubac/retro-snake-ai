---
description: 'Testovi, eval skup i dokazi za Pixel Zmija.'
applyTo: 'tests/**,evals/**,src/**'
---

# Testiranje

## Alati

- Vitest. `tests/` su unit testovi i AI test matrica, `evals/` je eval skup E1–E5.
- `npm test` pokreće samo `tests/`; `npm run eval` samo `evals/`.

## Pravila

- Testovi iz `docs/IMPLEMENTATION_STEPS.md` se prepisuju **tačno**. Implementacija
  se prilagođava testu, nikad obrnuto.
- Zabranjeno: `.skip`, `.only`, `.todo`, `it.fails`, brisanje asercija,
  labavljenje očekivanja (`toBe` → `toBeTruthy` i slično).
- Ako test deluje pogrešno: stani i pitaj, sa tačnim izlazom.
- Testovi koriste deterministički RNG (`() => 0` ili fiksna vrednost), nikad
  `Math.random`.
- `evals/` se **ne** popravlja da bi prošao. Eval koji pada na baseline-u je
  dokaz, a ne greška u eval-u.

## Šta je dokaz

- Stvaran izlaz komande, nalepljen u odgovor ili sačuvan u `docs/runs/`.
- Za AI flow: ne samo „funkcija postoji“, već šta je poslato, koliko puta,
  šta je vraćeno i šta se **nije** desilo (`toolCalls = 0`, spy nije pozvan).
- Za read-only: stanje je `toEqual(structuredClone(before))` posle poziva.

## Fake pre live

Svi testovi rade sa `createFakeClient`. Live provider nije deo `npm test` i
nije zamena za lokalne testove.
