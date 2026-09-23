---
description: 'Podržane komande za Pixel Zmija i šta koja dokazuje.'
applyTo: '**/*'
---

# Komande

| Komanda | Šta radi | Kad |
|---|---|---|
| `npm install` | instalira zavisnosti | jednom, posle kloniranja |
| `npm run typecheck` | `tsc --noEmit` nad `src`, `tests`, `evals` | svaki korak |
| `npm test` | Vitest nad `tests/` | svaki korak od 1 |
| `npm run eval` | Vitest nad `evals/` (E1–E5) | Korak 4 i 5 |
| `npm run build` | typecheck + `vite build` | Koraci 3, 9, 10 |
| `npm run dev` | lokalni server za ručnu proveru | Koraci 3, 9 |

## Čuvanje izlaza

```bash
npm run eval 2>&1 | tee docs/runs/eval-baseline.txt   # Korak 4
npm run eval 2>&1 | tee docs/runs/eval-after.txt      # Korak 5
```

`npm run eval` vraća grešku ako eval pada; to je očekivano na baseline-u.

## Ne koristiti

- `npm audit fix --force`, `npm update` i instaliranje novih paketa van koraka.
- Komande koje pokreću server u pozadini bez potrebe.
- `git push`, deploy komande.
